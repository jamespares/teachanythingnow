/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "./Layout";
import type { Lang, Dict } from "../lib/i18n";

export const Dashboard: FC<{ user: any; packages: any[]; lang: Lang; dict: Dict }> = ({ user, packages, lang, dict }) => {
  return (
    <Layout title={dict.dashTitle} lang={lang} dict={dict}>
      <div class="page-wrapper">

        {/* Header */}
        <header class="site-header">
          <a href="/" class="brand">
            <img src="/logo.png" alt={dict.siteName} />
          </a>
          <nav class="site-nav">
            <span class="text-sm font-semibold" style="color:var(--text-primary);">{user.email}</span>
            <a href="/" class="text-sm font-semibold" style="transition:color 0.2s; color:var(--text-primary);" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-primary)'">{dict.dashNavCreateNew}</a>
            <button id="sign-out" class="text-sm btn btn-secondary" style="padding:0.4rem 0.9rem;">{dict.dashNavSignOut}</button>
          </nav>
        </header>

        {/* Main */}
        <main class="site-main">
          <div class="dash-heading-row">
            <h2 style="font-size:2rem; letter-spacing:-0.03em;">{dict.dashHeading}</h2>
          </div>

          {packages.length === 0 ? (
            <div class="card" style="padding:3rem; text-align:center;">
              <p class="text-secondary" style="margin:0 0 1.5rem;">{dict.dashEmptyMsg}</p>
              <a href="/" class="btn btn-primary">{dict.dashEmptyBtn}</a>
            </div>
          ) : (
            <div class="packages-grid">
              {packages.map((pkg) => {
                const files = JSON.parse(pkg.files);
                const locale = lang === "zh" ? "zh-CN" : lang === "fr" ? "fr-FR" : "en-GB";
                return (
                  <div key={pkg.id} class="card card-hover package-card">
                    <h3 style="font-size:1.25rem; margin-bottom:0.5rem; color:var(--text-primary);">{pkg.topic}</h3>
                    <p class="text-xs text-muted" style="margin:0 0 1.5rem;">
                      {dict.dashGeneratedOn} {new Date(pkg.createdAt).toLocaleDateString(locale)}
                    </p>
                    <div>
                      {files.presentation && <DownloadLink href={`/api/download?file=${files.presentation}`} label={dict.dashDownloadPPT} />}
                      {files.audio        && <DownloadLink href={`/api/download?file=${files.audio}`}        label={dict.dashDownloadPodcast} />}
                      {files.worksheet    && <DownloadLink href={`/api/download?file=${files.worksheet}`}    label={dict.dashDownloadWorksheet} />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
      <script type="module" dangerouslySetInnerHTML={{ __html: `
        import { createAuthClient } from "https://esm.sh/better-auth@1.1.1/client";
        const client = createAuthClient({ baseURL: window.location.origin });
        document.getElementById('sign-out').addEventListener('click', async () => {
          await client.signOut();
          window.location.href = '/';
        });
      `}} />
    </Layout>
  );
};

const DownloadLink: FC<{ href: string; label: string }> = ({ href, label }) => (
  <a href={href} download class="btn btn-secondary" style="width:100%; justify-content:space-between; margin-bottom:0.75rem; padding:0.6rem 1.25rem; font-size:0.9rem;">
    <span>{label}</span>
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  </a>
);
