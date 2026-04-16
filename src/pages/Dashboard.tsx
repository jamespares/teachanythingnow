/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "./Layout";

export const Dashboard: FC<{ user: any; packages: any[] }> = ({ user, packages }) => {
  return (
    <Layout title="My Dashboard">
      <div className="min-h-screen bg-[var(--background)]">
        <header className="h-16 flex items-center justify-between px-6 max-w-7xl mx-auto border-b border-[var(--border)]">
          <a href="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">Teach Anything Now</h1>
          </a>
          <nav className="flex items-center gap-6">
            <span className="text-sm text-[var(--text-secondary)]">{user.email}</span>
            <a href="/" className="text-sm hover:text-[var(--primary)] transition-colors">Create New</a>
          </nav>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">My Lesson Packages</h2>
          </div>

          {packages.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-[var(--text-secondary)] mb-6">You haven't generated any lessons yet.</p>
              <a href="/" className="btn btn-primary">Create your first lesson</a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => {
                const files = JSON.parse(pkg.files);
                return (
                  <div key={pkg.id} className="card p-6 flex flex-col hover:border-[var(--primary)] transition-colors group">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--primary)] transition-colors">{pkg.topic}</h3>
                      <p className="text-xs text-[var(--text-muted)] mb-6">Generated on {new Date(pkg.createdAt).toLocaleDateString()}</p>
                      
                      <div className="space-y-3">
                        {files.presentation && <DownloadLink href={`/api/download?file=${files.presentation}`} label="PowerPoint Presentation" />}
                        {files.audio && <DownloadLink href={`/api/download?file=${files.audio}`} label="Podcast Audio" />}
                        {files.worksheet && <DownloadLink href={`/api/download?file=${files.worksheet}`} label="Student Worksheet" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

const DownloadLink: FC<{ href: string; label: string }> = ({ href, label }) => (
  <a href={href} download className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] hover:bg-white/5 transition-colors">
    <span className="text-sm">{label}</span>
    <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  </a>
);
