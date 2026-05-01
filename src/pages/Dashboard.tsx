/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "../components/Layout";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Dashboard: FC<{ user: any; packages: any[] }> = ({ user, packages }) => {
  return (
    <Layout title="My Dashboard">
      <div class="min-h-screen flex flex-col">
        <Navbar user={user} showDashboard={false} />

        <main class="site-main flex-1">
          <div class="dash-heading-row">
            <h2 class="font-accent text-3xl font-normal tracking-tight">My Lesson Packages</h2>
          </div>

          {packages.length === 0 ? (
            <div class="card p-10 text-center">
              <p class="text-secondary mb-6">You haven't generated any lessons yet.</p>
              <a href="/" class="btn btn-primary">Create your first lesson</a>
            </div>
          ) : (
            <div class="packages-grid">
              {packages.map((pkg) => {
                const files = JSON.parse(pkg.files);
                return (
                  <div key={pkg.id} class="card card-hover package-card">
                    <h3 class="text-xl mb-2">{pkg.topic}</h3>
                    <p class="text-xs text-muted mb-6">
                      Generated on {new Date(pkg.createdAt).toLocaleDateString("en-GB")}
                    </p>
                    <div>
                      {files.presentation && <DownloadLink href={`/api/download?file=${files.presentation}`} label="PowerPoint Presentation" />}
                      {files.audio        && <DownloadLink href={`/api/download?file=${files.audio}`}        label="Podcast Audio" />}
                      {files.worksheet    && <DownloadLink href={`/api/download?file=${files.worksheet}`}    label="Student Worksheet" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        <Footer showLegal={false} />
      </div>
    </Layout>
  );
};

const DownloadLink: FC<{ href: string; label: string }> = ({ href, label }) => (
  <a href={href} download class="download-link">
    <span>{label}</span>
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  </a>
);
