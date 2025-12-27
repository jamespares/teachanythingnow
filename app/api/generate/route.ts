import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generatePPT } from "@/lib/ppt-generator";
import { generateAudio } from "@/lib/audio-generator";
import { generateContent } from "@/lib/content-generator";
import { generateWorksheet, generateAnswerSheet } from "@/lib/worksheet-generator";
import { generateImages, downloadImages } from "@/lib/image-generator";
import { promises as fs } from "fs";
import path from "path";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 });
    }

    const { topic, paymentIntentId } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment required - Please pay to generate content" }, { status: 402 });
    }

    // Verify payment was successful with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not completed - Please complete payment first" },
        { status: 402 }
      );
    }

    // Verify payment belongs to this user and update database if needed
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if payment exists in database
    const { data: existingPayment } = await supabaseAdmin
      .from("payments")
      .select("*")
      .eq("stripe_payment_intent_id", paymentIntentId)
      .eq("user_id", user.id)
      .single();

    if (!existingPayment) {
      return NextResponse.json(
        { error: "Payment not found for this user" },
        { status: 403 }
      );
    }

    // Update payment status to succeeded if Stripe confirms it
    if (existingPayment.status !== "succeeded") {
      await supabaseAdmin
        .from("payments")
        .update({ status: "succeeded" })
        .eq("stripe_payment_intent_id", paymentIntentId)
        .eq("user_id", user.id);
    }

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Generate content using AI
    const content = await generateContent(topic);
    const { slides, podcastScript, worksheet } = content;

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), "temp");
    await fs.mkdir(tempDir, { recursive: true });

    // Generate unique ID for this generation
    const timestamp = Date.now();
    const fileId = `${topic.toLowerCase().replace(/\s+/g, "_")}_${timestamp}`;

    // Generate PowerPoint file
    const pptBuffer = await generatePPT(slides, topic);
    const pptPath = path.join(tempDir, `${fileId}.pptx`);
    await fs.writeFile(pptPath, pptBuffer);

    // Generate audio
    const audioResult = await generateAudio(podcastScript, topic);
    const audioExtension = audioResult.isAudio ? "mp3" : "txt";
    const audioPath = path.join(tempDir, `${fileId}.${audioExtension}`);
    await fs.writeFile(audioPath, audioResult.buffer);

    // Generate worksheet (DOCX format for easy editing) and answer sheet (PDF for reference)
    const worksheetBuffer = await generateWorksheet(topic, worksheet.questions);
    const answerSheetBuffer = await generateAnswerSheet(topic, worksheet.questions);
    const worksheetPath = path.join(tempDir, `${fileId}_worksheet.docx`);
    const answerSheetPath = path.join(tempDir, `${fileId}_answers.pdf`);
    await fs.writeFile(worksheetPath, worksheetBuffer);
    await fs.writeFile(answerSheetPath, answerSheetBuffer);

    // Generate high-quality images (don't fail if images fail)
    const imageFiles: string[] = [];
    try {
      console.log(`Starting image generation for topic: ${topic}`);
      const imageResult = await generateImages(topic, slides);
      console.log(`Image generation result: ${imageResult.images.length} images`);
      
      if (imageResult.images.length > 0) {
        // Download images and save them
        console.log(`Downloading ${imageResult.images.length} images...`);
        const imageBuffers = await downloadImages(imageResult.images);
        console.log(`Downloaded ${imageBuffers.length} image buffers`);
        
        for (let i = 0; i < imageBuffers.length; i++) {
          const imageFileName = `${fileId}_image_${i + 1}.png`;
          const imagePath = path.join(tempDir, imageFileName);
          await fs.writeFile(imagePath, imageBuffers[i]);
          imageFiles.push(imageFileName);
          console.log(`Saved image: ${imageFileName}`);
        }
      } else {
        console.warn("No images were generated");
      }
    } catch (imageError) {
      console.error("Error generating images (non-fatal):", imageError);
      // Continue without images - don't fail the entire request
    }

    return NextResponse.json({
      files: {
        presentation: `${fileId}.pptx`,
        audio: `${fileId}.${audioExtension}`,
        worksheet: `${fileId}_worksheet.docx`,
        answerSheet: `${fileId}_answers.pdf`,
        images: imageFiles,
      },
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate content",
      },
      { status: 500 }
    );
  }
}
