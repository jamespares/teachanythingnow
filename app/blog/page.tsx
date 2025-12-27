"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  tags: string[];
  created_at: string;
}

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Teach Anything Logo" 
              width={32}
              height={32}
            />
            <span className="text-lg font-semibold text-[var(--text-primary)]">Teach Anything Now</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link
              href="/landing"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Home
            </Link>
            <Link
              href="/auth/signin"
              className="btn btn-primary text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
            Teaching Resources Blog
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Expert tips, guides, and insights for educators creating engaging lesson materials
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-[var(--text-secondary)] py-12">
            No blog posts yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/blog/${post.slug}`)}
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-[var(--surface)] text-[var(--text-secondary)] rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-3 hover:text-[var(--primary)] transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-[var(--text-secondary)] mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
                  <span>By {post.author}</span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-sm text-[var(--text-muted)]">
          <p>© 2025 Teach Anything Now. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

