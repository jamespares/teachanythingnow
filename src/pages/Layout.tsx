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
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        
        <link rel="stylesheet" href="/globals.css" />
        <style>{`
          :root {
            --font-heading: 'Lexend', sans-serif;
            --font-body: 'Inter', sans-serif;
            --primary: #00a884;
            --primary-dark: #008f70;
            --background: #0a0a0a;
            --card-bg: #1a1a1a;
            --border: #333333;
            --text-primary: #ffffff;
            --text-secondary: #a1a1aa;
            --text-muted: #71717a;
            --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          body {
            font-family: var(--font-body);
            background-color: var(--background);
            background-image: url(/chalk-board-bg.png);
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            color: var(--text-primary);
            margin: 0;
            -webkit-font-smoothing: antialiased;
            min-height: 100vh;
          }

          h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading);
            font-weight: 600;
            line-height: 1.2;
          }

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
            border: 1px solid var(--border);
            color: var(--text-primary);
          }

          .btn-secondary:hover {
            background-color: rgba(255, 255, 255, 0.05);
          }

          .card {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: var(--shadow-md);
          }

          .input {
            width: 100%;
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            color: white;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: border-color 0.2s;
            box-sizing: border-box;
          }

          .input:focus {
            outline: none;
            border-color: var(--primary);
          }

          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </head>
      <body>
        {children}
        
        {/* Simple Script for interaction if needed */}
        <script dangerouslySetInnerHTML={{ __html: `
          // client-side logic can go here
        `}} />
      </body>
    </html>
  );
};
