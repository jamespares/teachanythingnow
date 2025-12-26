"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check for error from callback
  const callbackError = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        // Log the error for debugging
        console.error("Sign in error from NextAuth:", result.error);
        
        // Show more specific error message
        let errorMessage = "Failed to send magic link. Please try again.";
        if (result.error === "EmailSignin") {
          errorMessage = "Failed to send the magic link email. Please check your email address and try again.";
        } else if (result.error === "Configuration") {
          errorMessage = "Email service is not properly configured. Please contact support.";
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Redirect to verify-request page on success
      router.push(`/auth/verify-request?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      console.error("Sign in error:", err);
      const errorMessage = err?.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Sign in
            </h1>
            <p className="text-[var(--text-secondary)]">
              Enter your email to receive a magic link
            </p>
          </div>

          {/* Error messages */}
          {(error || callbackError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                {error || getErrorMessage(callbackError)}
              </p>
            </div>
          )}

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
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending magic link...
                  </span>
                ) : (
                  "Send magic link"
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            We&apos;ll email you a secure sign-in link
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert error codes to user-friendly messages
function getErrorMessage(errorCode: string | null): string {
  switch (errorCode) {
    case "Configuration":
      return "There is a problem with the server configuration.";
    case "AccessDenied":
      return "Access denied. You may not have permission to sign in.";
    case "Verification":
      return "The magic link has expired or has already been used. Please request a new one.";
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
    case "EmailCreateAccount":
    case "Callback":
      return "There was an error signing in. Please try again.";
    case "OAuthAccountNotLinked":
      return "This email is already associated with another account.";
    case "EmailSignin":
      return "Failed to send the magic link email. Please try again.";
    case "CredentialsSignin":
      return "Invalid credentials. Please try again.";
    case "SessionRequired":
      return "Please sign in to access this page.";
    default:
      return "An error occurred during sign in. Please try again.";
  }
}

// Wrap in Suspense for useSearchParams
export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
