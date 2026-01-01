"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  created_at: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
        
        // Set page title and meta description for SEO
        if (data.post) {
          document.title = data.post.meta_title || `${data.post.title} | Teach Anything Now`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc && data.post.meta_description) {
            metaDesc.setAttribute('content', data.post.meta_description);
          }
        }
      } else {
        router.push("/blog");
      }
    } catch (error) {
      console.error("Error fetching blog post:", error);
      router.push("/blog");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Handle slug parameter - could be string or array
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    if (slug) {
      fetchPost(slug);
    } else {
      setLoading(false);
      router.push("/blog");
    }
  }, [params.slug, fetchPost, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[var(--surface)]">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/landing" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Teach Anything Now" 
              width={250}
              height={83}
              className="logo-image"
            />
          </Link>
          
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Blog
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
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>

        <article>
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-[var(--surface)] text-[var(--text-secondary)] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
              <span>By {post.author}</span>
              <span>•</span>
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>

          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-[var(--text-primary)]
              prose-p:text-[var(--text-secondary)]
              prose-strong:text-[var(--text-primary)]
              prose-a:text-[var(--primary)] prose-a:no-underline hover:prose-a:underline
              prose-ul:text-[var(--text-secondary)]
              prose-ol:text-[var(--text-secondary)]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to create your own lesson materials?
          </h2>
          <p className="text-white/90 mb-6">
            Generate professional presentations, worksheets, audio, and images in minutes
          </p>
          <Link
            href="/auth/signin"
            className="inline-block px-8 py-3 bg-white text-[var(--primary)] font-medium rounded-full hover:bg-gray-100 transition-colors"
          >
            Get Started for £1
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center text-sm text-[var(--text-muted)]">
          <p>© 2025 Teach Anything Now. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

