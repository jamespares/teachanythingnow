/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";

interface NavbarProps {
  user?: { email: string } | null;
  showDashboard?: boolean;
}

export const Navbar: FC<NavbarProps> = ({ user, showDashboard = true }) => {
  return (
    <header class="site-header">
      <a href="/" class="brand">
        <img src="/ll-logo.png" alt="" />
        <span class="font-accent">Last Minute Lessons</span>
      </a>
      <nav class="site-nav">
        {user ? (
          <>
            {showDashboard && (
              <a href="/dashboard" class="text-sm font-semibold transition-colors" style="color:var(--base-text);" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--base-text)'">
                My Packages
              </a>
            )}
            <button id="sign-out" class="btn btn-secondary btn-sm">Sign out</button>
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
          <a href="/login" class="btn btn-primary">Sign in</a>
        )}
      </nav>
    </header>
  );
};
