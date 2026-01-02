import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin, downloadFromStorage } from "@/lib/supabase";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get("file");

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    // Security: prevent directory traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    // Verify file ownership - check if file belongs to a package owned by this user
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract file_id from filename (format: fileId.ext or fileId_suffix.ext)
    const fileIdMatch = filename.match(/^([^_]+(?:_[^_]+)*?)(?:_(?:worksheet|answers|image_\d+))?\./);
    const fileId = fileIdMatch ? fileIdMatch[1] : filename.split('.')[0];

    // Check if this file belongs to a package owned by the user
    const { data: packageData } = await supabaseAdmin
    .from("packages")
    .select("id, files")
    .eq("user_id", user.id)
    .eq("file_id", fileId)
    .single();

    if (!packageData) {
        // Strict security: No fallback to "recent files"
        return NextResponse.json({ error: "File access denied" }, { status: 403 });
    }

    // Download from Supabase Storage
    const { data, error } = await downloadFromStorage(filename);

    if (error || !data) {
        console.error("File not found in storage:", filename);
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Determine content type based on file extension
    const ext = filename.split(".").pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      pdf: "application/pdf",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      txt: "text/plain",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
    };

    const contentType = contentTypeMap[ext || ""] || "application/octet-stream";

    // Convert Blob to ArrayBuffer then to Buffer
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`, 
      },
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}