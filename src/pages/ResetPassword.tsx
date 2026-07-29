/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "../components/Layout";
import { Footer } from "../components/Footer";

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
      <div class="min-h-screen flex flex-col">
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

            <button id="submit-btn" type="submit" class="btn btn-primary btn-full btn-lg">Update Password</button>
            <div id="error-box" class="hidden error-box"></div>
            <div id="success-box" class="hidden text-success text-sm text-center pt-2"></div>
          </form>
        </div>

        </div>

        <Footer />
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
