import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/packages
 * Returns all packages (generations) for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 });
    }

    // Get user from database
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

    // Get all packages for this user, ordered by most recent first
    const { data: packages, error } = await supabaseAdmin
      .from("packages")
      .select("id, topic, file_id, files, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching packages:", error);
      return NextResponse.json(
        { error: "Failed to fetch packages" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      packages: packages || [],
    });
  } catch (error) {
    console.error("Error in packages endpoint:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

