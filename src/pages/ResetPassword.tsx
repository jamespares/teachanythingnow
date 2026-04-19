/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "./Layout";

export const ResetPassword: FC = () => {
  return (
    <Layout title="Reset Password">
      <div class="auth-wrapper">
        <div class="card auth-card">
          <div class="auth-header">
            <a href="/" class="text-sm text-muted" style="display:inline-block; margin-bottom:1.5rem; text-decoration:none; transition:color 0.2s;">
              ← Back to home
            </a>
            <h1 id="auth-title" style="font-size:1.875rem; margin-bottom:0.5rem;">Reset Password</h1>
            <p id="auth-subtitle" class="text-secondary" style="margin:0;">Enter your new password below.</p>
          </div>

          <form id="reset-form" style="display:flex; flex-direction:column; gap:1.25rem;">
            <div>
              <label class="form-label">New Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                class="input"
                required
              />
            </div>
            
            <button id="submit-btn" type="submit" class="btn btn-primary btn-block">
              Update Password
            </button>
            <div id="error-box" class="hidden" style="color:#ef4444; font-size:0.875rem; text-align:center; padding-top:0.5rem;"></div>
            <div id="success-box" class="hidden" style="color:#059669; font-size:0.875rem; text-align:center; padding-top:0.5rem;"></div>
          </form>
        </div>
      </div>

      <script type="module" dangerouslySetInnerHTML={{ __html: `
        import { createAuthClient } from "https://esm.sh/better-auth@1.1.1/client";

        const client = createAuthClient({
          baseURL: window.location.origin
        });

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
          submitBtn.textContent = 'Updating...';

          const password = passwordInput.value;
          
          // Get token from URL
          const params = new URLSearchParams(window.location.search);
          const token = params.get('token');

          if (!token) {
             showError('Invalid or missing reset token.');
             submitBtn.disabled = false;
             submitBtn.textContent = 'Update Password';
             return;
          }

          try {
            const { data, error } = await client.resetPassword({
              newPassword: password,
              token: token
            });
            
            if (error) {
              showError(error.message || 'Failed to reset password.');
              submitBtn.disabled = false;
              submitBtn.textContent = 'Update Password';
            } else {
              form.style.display = 'none';
              successBox.textContent = 'Password updated successfully! Redirecting...';
              successBox.classList.remove('hidden');
              setTimeout(() => {
                window.location.href = '/login';
              }, 2000);
            }
          } catch (err) {
            showError('An error occurred.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Update Password';
          }
        });
      `}} />
    </Layout>
  );
};
