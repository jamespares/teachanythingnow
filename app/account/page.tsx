"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <img 
              src="/logo.png" 
              alt="Teach Anything Logo" 
              className="w-8 h-8"
            />
            <span className="text-lg font-semibold text-[var(--text-primary)]">Teach Anything Now</span>
          </button>
          
          <button
            onClick={() => signOut()}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Account</h1>

        {/* Profile card */}
        <div className="card p-6 mb-4">
          <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide mb-4">
            Profile
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Email</p>
              <p className="text-[var(--text-primary)]">{session?.user?.email}</p>
            </div>
            {session?.user?.name && (
              <div>
                <p className="text-sm text-[var(--text-muted)]">Name</p>
                <p className="text-[var(--text-primary)]">{session.user.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing card */}
        <div className="card p-6 mb-4">
          <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide mb-4">
            Pricing
          </h2>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">£1</span>
            <span className="text-[var(--text-secondary)]">per lesson package</span>
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Pay only when you generate content. No subscription.
          </p>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              PowerPoint presentation
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Podcast audio
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Student worksheet
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Answer key
            </li>
          </ul>
        </div>

        {/* Actions */}
        <button
          onClick={() => router.push("/")}
          className="btn btn-primary w-full"
        >
          Create lesson materials
        </button>
      </main>
    </div>
  );
}
