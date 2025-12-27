"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // Map error codes to user-friendly messages
  const getErrorDetails = (errorCode: string | null) => {
    switch (errorCode) {
      case "Configuration":
        return {
          title: "Configuration Error",
          message: "There is a problem with the server configuration. Please contact support if this persists.",
        };
      case "AccessDenied":
        return {
          title: "Access Denied",
          message: "You do not have permission to sign in. Please contact support if you believe this is an error.",
        };
      case "Verification":
        return {
          title: "Link Expired",
          message: "The magic link has expired or has already been used. Please request a new sign-in link.",
        };
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
      case "EmailCreateAccount":
      case "Callback":
        return {
          title: "Sign In Error",
          message: "There was an error during the sign-in process. Please try again.",
        };
      case "OAuthAccountNotLinked":
        return {
          title: "Account Already Exists",
          message: "This email is already associated with another account. Please sign in using your original method.",
        };
      case "EmailSignin":
        return {
          title: "Email Error",
          message: "We couldn't send the magic link email. Please check your email address and try again.",
        };
      case "SessionRequired":
        return {
          title: "Session Expired",
          message: "Your session has expired. Please sign in again to continue.",
        };
      default:
        return {
          title: "Authentication Error",
          message: "An unexpected error occurred during authentication. Please try again.",
        };
    }
  };

  const { title, message } = getErrorDetails(error);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <button 
            onClick={() => router.push("/landing")}
            className="flex items-center gap-2"
          >
            <img 
              src="/logo.png" 
              alt="Teach Anything Now Logo" 
              className="w-8 h-8"
            />
            <span className="text-lg font-semibold text-[var(--text-primary)]">Teach Anything Now</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          {/* Error icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
            {title}
          </h1>
          
          <p className="text-[var(--text-secondary)] mb-8">
            {message}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/auth/signin")}
              className="btn btn-primary w-full"
            >
              Try again
            </button>
            
            <button
              onClick={() => router.push("/landing")}
              className="btn btn-secondary w-full"
            >
              Go to homepage
            </button>
          </div>

          {error && (
            <p className="mt-6 text-xs text-[var(--text-muted)]">
              Error code: {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}

