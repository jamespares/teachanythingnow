/** @jsxImportSource hono/jsx */
import { FC, PropsWithChildren } from "hono/jsx";
import type { Lang, Dict } from "../lib/i18n";

export const Layout: FC<PropsWithChildren<{ title?: string; lang: Lang; dict: Dict }>> = ({ children, title, lang, dict }) => {
  return (
    <html lang={lang}>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | ${dict.siteName}` : dict.siteName}</title>
        <meta name="description" content="Create a complete educational lesson package in 60 seconds. Includes slides, podcast audio, worksheets, and AI images." />
        <link rel="stylesheet" href="/styles.css" />
        <style>{`.hidden { display: none !important; }`}</style>
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `
          document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              const u = new URL(location.href);
              u.searchParams.set('lang', btn.getAttribute('data-lang'));
              location.href = u.toString();
            });
          });
          window.addEventListener('scroll', () => {
            const header = document.querySelector('.site-header');
            if (header) {
              if (window.scrollY > 50) header.classList.add('nav-scrolled');
              else header.classList.remove('nav-scrolled');
            }
          });
        `}} />

        {/* Organic wavy background */}
        <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style="background: var(--base-bg);">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" class="absolute top-0 left-0 w-full h-full">
            <path fill="var(--accent-bg)" d="M0,0 L1440,0 L1440,250 C1100,400 900,100 500,250 C200,350 0,150 0,150 Z" />
            <path fill="var(--accent-bg-light)" d="M1440,900 L0,900 L0,750 C300,550 500,850 900,650 C1200,500 1440,750 1440,750 Z" />
          </svg>
        </div>
        {children}
      </body>
    </html>
  );
};
