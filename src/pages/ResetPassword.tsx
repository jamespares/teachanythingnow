/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "../components/Layout";

export const ResetPassword = () => {
  const scriptDict = JSON.stringify({
    updating: "Updating...",
    updatePassword: "Update Password",
    invalidToken: "Invalid or missing reset token.",
    failed: "Failed to reset password.",
    success: "Password updated successfully! Redirecting...",
    generic: "An error occurred.",
  });

  return (
    <Layout title="Reset Password">
      <div class="auth-wrapper">
        <div class="card auth-card">
          <div class="auth-header">
            <a href="/" class="text-sm text-muted inline-block mb-6 transition-colors hover:text-accent">
              ← Back to home
            </a>
            <h1 id="auth-title" class="font-accent text-3xl font-normal mb-2">Reset Password</h1>
            <p id="auth-subtitle" class="text-secondary m-0">Enter your new password below.</p>
          </div>

          <form id="reset-form" class="flex flex-col gap-5">
            <div>
              <label class="form-label">New Password</label>
              <input id="password" type="password" placeholder="••••••••" class="input" required />
            </div>

            <button id="submit-btn" type="submit" class="btn btn-primary">Update Password</button>
            <div id="error-box" class="hidden text-error text-sm text-center pt-2"></div>
            <div id="success-box" class="hidden text-success text-sm text-center pt-2"></div>
          </form>
        </div>

        <div class="mt-8 text-center flex flex-col items-center gap-5">
          <div class="flex items-center gap-6">
            <a href="https://www.linkedin.com/in/james-p-ba7653207/" target="_blank" rel="noopener noreferrer" class="text-secondary hover:text-accent transition-colors" aria-label="LinkedIn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://x.com/jamespareslfg" target="_blank" rel="noopener noreferrer" class="text-secondary hover:text-accent transition-colors" aria-label="X">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://github.com/jamespares" target="_blank" rel="noopener noreferrer" class="text-secondary hover:text-accent transition-colors" aria-label="GitHub">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
          </div>

          <div class="flex items-center gap-4 text-sm text-muted">
            <a href="/terms" class="text-muted hover:text-accent transition-colors">Terms</a>
            <span>·</span>
            <a href="/privacy" class="text-muted hover:text-accent transition-colors">Privacy</a>
          </div>

          <p class="text-sm text-secondary m-0">© 2026 Built by <span class="font-medium">James Pares</span></p>
        </div>
      </div>

      <script type="module" dangerouslySetInnerHTML={{ __html: `
        import { createAuthClient } from "https://esm.sh/better-auth@1.1.1/client";
        const client = createAuthClient({ baseURL: window.location.origin });
        const t = ${scriptDict};

        const form = document.getElementById('reset-form');
        const passwordInput = document.getElementById('password');
        const submitBtn = document.getElementById('submit-btn');
        const errorBox = document.getElementById('error-box');
        const successBox = document.getElementById('success-box');

        function showError(msg) {
          errorBox.textContent = msg;
          errorBox.classList.remove('hidden');
        }

        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          errorBox.classList.add('hidden');
          submitBtn.disabled = true;
          submitBtn.textContent = t.updating;

          const password = passwordInput.value;
          const params = new URLSearchParams(window.location.search);
          const token = params.get('token');

          if (!token) {
             showError(t.invalidToken);
             submitBtn.disabled = false;
             submitBtn.textContent = t.updatePassword;
             return;
          }

          try {
            const { data, error } = await client.resetPassword({ newPassword: password, token });
            if (error) {
              showError(error.message || t.failed);
              submitBtn.disabled = false;
              submitBtn.textContent = t.updatePassword;
            } else {
              form.style.display = 'none';
              successBox.textContent = t.success;
              successBox.classList.remove('hidden');
              setTimeout(() => { window.location.href = '/login'; }, 2000);
            }
          } catch (err) {
            showError(t.generic);
            submitBtn.disabled = false;
            submitBtn.textContent = t.updatePassword;
          }
        });
      `}} />
    </Layout>
  );
};
