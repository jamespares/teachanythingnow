import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

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

    if (user) {
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
        // File doesn't belong to user's packages - check if it's a recent generation
        // Allow access if file exists and was created recently (within last hour)
        // This handles the case where package wasn't saved yet
        const filePath = join(process.cwd(), "temp", filename);
        if (existsSync(filePath)) {
          const { stat } = await import("fs/promises");
          const stats = await stat(filePath);
          const oneHourAgo = Date.now() - 60 * 60 * 1000;
          if (stats.mtimeMs > oneHourAgo) {
            // Recent file, allow access
          } else {
            return NextResponse.json({ error: "File access denied" }, { status: 403 });
          }
        } else {
          return NextResponse.json({ error: "File not found" }, { status: 404 });
        }
      }
    }

    const filePath = join(process.cwd(), "temp", filename);

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = await readFile(filePath);

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

    return new NextResponse(fileBuffer, {
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

