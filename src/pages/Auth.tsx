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
            <p class="text-xs text-muted" style="margin:0 0 0.75rem; text-align:center;">
              By signing in or creating an account, you agree to the <a href="/terms" style="color:var(--text-muted); text-decoration:underline;">Terms of Service</a>.
            </p>
            <p class="text-sm text-secondary" style="margin:0; text-align:center;">
              <span id="toggle-text">Don't have an account?</span>
              <a href="#" id="toggle-link" style="color:var(--primary); margin-left:0.25rem;">Sign up</a>
            </p>
          </div>
          <div style="text-align:center; padding-bottom:1.5rem;">
            <a href="/" class="text-sm text-muted" style="transition:color 0.2s; text-decoration:none;">
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
