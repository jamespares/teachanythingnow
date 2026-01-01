import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/blog
 * Returns published blog posts, optionally filtered by featured status
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "10");
    const debug = searchParams.get("debug") === "true";

    // For debugging: check all posts first
    if (debug) {
      const { data: allPosts, error: allError } = await supabaseAdmin
        .from("blog_posts")
        .select("id, slug, title, published, featured");
      
      console.log("All posts in database:", allPosts);
      if (allError) {
        console.error("Error fetching all posts:", allError);
      }
    }

    let query = supabaseAdmin
      .from("blog_posts")
      .select("id, slug, title, excerpt, author, tags, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (featured) {
      query = query.eq("featured", true);
    }

    const { data: posts, error } = await query;

    if (error) {
      console.error("Error fetching blog posts:", error);
      return NextResponse.json(
        { error: "Failed to fetch blog posts", details: error.message },
        { status: 500 }
      );
    }

    // Log for debugging
    console.log(`Found ${posts?.length || 0} published blog posts`);

    return NextResponse.json({
      posts: posts || [],
    });
  } catch (error) {
    console.error("Error in blog endpoint:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

