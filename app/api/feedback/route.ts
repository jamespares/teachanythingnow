import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { type, message, page_url, user_agent } = body;

    if (!message || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get user ID if logged in
    let userId = null;
    if (session?.user?.email) {
      const { data: user } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", session.user.email)
        .single();
      
      if (user) {
        userId = user.id;
      }
    }

    const { error } = await supabaseAdmin
      .from("feedback")
      .insert({
        user_id: userId,
        type,
        message,
        page_url,
        user_agent: user_agent || request.headers.get("user-agent"),
      });

    if (error) {
      console.error("Error inserting feedback:", error);
      return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in feedback route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
