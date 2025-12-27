"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function PaymentForm({ 
  topic, 
  clientSecret, 
  paymentIntentId, 
  onPaymentSuccess, 
  onCancel 
}: { 
  topic: string; 
  clientSecret: string; 
  paymentIntentId: string; 
  onPaymentSuccess: (paymentIntentId: string) => void; 
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      const { error: submitError } = await elements.submit();
      
      if (submitError) {
        setError(submitError.message || "Form validation failed");
        setLoading(false);
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}?payment_success=true&payment_intent=${paymentIntentId}`,
        },
        redirect: "if_required",
      });

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        setLoading(false);
      } else {
        onPaymentSuccess(paymentIntentId);
      }
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-[var(--background)] rounded-lg mb-4">
        <p className="text-sm text-[var(--text-secondary)] mb-1">Creating content for</p>
        <p className="font-medium text-[var(--text-primary)]">{topic}</p>
      </div>
      
      <PaymentElement />
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary flex-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="btn btn-primary flex-1"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing
            </span>
          ) : (
            "Pay £1.00"
          )}
        </button>
      </div>
    </form>
  );
}

function HomeContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<{
    presentation?: string;
    audio?: string;
    worksheet?: string;
    answerSheet?: string;
  }>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/landing");
    }
  }, [status, router]);

  useEffect(() => {
    if (searchParams.get("payment_success")) {
      const intentId = searchParams.get("payment_intent");
      if (intentId) {
        setPaymentIntentId(intentId);
        setShowPayment(false);
        if (topic) {
          handleGenerate(intentId);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleGenerate = async (intentId?: string) => {
    const paymentId = intentId || paymentIntentId;
    
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    if (!paymentId) {
      setError("Payment required");
      setShowPayment(true);
      return;
    }

    setLoading(true);
    setLoadingStatus("Generating your content...");
    setError("");
    setGeneratedFiles({});

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic: topic.trim(),
          paymentIntentId: paymentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate content");
      }

      setLoadingStatus("Preparing downloads...");
      const data = await response.json();
      setGeneratedFiles(data.files);
      setLoadingStatus("");
      setPaymentIntentId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoadingStatus("");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (intentId: string) => {
    setPaymentIntentId(intentId);
    setShowPayment(false);
    handleGenerate(intentId);
  };

  const handleStartPayment = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }
    
    setCreatingPayment(true);
    setError("");
    
    try {
      const { data } = await axios.post("/api/payment/create", { topic });
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setShowPayment(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create payment");
    } finally {
      setCreatingPayment(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasFiles = generatedFiles.presentation || generatedFiles.audio || generatedFiles.worksheet || generatedFiles.answerSheet;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Teach Anything Logo" 
              className="w-8 h-8"
            />
            <span className="text-lg font-semibold text-[var(--text-primary)]">Teach Anything Now</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--text-muted)] hidden sm:block">
              {session?.user?.email}
            </span>
            <button
              onClick={() => router.push("/account")}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Account
            </button>
            <button
              onClick={() => signOut()}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Input card */}
        <div className="card p-6 mb-6">
          <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
            Create lesson materials
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Enter any topic to generate a complete teaching package
          </p>

          {!showPayment ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Topic
                </label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Photosynthesis, World War II, Python basics"
                  className="input"
                  disabled={loading}
                  onKeyPress={(e) => e.key === "Enter" && !loading && handleStartPayment()}
                />
              </div>

              <button
                onClick={handleStartPayment}
                disabled={loading || !topic.trim() || creatingPayment}
                className="btn btn-primary w-full"
              >
                {creatingPayment ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Preparing...
                  </span>
                ) : loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </span>
                ) : (
                  "Generate for £1"
                )}
              </button>

              {loadingStatus && (
                <div className="flex items-center gap-3 p-4 bg-[var(--background)] rounded-lg">
                  <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[var(--text-primary)]">{loadingStatus}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">This may take 30-60 seconds</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
          ) : clientSecret && paymentIntentId ? (
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret, 
                appearance: { 
                  theme: "stripe",
                  variables: {
                    colorPrimary: '#00a884',
                    borderRadius: '8px',
                  }
                } 
              }}
            >
              <PaymentForm
                topic={topic}
                clientSecret={clientSecret}
                paymentIntentId={paymentIntentId}
                onPaymentSuccess={handlePaymentSuccess}
                onCancel={() => {
                  setShowPayment(false);
                  setClientSecret(null);
                  setPaymentIntentId(null);
                }}
              />
            </Elements>
          ) : null}
        </div>

        {/* Generated files */}
        {hasFiles && (
          <div className="card p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Your files are ready
            </h2>
            <div className="space-y-3">
              {generatedFiles.presentation && (
                <DownloadItem
                  href={`/api/download?file=${generatedFiles.presentation}`}
                  title="PowerPoint Presentation"
                  subtitle="Slides for your lesson"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  }
                />
              )}

              {generatedFiles.audio && (
                <DownloadItem
                  href={`/api/download?file=${generatedFiles.audio}`}
                  title="Podcast Audio"
                  subtitle="Audio explanation"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  }
                />
              )}

              {generatedFiles.worksheet && (
                <DownloadItem
                  href={`/api/download?file=${generatedFiles.worksheet}`}
                  title="Student Worksheet"
                  subtitle="Practice exercises"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                />
              )}

              {generatedFiles.answerSheet && (
                <DownloadItem
                  href={`/api/download?file=${generatedFiles.answerSheet}`}
                  title="Answer Key"
                  subtitle="For grading"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => {
                  setGeneratedFiles({});
                  setTopic("");
                }}
                className="text-sm text-[var(--primary)] font-medium hover:underline"
              >
                Create another lesson
              </button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Each package includes slides, audio, worksheet, and answers
          </p>
        </div>
      </main>
    </div>
  );
}

function DownloadItem({ 
  href, 
  title, 
  subtitle, 
  icon 
}: { 
  href: string; 
  title: string; 
  subtitle: string; 
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      download
      className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--background)] transition-all group"
    >
      <div className="w-10 h-10 bg-[var(--primary)] bg-opacity-10 rounded-lg flex items-center justify-center text-[var(--primary)] group-hover:bg-opacity-20 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[var(--text-primary)]">{title}</p>
        <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>
      </div>
      <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </a>
  );
}

// Wrap in Suspense for useSearchParams
export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
