"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
      });

      if (result?.ok) {
        setSent(true);
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="w-full max-w-sm">
          {!sent ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  Sign in
                </h1>
                <p className="text-[var(--text-secondary)]">
                  Enter your email to continue
                </p>
              </div>

              <div className="card p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[var(--text-primary)] mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="input"
                      placeholder="you@example.com"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="btn btn-primary w-full"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending link...
                      </span>
                    ) : (
                      "Continue with email"
                    )}
                  </button>
                </form>
              </div>

              <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
                We&apos;ll send you a sign-in link
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--primary)] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                Check your email
              </h1>
              <p className="text-[var(--text-secondary)] mb-6">
                We sent a sign-in link to<br />
                <span className="font-medium text-[var(--text-primary)]">{email}</span>
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-[var(--primary)] font-medium hover:underline"
              >
                Use a different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
