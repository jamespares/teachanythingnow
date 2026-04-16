/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "./Layout";

export const Auth: FC = () => {
  return (
    <Layout title="Sign In">
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card w-full max-w-md p-8 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
            <p className="text-[var(--text-secondary)]">Sign in to your account</p>
          </div>
          
          {/* Better Auth will be mounted here by the client script */}
          <div id="auth-container"></div>
          
          <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
            <a href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
              &larr; Back to home
            </a>
          </div>
        </div>
      </div>

      <script type="module" dangerouslySetInnerHTML={{ __html: `
        import { createAuthClient } from "https://esm.sh/better-auth/client";
        
        const client = createAuthClient({
          baseURL: window.location.origin
        });

        // Simplified login for demo
        // In a real app, you'd use client.signIn.email() or social
      `}} />
    </Layout>
  );
};
