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

    // Validate input with strict checks
    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Sanitize and validate topic length (prevent abuse)
    const sanitizedTopic = topic.trim();
    if (sanitizedTopic.length > 500) {
      return NextResponse.json({ error: "Topic is too long (maximum 500 characters)" }, { status: 400 });
    }

    if (sanitizedTopic.length < 3) {
      return NextResponse.json({ error: "Topic is too short (minimum 3 characters)" }, { status: 400 });
    }

    if (!paymentIntentId || typeof paymentIntentId !== "string" || paymentIntentId.length > 255) {
      return NextResponse.json({ error: "Payment required - Please pay to generate content" }, { status: 402 });
    }

    // Get user from database
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id, stripe_customer_id")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // CRITICAL SECURITY: Verify payment with Stripe FIRST (source of truth)
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error("Error retrieving payment intent:", error);
      return NextResponse.json(
        { error: "Invalid payment - Payment not found" },
        { status: 402 }
      );
    }
    
    // Verify payment status
    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not completed - Please complete payment first" },
        { status: 402 }
      );
    }

    // CRITICAL SECURITY: Verify payment amount (£1.00 = 100 pence)
    const EXPECTED_AMOUNT = 100;
    if (paymentIntent.amount !== EXPECTED_AMOUNT) {
      console.error(`Payment amount mismatch: expected ${EXPECTED_AMOUNT}, got ${paymentIntent.amount}`);
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 402 }
      );
    }

    // CRITICAL SECURITY: Verify payment currency
    if (paymentIntent.currency.toLowerCase() !== "gbp") {
      console.error(`Payment currency mismatch: expected gbp, got ${paymentIntent.currency}`);
      return NextResponse.json(
        { error: "Invalid payment currency" },
        { status: 402 }
      );
    }

    // CRITICAL SECURITY: Verify payment customer matches authenticated user
    if (paymentIntent.customer !== user.stripe_customer_id) {
      console.error(`Payment customer mismatch: expected ${user.stripe_customer_id}, got ${paymentIntent.customer}`);
      return NextResponse.json(
        { error: "Payment does not belong to this user" },
        { status: 403 }
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

    // CRITICAL SECURITY: Check if payment has already been used (prevents reuse)
    if (existingPayment.used_at) {
      console.warn(`Payment ${paymentIntentId} attempted reuse by user ${user.id}`);
      return NextResponse.json(
        { error: "This payment has already been used. Please create a new payment for each generation." },
        { status: 403 }
      );
    }

    // Update payment status to succeeded if Stripe confirms it (in case webhook missed it)
    if (existingPayment.status !== "succeeded") {
      await supabaseAdmin
        .from("payments")
        .update({ status: "succeeded" })
        .eq("stripe_payment_intent_id", paymentIntentId)
        .eq("user_id", user.id);
    }

    // CRITICAL SECURITY: Atomically mark payment as used to prevent race conditions
    // This UPDATE will only succeed if used_at is still NULL (not already used)
    const { data: updatedPayment, error: updateError } = await supabaseAdmin
      .from("payments")
      .update({ 
        used_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("stripe_payment_intent_id", paymentIntentId)
      .eq("user_id", user.id)
      .is("used_at", null) // CRITICAL: Only update if not already used
      .select()
      .single();

    if (updateError || !updatedPayment) {
      // Payment was already used (race condition caught)
      console.warn(`Payment ${paymentIntentId} was already consumed (race condition)`);
      return NextResponse.json(
        { error: "This payment has already been used. Please create a new payment for each generation." },
        { status: 403 }
      );
    }

    // SECURITY: Rate limiting - Check for suspicious activity (multiple rapid generations)
    // This is a soft check - actual rate limiting should be done at infrastructure level
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { count: recentGenerations } = await supabaseAdmin
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .not("used_at", "is", null)
      .gte("used_at", oneMinuteAgo);

    if (recentGenerations && recentGenerations > 10) {
      console.warn(`Rate limit warning: User ${user.id} has ${recentGenerations} generations in the last minute`);
      // Don't block, but log for monitoring
    }

    // Generate content using AI (use sanitized topic)
    const content = await generateContent(sanitizedTopic);
    const { slides, podcastScript, worksheet } = content;

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), "temp");
    await fs.mkdir(tempDir, { recursive: true });

    // Generate unique ID for this generation (use sanitized topic)
    const timestamp = Date.now();
    const fileId = `${sanitizedTopic.toLowerCase().replace(/[^a-z0-9_]/g, "_").substring(0, 50)}_${timestamp}`;

    // Generate PowerPoint file (use sanitized topic)
    const pptBuffer = await generatePPT(slides, sanitizedTopic);
    const pptPath = path.join(tempDir, `${fileId}.pptx`);
    await fs.writeFile(pptPath, pptBuffer);

    // Generate audio (use sanitized topic) - always returns MP3
    const audioResult = await generateAudio(podcastScript, sanitizedTopic);
    const audioPath = path.join(tempDir, `${fileId}.mp3`);
    await fs.writeFile(audioPath, audioResult.buffer);

    // Generate worksheet (DOCX format for easy editing) and answer sheet (PDF for reference)
    const worksheetBuffer = await generateWorksheet(sanitizedTopic, worksheet.questions);
    const answerSheetBuffer = await generateAnswerSheet(sanitizedTopic, worksheet.questions);
    const worksheetPath = path.join(tempDir, `${fileId}_worksheet.docx`);
    const answerSheetPath = path.join(tempDir, `${fileId}_answers.pdf`);
    await fs.writeFile(worksheetPath, worksheetBuffer);
    await fs.writeFile(answerSheetPath, answerSheetBuffer);

    // Generate high-quality images (don't fail if images fail)
    const imageFiles: string[] = [];
    try {
      console.log(`Starting image generation for topic: ${sanitizedTopic}`);
      const imageResult = await generateImages(sanitizedTopic, slides);
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

    // Prepare files object for response and database
    const filesData = {
      presentation: `${fileId}.pptx`,
      audio: `${fileId}.mp3`,
      worksheet: `${fileId}_worksheet.docx`,
      answerSheet: `${fileId}_answers.pdf`,
      images: imageFiles,
    };

    // Save package to database for user to view and redownload later
    try {
      const { data: payment } = await supabaseAdmin
        .from("payments")
        .select("id")
        .eq("stripe_payment_intent_id", paymentIntentId)
        .eq("user_id", user.id)
        .single();

      await supabaseAdmin
        .from("packages")
        .insert({
          user_id: user.id,
          payment_id: payment?.id || null,
          topic: sanitizedTopic,
          file_id: fileId,
          files: filesData,
        });
    } catch (dbError) {
      // Log error but don't fail the request - package generation succeeded
      console.error("Error saving package to database:", dbError);
    }

    return NextResponse.json({
      files: filesData,
      packageId: fileId, // Return package ID for reference
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
