/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "./Layout";
import type { Lang, Dict } from "../lib/i18n";

export const Auth: FC<{ lang: Lang; dict: Dict }> = ({ lang, dict }) => {
  const scriptDict = JSON.stringify({
    signIn: dict.authBtnSignIn,
    createAccount: dict.authBtnCreateAccount,
    sendResetLink: dict.authBtnSendResetLink,
    welcomeBack: dict.authTitleWelcomeBack,
    signInToAccount: dict.authSubtitleSignIn,
    getStarted: dict.authTitleGetStarted,
    createFreeAccount: dict.authSubtitleCreateAccount,
    resetPassword: dict.authTitleResetPassword,
    emailResetLink: dict.authSubtitleResetLink,
    alreadyHaveAccount: dict.authToggleHasAccount,
    signUp: dict.authToggleSignUp,
    noAccount: dict.authToggleNoAccount,
    signInLink: dict.authToggleSignIn,
    rememberPassword: dict.authToggleRememberPassword,
    signingIn: dict.authScriptSigningIn,
    creatingAccount: dict.authScriptCreatingAccount,
    errorInvalidCredentials: dict.authScriptErrorInvalidCredentials,
    errorEnterName: dict.authScriptErrorEnterName,
    errorCreateAccount: dict.authScriptErrorCreateAccount,
    errorSendResetEmail: dict.authScriptErrorSendResetEmail,
    successResetEmail: dict.authScriptSuccessResetEmail,
    errorGeneric: dict.authScriptErrorGeneric,
  });

  return (
    <Layout title={dict.authTitle} lang={lang} dict={dict}>
      <div class="auth-wrapper">
        <div class="card auth-card">
          <div class="auth-header">
            <a href="/" class="text-sm text-muted" style="display:inline-block; margin-bottom:1.5rem; text-decoration:none; transition:color 0.2s;">
              {dict.authBackToHome}
            </a>
            <h1 id="auth-title" style="font-size:1.875rem; margin-bottom:0.5rem;">{dict.authTitleWelcomeBack}</h1>
            <p id="auth-subtitle" class="text-secondary" style="margin:0;">{dict.authSubtitleSignIn}</p>
          </div>

          <form id="auth-form" style="display:flex; flex-direction:column; gap:1rem;">
            <div id="name-field" class="hidden">
              <label class="form-label">{dict.authLabelFullName}</label>
              <input
                id="name"
                type="text"
                placeholder={dict.authPlaceholderFullName}
                class="input"
              />
            </div>

            <div>
              <label class="form-label">{dict.authLabelEmail}</label>
              <input
                id="email"
                type="email"
                placeholder={dict.authPlaceholderEmail}
                class="input"
                required
              />
            </div>

            <div id="password-field">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <label class="form-label">{dict.authLabelPassword}</label>
                <a href="#" id="forgot-link" class="text-xs" style="color:var(--primary); transition:opacity 0.2s; text-decoration:none;">{dict.authLinkForgotPassword}</a>
              </div>
              <input
                id="password"
                type="password"
                placeholder={dict.authPlaceholderPassword}
                class="input"
                required
                minlength="8"
              />
            </div>

            <div id="error-message" class="hidden error-box" style="font-size:0.875rem;"></div>

            <button type="submit" id="auth-submit" class="btn btn-primary btn-full btn-lg">
              {dict.authBtnSignIn}
            </button>
          </form>

          <div class="auth-footer">
            <p class="text-xs text-muted" style="margin:0 0 0.75rem; text-align:center;">
              {dict.authTermsAgreement} <a href="/terms" style="color:var(--text-muted); text-decoration:underline;">{dict.authTermsLink}</a>.
            </p>
            <p class="text-sm text-secondary" style="margin:0; text-align:center;">
              <span id="toggle-text">{dict.authToggleNoAccount}</span>
              <a href="#" id="toggle-link" style="color:var(--primary); margin-left:0.25rem;">{dict.authToggleSignUp}</a>
            </p>
          </div>
        </div>

        {/* ── Social / Engagement Footer ── */}
        <div style="margin-top:2rem; text-align:center; display:flex; flex-direction:column; align-items:center; gap:1rem;">
          <p style="font-family:var(--font-heading); font-size:1.1rem; font-weight:600; margin:0;">
            {dict.homeFooterBuiltBy}
          </p>
          <div style="display:flex; align-items:center; gap:1.25rem;">
            <a href="https://www.linkedin.com/in/james-p-ba7653207/" target="_blank" rel="noopener noreferrer" style="color:var(--text-secondary); transition:color 0.2s;" onmouseenter="this.style.color='var(--primary)'" onmouseleave="this.style.color='var(--text-secondary)'" aria-label="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://x.com/jamespareslfg" target="_blank" rel="noopener noreferrer" style="color:var(--text-secondary); transition:color 0.2s;" onmouseenter="this.style.color='var(--primary)'" onmouseleave="this.style.color='var(--text-secondary)'" aria-label="X">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://github.com/jamespares" target="_blank" rel="noopener noreferrer" style="color:var(--text-secondary); transition:color 0.2s;" onmouseenter="this.style.color='var(--primary)'" onmouseleave="this.style.color='var(--text-secondary)'" aria-label="GitHub">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
          </div>
          <a href="https://jamespares.me" target="_blank" rel="noopener noreferrer" style="font-size:0.9rem; color:var(--text-secondary); text-decoration:none; font-weight:500;">{dict.homeFooterWebsite}</a>
        </div>
      </div>

      <script type="module" dangerouslySetInnerHTML={{ __html: `
        import { createAuthClient } from "https://esm.sh/better-auth@1.1.1/client";

        const client = createAuthClient({
          baseURL: window.location.origin
        });

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

        let mode = 'signin'; // 'signin', 'signup', or 'forgot'

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
              const { data, error } = await client.signIn.email({
                email,
                password
              });
              if (error) {
                showError(error.message || t.errorInvalidCredentials);
              } else {
                window.location.href = '/dashboard';
              }
            } else if (mode === 'forgot') {
              const { data, error } = await client.forgetPassword({
                email,
                redirectTo: window.location.origin + '/reset-password'
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
              const { data, error } = await client.signUp.email({
                email,
                password,
                name
              });
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
            if (mode === 'signin') {
              submitBtn.textContent = t.signIn;
            } else if (mode === 'forgot') {
              submitBtn.textContent = t.sendResetLink;
            } else {
              submitBtn.textContent = t.createAccount;
            }
          }
        });
      `}} />
    </Layout>
  );
};
