"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Package {
  id: string;
  topic: string;
  file_id: string;
  files: {
    presentation?: string;
    audio?: string;
    worksheet?: string;
    answerSheet?: string;
    images?: string[];
  };
  created_at: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      setLoading(false);
      fetchPackages();
    }
  }, [status, router]);

  const fetchPackages = async () => {
    try {
      setLoadingPackages(true);
      const response = await fetch("/api/packages");
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoadingPackages(false);
    }
  };

  const downloadFile = (filename: string) => {
    window.open(`/api/download?file=${encodeURIComponent(filename)}`, "_blank");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
      <header className="bg-transparent">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo Text */}
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <h1 className="text-2xl font-bold text-white underline">Teach Anything Now</h1>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </button>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-white hover:text-gray-200 transition-colors"
            >
              Create Materials
            </button>
            <button
              onClick={() => signOut()}
              className="text-sm text-white hover:text-gray-200 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold text-white mb-6">Account</h1>

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

        {/* My Packages */}
        <div className="card p-6 mb-4">
          <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide mb-4">
            My Packages
          </h2>
          {loadingPackages ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : packages.length === 0 ? (
            <p className="text-[var(--text-secondary)] text-center py-8">
              No packages yet. Create your first lesson package to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="border border-[var(--border)] rounded-lg p-4 hover:bg-[var(--surface)] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)] mb-1">
                        {pkg.topic}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        {formatDate(pkg.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {pkg.files.presentation && (
                      <button
                        onClick={() => downloadFile(pkg.files.presentation!)}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-[var(--surface)] hover:bg-[var(--border)] rounded border border-[var(--border)] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Presentation
                      </button>
                    )}
                    {pkg.files.audio && (
                      <button
                        onClick={() => downloadFile(pkg.files.audio!)}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-[var(--surface)] hover:bg-[var(--border)] rounded border border-[var(--border)] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        Audio
                      </button>
                    )}
                    {pkg.files.worksheet && (
                      <button
                        onClick={() => downloadFile(pkg.files.worksheet!)}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-[var(--surface)] hover:bg-[var(--border)] rounded border border-[var(--border)] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Worksheet
                      </button>
                    )}
                    {pkg.files.answerSheet && (
                      <button
                        onClick={() => downloadFile(pkg.files.answerSheet!)}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-[var(--surface)] hover:bg-[var(--border)] rounded border border-[var(--border)] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Answers
                      </button>
                    )}
                    {pkg.files.images && pkg.files.images.length > 0 && (
                      <div className="col-span-2 sm:col-span-4">
                        <p className="text-xs text-[var(--text-muted)] mb-2">Images ({pkg.files.images.length}):</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {pkg.files.images.map((image, idx) => (
                            <button
                              key={idx}
                              onClick={() => downloadFile(image)}
                              className="flex items-center gap-2 px-3 py-2 text-sm bg-[var(--surface)] hover:bg-[var(--border)] rounded border border-[var(--border)] transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Image {idx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
