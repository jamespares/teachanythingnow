/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "../components/Layout";
import { Footer } from "../components/Footer";

export const Auth = () => {
  const scriptDict = JSON.stringify({
    signIn: "Sign In",
    createAccount: "Create Account",
    sendResetLink: "Send Reset Link",
    welcomeBack: "Welcome Back",
    signInToAccount: "Sign in to your account",
    getStarted: "Get Started",
    createFreeAccount: "Create your free account",
    resetPassword: "Reset Password",
    emailResetLink: "We will email you a reset link",
    alreadyHaveAccount: "Already have an account?",
    signUp: "Sign up",
    noAccount: "Don't have an account?",
    signInLink: "Sign in",
    rememberPassword: "Remember your password?",
    signingIn: "Signing in…",
    creatingAccount: "Creating account…",
    errorInvalidCredentials: "Invalid email or password.",
    errorEnterName: "Please enter your name.",
    errorCreateAccount: "Could not create account. Try a different email.",
    errorSendResetEmail: "Failed to send reset email.",
    successResetEmail: "Check your email for a password reset link!",
    errorGeneric: "Something went wrong. Please try again.",
  });

  return (
    <Layout title="Sign In">
      <div class="min-h-screen flex flex-col">
        <div class="auth-wrapper">
          <div class="card auth-card">
          <div class="auth-header">
            <a href="/" class="text-sm text-muted inline-block mb-6 transition-colors hover:text-accent">
              ← Back to home
            </a>
            <h1 id="auth-title" class="font-accent text-3xl font-normal mb-2">Welcome Back</h1>
            <p id="auth-subtitle" class="text-secondary m-0">Sign in to your account</p>
          </div>

          <form id="auth-form" class="flex flex-col gap-4">
            <div id="name-field" class="hidden">
              <label class="form-label">Full Name</label>
              <input id="name" type="text" placeholder="Your name" class="input" />
            </div>

            <div>
              <label class="form-label">Email</label>
              <input id="email" type="email" placeholder="you@example.com" class="input" required />
            </div>

            <div id="password-field">
              <div class="flex justify-between items-center">
                <label class="form-label">Password</label>
                <a href="#" id="forgot-link" class="text-xs text-accent hover:opacity-80 transition-opacity">Forgot password?</a>
              </div>
              <input id="password" type="password" placeholder="••••••••" class="input" required minlength={8} />
            </div>

            <div id="error-message" class="hidden error-box"></div>

            <button type="submit" id="auth-submit" class="btn btn-primary btn-full btn-lg">
              Sign In
            </button>
          </form>

          <div class="auth-footer">
            <p class="text-xs text-muted text-center mb-3">
              By signing in or creating an account, you agree to the <a href="https://jamespares.me/terms/" target="_blank" rel="noopener noreferrer" class="underline">Terms of Service</a> and <a href="https://jamespares.me/privacy/" target="_blank" rel="noopener noreferrer" class="underline">Privacy Policy</a>.
            </p>
            <p class="text-sm text-secondary text-center m-0">
              <span id="toggle-text">Don't have an account?</span>
              <a href="#" id="toggle-link" class="text-accent ml-1">Sign up</a>
            </p>
          </div>
        </div>

        </div>

        <Footer />
      </div>

      <script type="module" dangerouslySetInnerHTML={{ __html: `
        import { createAuthClient } from "https://esm.sh/better-auth@1.1.1/client";
        const client = createAuthClient({ baseURL: window.location.origin });
        const t = ${scriptDict};

        const form = document.getElementById('auth-form');
        const nameField = document.getElementById('name-field');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const passwordField = document.getElementById('password-field');
        const submitBtn = document.getElementById('auth-submit');
        const errorBox = document.getElementById('error-message');
        const authTitle = document.getElementById('auth-title');
        const authSubtitle = document.getElementById('auth-subtitle');
        const toggleText = document.getElementById('toggle-text');
        const toggleLink = document.getElementById('toggle-link');
        const forgotLink = document.getElementById('forgot-link');

        let mode = 'signin';

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
            passwordField.classList.remove('hidden');
            nameInput.required = true;
            passwordInput.required = true;
            submitBtn.textContent = t.createAccount;
            authTitle.textContent = t.getStarted;
            authSubtitle.textContent = t.createFreeAccount;
            toggleText.textContent = t.alreadyHaveAccount;
            toggleLink.textContent = t.signInLink;
            forgotLink.classList.add('hidden');
          } else if (mode === 'signin') {
            nameField.classList.add('hidden');
            passwordField.classList.remove('hidden');
            nameInput.required = false;
            passwordInput.required = true;
            submitBtn.textContent = t.signIn;
            authTitle.textContent = t.welcomeBack;
            authSubtitle.textContent = t.signInToAccount;
            toggleText.textContent = t.noAccount;
            toggleLink.textContent = t.signUp;
            forgotLink.classList.remove('hidden');
          } else if (mode === 'forgot') {
            nameField.classList.add('hidden');
            passwordField.classList.add('hidden');
            nameInput.required = false;
            passwordInput.required = false;
            submitBtn.textContent = t.sendResetLink;
            authTitle.textContent = t.resetPassword;
            authSubtitle.textContent = t.emailResetLink;
            toggleText.textContent = t.rememberPassword;
            toggleLink.textContent = t.signInLink;
            forgotLink.classList.add('hidden');
          }
        }

        toggleLink.addEventListener('click', (e) => {
          e.preventDefault();
          setMode(mode === 'signup' ? 'signin' : mode === 'forgot' ? 'signin' : 'signup');
        });

        forgotLink.addEventListener('click', (e) => {
          e.preventDefault();
          setMode('forgot');
        });

        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          clearError();
          submitBtn.disabled = true;
          submitBtn.textContent = mode === 'signin' ? t.signingIn : t.creatingAccount;

          const email = emailInput.value.trim();
          const password = passwordInput.value;

          try {
            if (mode === 'signin') {
              const { data, error } = await client.signIn.email({ email, password });
              if (error) {
                showError(error.message || t.errorInvalidCredentials);
              } else {
                window.location.href = '/dashboard';
              }
            } else if (mode === 'forgot') {
              const { data, error } = await client.forgetPassword({
                email
              });
              if (error) {
                showError(error.message || t.errorSendResetEmail);
              } else {
                errorBox.classList.remove('hidden');
                errorBox.classList.remove('error-box');
                errorBox.style.color = '#059669';
                errorBox.textContent = t.successResetEmail;
                submitBtn.disabled = true;
                return;
              }
            } else {
              const name = nameInput.value.trim();
              if (!name) {
                showError(t.errorEnterName);
                submitBtn.disabled = false;
                submitBtn.textContent = t.createAccount;
                return;
              }
              const { data, error } = await client.signUp.email({ email, password, name });
              if (error) {
                showError(error.message || t.errorCreateAccount);
              } else {
                window.location.href = '/';
              }
            }
          } catch (err) {
            showError(t.errorGeneric);
          } finally {
            submitBtn.disabled = false;
            if (mode === 'signin') submitBtn.textContent = t.signIn;
            else if (mode === 'forgot') submitBtn.textContent = t.sendResetLink;
            else submitBtn.textContent = t.createAccount;
          }
        });
      `}} />
    </Layout>
  );
};
