/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "../components/Layout";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import type { Lang, Dict } from "../lib/i18n";

export const Dashboard: FC<{ user: any; packages: any[]; lang: Lang; dict: Dict }> = ({ user, packages, lang, dict }) => {
  return (
    <Layout title={dict.dashTitle} lang={lang} dict={dict}>
      <div class="min-h-screen flex flex-col">
        <Navbar dict={dict} user={user} showDashboard={false} />

        <main class="site-main flex-1">
          <div class="dash-heading-row">
            <h2 class="font-accent text-3xl font-normal tracking-tight">{dict.dashHeading}</h2>
          </div>

          {packages.length === 0 ? (
            <div class="card p-10 text-center">
              <p class="text-secondary mb-6">{dict.dashEmptyMsg}</p>
              <a href="/" class="btn btn-primary">{dict.dashEmptyBtn}</a>
            </div>
          ) : (
            <div class="packages-grid">
              {packages.map((pkg) => {
                const files = JSON.parse(pkg.files);
                const locale = lang === "zh" ? "zh-CN" : lang === "fr" ? "fr-FR" : "en-GB";
                return (
                  <div key={pkg.id} class="card card-hover package-card">
                    <h3 class="text-xl mb-2">{pkg.topic}</h3>
                    <p class="text-xs text-muted mb-6">
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

        <Footer dict={dict} showLegal={false} />
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
