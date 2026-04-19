/** @jsxImportSource hono/jsx */
import { FC, PropsWithChildren } from "hono/jsx";

export const Layout: FC<PropsWithChildren<{ title?: string }>> = ({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | Teach Anything Now` : "Teach Anything Now"}</title>

        {/* Fonts - self-hosted for China accessibility */}

        <link rel="stylesheet" href="/globals.css" />
        <style>{`
          .hidden { display: none !important; }
        `}</style>
      </head>
      <body>
        {/* Organic wavy background */}
        <div style="position:fixed; inset:0; z-index:-1; background:var(--background); overflow:hidden;">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute; width:100%; height:100%; top:0; left:0;">
            <path fill="var(--pastel-green)" d="M0,0 L1440,0 L1440,250 C1100,400 900,100 500,250 C200,350 0,150 0,150 Z" />
            <path fill="var(--pastel-green-light)" d="M1440,900 L0,900 L0,750 C300,550 500,850 900,650 C1200,500 1440,750 1440,750 Z" />
          </svg>
        </div>
        {children}
      </body>
    </html>
  );
};
