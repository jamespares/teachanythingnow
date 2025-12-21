"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <button 
            onClick={() => router.push("/landing")}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-[var(--text-primary)]">Teach Anything</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          {/* Email icon */}
          <div className="w-20 h-20 bg-[var(--primary)] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
            Check your email
          </h1>
          
          <p className="text-[var(--text-secondary)] mb-2">
            We sent a magic link to
          </p>
          
          {email && (
            <p className="font-medium text-[var(--text-primary)] mb-6">
              {email}
            </p>
          )}

          <div className="card p-5 mb-6 text-left">
            <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">
              Next steps:
            </h3>
            <ol className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-[var(--primary)] bg-opacity-10 rounded-full flex items-center justify-center text-xs font-medium text-[var(--primary)]">1</span>
                <span>Open your email inbox</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-[var(--primary)] bg-opacity-10 rounded-full flex items-center justify-center text-xs font-medium text-[var(--primary)]">2</span>
                <span>Find the email from Teach Anything</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-[var(--primary)] bg-opacity-10 rounded-full flex items-center justify-center text-xs font-medium text-[var(--primary)]">3</span>
                <span>Click the &quot;Sign in&quot; button</span>
              </li>
            </ol>
          </div>

          <p className="text-xs text-[var(--text-muted)] mb-4">
            The link expires in 24 hours. Check your spam folder if you don&apos;t see it.
          </p>

          <button
            onClick={() => router.push("/auth/signin")}
            className="text-sm text-[var(--primary)] font-medium hover:underline"
          >
            Use a different email
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyRequest() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyRequestContent />
    </Suspense>
  );
}

