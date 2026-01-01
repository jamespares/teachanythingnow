"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Email icon */}
        <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Check your email
        </h1>
        
        <p className="text-gray-200 mb-2">
          We sent a magic link to
        </p>
        
        {email && (
          <p className="font-semibold text-white mb-8">
            {email}
          </p>
        )}

        <div className="card border border-[var(--border)] rounded-lg p-6 mb-6 text-left">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">
            Next steps:
          </h3>
          <ol className="space-y-3 text-[var(--text-secondary)]">
            <li className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center text-sm font-semibold text-white">1</span>
              <span>Open your email inbox</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center text-sm font-semibold text-white">2</span>
              <span>Find the email from Teach Anything Now</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center text-sm font-semibold text-white">3</span>
              <span>Click the &quot;Sign in&quot; button</span>
            </li>
          </ol>
        </div>

        <p className="text-sm text-gray-300">
          The link expires in 24 hours. Check your spam folder if you don&apos;t see it.
        </p>
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

