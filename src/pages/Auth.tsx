/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "./Layout";

export const Auth: FC = () => {
  return (
    <Layout title="Sign In">
      <div class="auth-wrapper">
        <div class="card auth-card">
          <div class="auth-header">
            <a href="/" style="display:inline-block; margin-bottom:1.5rem;">
              <img src="/logo.png" alt="Teach Anything Now" style="height:40px; width:auto; display:block;" />
            </a>
            <h1 id="auth-title" style="font-size:1.875rem; margin-bottom:0.5rem;">Welcome Back</h1>
            <p id="auth-subtitle" class="text-secondary" style="margin:0;">Sign in to your account</p>
          </div>

          <form id="auth-form" style="display:flex; flex-direction:column; gap:1rem;">
            <div id="name-field" class="hidden">
              <label class="form-label">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                class="input"
              />
            </div>

            <div>
              <label class="form-label">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                class="input"
                required
              />
            </div>

            <div>
              <label class="form-label">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                class="input"
                required
                minlength="8"
              />
            </div>

            <div id="error-message" class="hidden error-box" style="font-size:0.875rem;"></div>

            <button type="submit" id="auth-submit" class="btn btn-primary btn-full btn-lg">
              Sign In
            </button>
          </form>

          <div class="auth-footer">
            <p class="text-xs text-muted" style="margin:0 0 0.75rem;">
              By signing in or creating an account, you agree to our <a href="/terms" style="color:var(--text-muted); text-decoration:underline;">Terms of Service</a>.
            </p>
            <p class="text-sm text-secondary" style="margin:0 0 0.5rem;">
              <span id="toggle-text">Don't have an account?</span>
              <a href="#" id="toggle-link" style="color:var(--primary); margin-left:0.25rem;">Sign up</a>
            </p>
            <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem; margin-bottom:0.75rem;">
              <p style="font-family:var(--font-heading); font-size:0.8125rem; font-weight:500; color:var(--text-primary); letter-spacing:0.02em; margin:0;">
                Built by James Pares
              </p>
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <a href="https://www.linkedin.com/in/james-p-ba7653207/" target="_blank" rel="noopener noreferrer" style="color:var(--text-primary); opacity:0.6; transition:opacity 0.2s;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.6'" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://x.com/jamespareslfg" target="_blank" rel="noopener noreferrer" style="color:var(--text-primary); opacity:0.6; transition:opacity 0.2s;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.6'" aria-label="X">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://github.com/jamespares" target="_blank" rel="noopener noreferrer" style="color:var(--text-primary); opacity:0.6; transition:opacity 0.2s;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.6'" aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </a>
              </div>
              <a href="https://jamespares.me" target="_blank" rel="noopener noreferrer" style="font-size:0.75rem; color:var(--text-primary); opacity:0.6; text-decoration:none; transition:opacity 0.2s;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.6'">jamespares.me</a>
              <p class="text-xs" style="margin:0; color:var(--text-muted);">
                © 2025 EduConnect Asia Ltd. All rights reserved.
              </p>
            </div>
            <a href="/" class="text-sm text-muted" style="transition:color 0.2s; display:block; margin-bottom:0.5rem;">
              ← Back to home
            </a>
          </div>
        </div>
      </div>

      <script type="module" dangerouslySetInnerHTML={{ __html: `
        import { createAuthClient } from "https://esm.sh/better-auth/client";

        const client = createAuthClient({
          baseURL: window.location.origin
        });

        const form = document.getElementById('auth-form');
        const nameField = document.getElementById('name-field');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const submitBtn = document.getElementById('auth-submit');
        const errorBox = document.getElementById('error-message');
        const authTitle = document.getElementById('auth-title');
        const authSubtitle = document.getElementById('auth-subtitle');
        const toggleText = document.getElementById('toggle-text');
        const toggleLink = document.getElementById('toggle-link');

        let mode = 'signin'; // 'signin' or 'signup'

        function showError(msg) {
          errorBox.textContent = msg;
          errorBox.classList.remove('hidden');
        }

        function clearError() {
          errorBox.textContent = '';
          errorBox.classList.add('hidden');
        }

        function setMode(newMode) {
          mode = newMode;
          clearError();
          if (mode === 'signup') {
            nameField.classList.remove('hidden');
            nameInput.required = true;
            submitBtn.textContent = 'Create Account';
            authTitle.textContent = 'Get Started';
            authSubtitle.textContent = 'Create your free account';
            toggleText.textContent = 'Already have an account?';
            toggleLink.textContent = 'Sign in';
          } else {
            nameField.classList.add('hidden');
            nameInput.required = false;
            submitBtn.textContent = 'Sign In';
            authTitle.textContent = 'Welcome Back';
            authSubtitle.textContent = 'Sign in to your account';
            toggleText.textContent = "Don't have an account?";
            toggleLink.textContent = 'Sign up';
          }
        }

        toggleLink.addEventListener('click', (e) => {
          e.preventDefault();
          setMode(mode === 'signin' ? 'signup' : 'signin');
        });

        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          clearError();
          submitBtn.disabled = true;
          submitBtn.textContent = mode === 'signin' ? 'Signing in…' : 'Creating account…';

          const email = emailInput.value.trim();
          const password = passwordInput.value;

          try {
            if (mode === 'signin') {
              const { data, error } = await client.signIn.email({
                email,
                password
              });
              if (error) {
                showError(error.message || 'Invalid email or password.');
              } else {
                window.location.href = '/';
              }
            } else {
              const name = nameInput.value.trim();
              if (!name) {
                showError('Please enter your name.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Account';
                return;
              }
              const { data, error } = await client.signUp.email({
                email,
                password,
                name
              });
              if (error) {
                showError(error.message || 'Could not create account. Try a different email.');
              } else {
                window.location.href = '/';
              }
            }
          } catch (err) {
            showError('Something went wrong. Please try again.');
          } finally {
            submitBtn.disabled = false;
            if (mode === 'signin') {
              submitBtn.textContent = 'Sign In';
            } else {
              submitBtn.textContent = 'Create Account';
            }
          }
        });
      `}} />
    </Layout>
  );
};
