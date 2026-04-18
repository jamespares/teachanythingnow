/** @jsxImportSource hono/jsx */
import { FC, PropsWithChildren } from "hono/jsx";

export const Layout: FC<PropsWithChildren<{ title?: string }>> = ({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | Teach Anything Now` : "Teach Anything Now"}</title>

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

        <link rel="stylesheet" href="/globals.css" />
        <style>{`
          :root {
            --font-heading: 'Lexend', sans-serif;
            --font-body: 'Inter', sans-serif;
            --primary: #006b54;
            --primary-dark: #005240;
            --background: #f8f9fa;
            --card-bg: #ffffff;
            --border: #e2e8f0;
            --border-strong: #d1d5db;
            --text-primary: #111827;
            --text-secondary: #4b5563;
            --text-muted: #6b7280;
            --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.06);
            --max-width: 80rem;
          }

          *, *::before, *::after { box-sizing: border-box; }

          body {
            font-family: var(--font-body);
            background-color: var(--background);
            color: var(--text-primary);
            margin: 0;
            -webkit-font-smoothing: antialiased;
            min-height: 100vh;
          }

          h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading);
            font-weight: 600;
            line-height: 1.2;
            margin: 0;
          }

          a { color: inherit; text-decoration: none; }

          /* ── Buttons ── */
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 500;
            transition: all 0.2s;
            cursor: pointer;
            border: none;
            font-size: 0.95rem;
            font-family: var(--font-heading);
            text-decoration: none;
          }
          .btn-primary {
            background-color: var(--primary);
            color: white;
          }
          .btn-primary:hover {
            background-color: var(--primary-dark);
            transform: translateY(-1px);
          }
          .btn-secondary {
            background-color: transparent;
            border: 1px solid var(--border-strong);
            color: var(--text-primary);
          }
          .btn-secondary:hover { background-color: var(--background); }
          .btn-full { width: 100%; }
          .btn-lg { height: 3.5rem; font-size: 1.125rem; }

          /* ── Card ── */
          .card {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: var(--shadow-md);
          }
          .card-body { padding: 2rem; }
          .card-body-lg { padding: 3rem; }
          .card-hover {
            transition: border-color 0.2s;
            cursor: default;
          }
          .card-hover:hover { border-color: var(--primary); }

          /* ── Input ── */
          .input {
            width: 100%;
            background-color: #ffffff;
            border: 1px solid var(--border-strong);
            color: var(--text-primary);
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: border-color 0.2s, box-shadow 0.2s;
            box-sizing: border-box;
          }
          .input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(0, 107, 84, 0.1); }
          .input-lg { font-size: 1.125rem; }

          /* ── Layout helpers ── */
          .page-wrapper { min-height: 100vh; display: flex; flex-direction: column; }

          .site-header {
            height: 4rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 1.5rem;
            max-width: var(--max-width);
            margin: 0 auto;
            width: 100%;
          }
          .site-header--border { border-bottom: 1px solid var(--border); }

          .site-nav {
            display: flex;
            align-items: center;
            gap: 1.5rem;
          }

          .site-main {
            max-width: var(--max-width);
            margin: 0 auto;
            padding: 3rem 1.5rem;
            width: 100%;
          }

          .site-main--narrow {
            max-width: 48rem;
            margin: 0 auto;
            padding: 3rem 1.5rem;
            width: 100%;
          }

          @media (min-width: 640px) {
            .site-main--narrow { padding-top: 5rem; padding-bottom: 5rem; }
          }

          /* ── Logo / brand ── */
          .brand {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .brand img {
            height: 52px;
            width: auto;
            display: block;
          }
          .brand--home { font-size: 1.5rem; }

          /* ── Text utilities ── */
          .text-secondary { color: var(--text-secondary); }
          .text-muted { color: var(--text-muted); }
          .text-primary-color { color: var(--primary); }
          .text-sm { font-size: 0.875rem; }
          .text-xs { font-size: 0.75rem; }

          /* ── Hero ── */
          .hero-text { text-align: center; margin-bottom: 3rem; }
          .hero-title { font-size: clamp(2rem, 5vw, 3.25rem); margin-bottom: 1rem; }
          .hero-sub { color: var(--text-secondary); font-size: 1.125rem; }

          /* ── Feature grid ── */
          .feature-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-top: 3rem;
          }
          @media (min-width: 640px) {
            .feature-grid { grid-template-columns: repeat(4, 1fr); }
          }
          .feature-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1rem;
            border-radius: 0.75rem;
            border: 1px solid var(--border);
            background: #f3f4f6;
          }
          .feature-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
          .feature-label { font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); }

          /* ── Form group ── */
          .form-group { margin-bottom: 1.5rem; }
          .form-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            margin-left: 0.25rem;
            color: var(--text-primary);
          }

          /* ── Status / error ── */
          .status-box {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            background: #f3f4f6;
            border-radius: 0.5rem;
            border: 1px solid var(--border);
          }
          .spinner {
            width: 1.25rem;
            height: 1.25rem;
            border: 2px solid var(--primary);
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            flex-shrink: 0;
          }
          @keyframes spin { to { transform: rotate(360deg); } }

          .error-box {
            padding: 1rem;
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            border-radius: 0.5rem;
            font-size: 0.875rem;
          }

          /* ── Packages grid ── */
          .packages-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          @media (min-width: 768px) {
            .packages-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (min-width: 1024px) {
            .packages-grid { grid-template-columns: repeat(3, 1fr); }
          }

          .package-card {
            display: flex;
            flex-direction: column;
            padding: 1.5rem;
          }

          /* ── Download link ── */
          .download-link {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem;
            border-radius: 0.5rem;
            border: 1px solid var(--border);
            transition: background 0.2s;
            margin-bottom: 0.75rem;
            font-size: 0.875rem;
            color: var(--text-primary);
          }
          .download-link:hover { background: #f3f4f6; }

          /* ── Auth page centre ── */
          .auth-wrapper {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            background: var(--background);
          }
          .auth-card {
            width: 100%;
            max-width: 28rem;
            padding: 2rem;
          }
          .auth-header { text-align: center; margin-bottom: 2.5rem; }
          .auth-footer {
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border);
            text-align: center;
          }
          .auth-footer a:hover { color: var(--primary); }

          /* ── Dashboard header row ── */
          .dash-heading-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2rem;
          }

          /* ── Animations ── */
          .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .hidden { display: none !important; }
        `}</style>
      </head>
      <body>
        {/* Chalkboard background */}
        <div style="position:fixed; inset:0; z-index:-1; background:#2d5016;">
          <img
            src="/chalk-board-bg.png"
            alt=""
            style="width:100%; height:100%; object-fit:cover; display:block;"
          />
        </div>
        {children}
      </body>
    </html>
  );
};
