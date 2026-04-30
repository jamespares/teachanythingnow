/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import type { Dict } from "../lib/i18n";

interface NavbarProps {
  dict: Dict;
  user?: { email: string } | null;
  showDashboard?: boolean;
}

export const Navbar: FC<NavbarProps> = ({ dict, user, showDashboard = true }) => {
  return (
    <header class="site-header">
      <a href="/" class="brand">
        <img src="/logo.png" alt={dict.siteName} />
      </a>
      <nav class="site-nav">
        <div class="lang-toggle mr-3">
          {[
            { code: "en", label: dict.langToggleEn },
            { code: "fr", label: dict.langToggleFr },
            { code: "zh", label: dict.langToggleZh },
          ].map((l) => (
            <a key={l.code} href="#" data-lang={l.code} class={`lang-btn ${l.code === "en" ? "active" : ""}`}>
              {l.label}
            </a>
          ))}
        </div>
        {user ? (
          <>
            {showDashboard && (
              <a href="/dashboard" class="text-sm font-semibold transition-colors" style="color:var(--base-text);" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--base-text)'">
                {dict.homeNavMyPackages}
              </a>
            )}
            <button id="sign-out" class="btn btn-secondary btn-sm">{dict.homeNavSignOut}</button>
            <script type="module" dangerouslySetInnerHTML={{
              __html: `
              import { createAuthClient } from "https://esm.sh/better-auth@1.1.1/client";
              const client = createAuthClient({ baseURL: window.location.origin });
              document.getElementById('sign-out').addEventListener('click', async () => {
                await client.signOut();
                window.location.href = '/';
              });
            `}} />
          </>
        ) : (
          <a href="/login" class="btn btn-primary">{dict.homeNavSignIn}</a>
        )}
      </nav>
    </header>
  );
};
