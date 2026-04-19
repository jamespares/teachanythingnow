/** @jsxImportSource hono/jsx */
import { FC, PropsWithChildren } from "hono/jsx";
import type { Lang, Dict } from "../lib/i18n";

export const Layout: FC<PropsWithChildren<{ title?: string; lang: Lang; dict: Dict }>> = ({ children, title, lang, dict }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | ${dict.siteName}` : dict.siteName}</title>
        <link rel="stylesheet" href="/globals.css" />
        <style>{`
          .hidden { display: none !important; }
        `}</style>
      </head>
      <body>
        {/* Language toggle — fixed top-right */}
        <div style="position:fixed; top:1rem; right:1rem; z-index:100; display:flex; gap:0.25rem; background:rgba(255,255,255,0.85); backdrop-filter:blur(8px); padding:0.35rem 0.5rem; border-radius:999px; box-shadow:var(--shadow-sm); border:1px solid var(--border);">
          {[
            { code: "en", label: dict.langToggleEn },
            { code: "fr", label: dict.langToggleFr },
            { code: "zh", label: dict.langToggleZh },
          ].map((l) => (
            <a
              key={l.code}
              href="#"
              onclick={`const u=new URL(location.href);u.searchParams.set('lang','${l.code}');location.href=u.toString();return false;`}
              style={`font-size:0.8rem; font-weight:600; padding:0.25rem 0.6rem; border-radius:999px; text-decoration:none; transition:all 0.2s; ${lang === l.code ? 'background:var(--primary); color:#fff;' : 'color:var(--text-secondary);'}`}
              onmouseenter={`if('${lang}'!=='${l.code}')this.style.background='var(--pastel-green)'`}
              onmouseleave={`if('${lang}'!=='${l.code}')this.style.background='transparent'`}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Organic wavy background */}
        <div style="position:fixed; inset:0; z-index:-1; background:var(--background); overflow:hidden;">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute; width:100%; height:100%; top:0; left:0;">
            <path fill="var(--pastel-green)" d="M0,0 L1440,0 L1440,250 C1100,400 900,100 500,250 C200,350 0,150 0,150 Z" />
            <path fill="var(--pastel-green-light)" d="M1440,900 L0,900 L0,750 C300,550 500,850 900,650 C1200,500 1440,750 1440,750 Z" />
          </svg>
        </div>
        {children}
      </body>
    </html>
  );
};
