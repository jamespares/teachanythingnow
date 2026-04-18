# AGENTS.md — Teach Anything Now

> This file is intended for AI coding agents. It describes the project architecture, conventions, and workflows. The project is documented in English, and all code comments and documentation are written in English.

---

## Project Overview

**Teach Anything Now** is a **Cloudflare-first** educational content generation platform. The application runs entirely on Cloudflare's edge infrastructure — the domain (`teachanythingnow.com`), deployment, compute, database, and object storage are all hosted on Cloudflare. Users enter any topic, pay £1, and receive a complete teaching package generated in under 60 seconds. Each package includes:

- A PowerPoint presentation (`.pptx`)
- A podcast-style audio explanation (`.mp3`)
- An editable student worksheet with answer keys (`.docx`)
- AI-generated educational images (`.png`)

The application is built as a single Hono application running on **Cloudflare Workers** (via Wrangler), using server-side rendered JSX for the UI. There is no client-side JavaScript framework — all interactivity is handled via vanilla JS embedded in inline `<script>` tags.

The app is operated by EduConnect Asia Ltd and is deployed at `https://www.teachanythingnow.com` via **Cloudflare Workers**.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Runtime | Cloudflare Workers (Wrangler) — edge compute |
| Domain & DNS | Cloudflare |
| Framework | [Hono](https://hono.dev/) v4.6+ |
| Frontend | Hono JSX (server-side rendering, no hydration) |
| Database | Cloudflare D1 (SQLite) — edge database |
| ORM | Drizzle ORM v0.45+ |
| Auth | Better Auth v1.1+ (email/password, Drizzle adapter) |
| Object Storage | Cloudflare R2 — edge object storage |
| AI / Content | OpenAI GPT-4o, OpenAI TTS-1-HD |
| Image Generation | Google Gemini / Imagen (via Banana.dev or direct API) |
| Payments | Stripe (Payment Intents + webhooks) |
| Email | Resend |
| Language | TypeScript (ES modules, strict mode) |

---

## Project Structure

```
├── src/
│   ├── index.ts                 # Main Hono app: routes, API handlers, auth wiring
│   ├── db/
│   │   └── schema.ts            # Drizzle ORM schema (all tables)
│   ├── lib/
│   │   ├── auth.ts              # Better Auth factory (getAuth)
│   │   ├── db.ts                # Drizzle client factory (getDb)
│   │   ├── storage.ts           # R2Storage wrapper for R2 uploads/downloads
│   │   ├── stripe.ts            # Stripe SDK initializer
│   │   ├── content-generator.ts # OpenAI GPT-4o content generation (slides, script, worksheet)
│   │   ├── ppt-generator.ts     # PPTX generation via PptxGenJS
│   │   ├── audio-generator.ts   # MP3 generation via OpenAI TTS
│   │   ├── worksheet-generator.ts # DOCX worksheet + PDF answer key generation
│   │   └── image-generator.ts   # Image generation via Google Gemini/Imagen
│   └── pages/
│       ├── Layout.tsx           # Root layout component (HTML shell, CSS, global styles)
│       ├── Home.tsx             # Landing page with topic input, Stripe payment, generation flow
│       ├── Dashboard.tsx        # User's generated lesson packages with download links
│       ├── Auth.tsx             # Sign-in / sign-up toggle page (Better Auth client)
│       └── Terms.tsx            # Terms of Service page
├── public/
│   ├── globals.css              # Plain CSS design system (no build step)
│   ├── logo.png                 # Brand logo
│   ├── chalk-board-bg.png       # Background texture
│   ├── robots.txt               # SEO robots file
│   └── samples/                 # Sample output files for marketing
├── migrations/                  # Drizzle Kit generated SQL migrations
│   ├── 0000_charming_thunderbolt.sql
│   └── meta/
├── package.json
├── tsconfig.json
├── wrangler.toml                # Cloudflare Workers deployment config
├── drizzle.config.ts            # Drizzle Kit configuration
└── .dev.vars                    # Local development secrets (DO NOT COMMIT)
```

---

## Code Organization & Conventions

### Module Boundaries

- **`src/index.ts`** is the application entry point. It defines the Hono app, all HTTP routes (UI and API), and wires together `lib/` and `pages/`.
- **`src/db/schema.ts`** is the single source of truth for the database schema. Both application tables and Better Auth tables live here.
- **`src/lib/`** contains pure business logic with no JSX. Each file is responsible for one domain:
  - Content/audio/image/worksheet/PPT generation
  - Auth and DB factories
  - External service clients (Stripe, R2)
- **`src/pages/`** contains Hono JSX components. They are responsible **only** for rendering HTML and embedding minimal client-side JavaScript.

### Naming Conventions

- Files use `kebab-case.ts` for library modules and `PascalCase.tsx` for JSX page components.
- Database tables in Drizzle schema use `snake_case` column names.
- Exported functions use `camelCase`.
- TypeScript interfaces use `PascalCase` (e.g., `GeneratedContent`, `AudioResult`).

### JSX & Styling

- JSX is rendered server-side using `hono/jsx`. There is **no client-side hydration**.
- The `/** @jsxImportSource hono/jsx */` pragma is used at the top of `.tsx` files.
- Styles are applied via inline `style` attributes and global CSS classes defined inside `Layout.tsx` (in a `<style>` block) and `public/globals.css`.
- The design system uses CSS custom properties (variables) for colors, fonts, and spacing. Primary brand color is a deep teal (`#006b54`).
- Fonts are loaded from Google Fonts: **Lexend** (headings) and **Inter** (body).

### Client-Side JavaScript

- Client scripts are embedded directly in page components using `<script dangerouslySetInnerHTML={{ __html: '...' }}>` or `<script type="module" dangerouslySetInnerHTML={{ __html: '...' }}>`.
- The Better Auth client is loaded from `https://esm.sh/better-auth/client` as an ES module.
- Stripe.js is loaded from `https://js.stripe.com/v3/`.
- There is no bundler for client assets; all client code is hand-written inline.

### Database & Migrations

- **Cloudflare D1** (SQLite) is the database. D1 is Cloudflare's globally distributed, serverless SQL database. Schema is defined with `drizzle-orm/sqlite-core`.
- Tables use `integer("...", { mode: "timestamp" })` for dates and `text("id").primaryKey().$defaultFn(() => crypto.randomUUID())` for IDs.
- `created_at` / `updated_at` columns default to `sql\`(strftime('%s', 'now'))\``.
- Migrations are generated with `drizzle-kit generate` and applied with `wrangler d1 migrations apply`.
- The `drizzle.config.ts` uses the `d1-http` driver, which connects to D1 via Cloudflare's HTTP API. For local development, credentials come from `.dev.vars` or environment variables (`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`).

---

## Build, Dev & Deploy Commands

All commands are run via `npm` and `wrangler`:

```bash
# Install dependencies
npm install

# Local development (uses Wrangler dev server with local D1/R2 emulation)
npm run dev

# Deploy to Cloudflare Workers
npm run deploy

# Database: generate migration from schema
npm run db:generate

# Database: apply migrations locally
npm run db:migrate

# Database: apply migrations to remote D1
npm run db:migrate:remote

# Database: open Drizzle Studio (requires DB credentials)
npm run db:studio

# Lint (runs eslint src — currently no eslint config file exists)
npm run lint
```

> **Note:** There is no build step for the application. Wrangler bundles `src/index.ts` automatically using its internal esbuild pipeline. There is also no test runner configured.

---

## Environment & Secrets

### Public Vars (in `wrangler.toml`)

| Variable | Purpose |
|----------|---------|
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for frontend payment elements |
| `BETTER_AUTH_URL` | Base URL for auth callbacks (`https://www.teachanythingnow.com`) |

### Secrets (set via `wrangler secret put` or `.dev.vars` for local dev)

| Secret | Purpose |
|--------|---------|
| `STRIPE_SECRET_KEY` | Stripe server-side API key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint secret |
| `OPENAI_API_KEY` | OpenAI API for content and audio generation |
| `GOOGLE_GEMINI_API_KEY` | Google Gemini/Imagen API for image generation |
| `BETTER_AUTH_SECRET` | Encryption secret for Better Auth sessions/tokens |
| `RESEND_API_KEY` | Resend API for transactional emails (configured but not actively used in main flow) |

> **Security Warning:** `.dev.vars` contains live secrets for local development. It is listed in `.gitignore` and must **never** be committed.

---

## Authentication & Authorization

- Authentication is handled by **Better Auth** with the Drizzle adapter on D1 SQLite.
- Only **email/password** authentication is enabled (`emailAndPassword: { enabled: true }`).
- Session validation is done on every protected route by calling `auth.api.getSession({ headers: c.req.raw.headers })`.
- Unauthenticated users are redirected to `/login`.
- The auth API is mounted at `/api/auth/*` and proxied through the Hono app.

---

## Key API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Landing page (topic input + payment) |
| `GET` | `/login` | Auth page (sign in / sign up) |
| `GET` | `/dashboard` | User's lesson packages |
| `GET` | `/terms` | Terms of Service |
| `POST/GET` | `/api/auth/*` | Better Auth endpoints |
| `POST` | `/api/payment/create` | Creates Stripe PaymentIntent (£1.00 GBP) |
| `POST` | `/api/webhooks/stripe` | Stripe webhook handler (payment succeeded/failed) |
| `POST` | `/api/generate` | Triggers content generation after payment verification |
| `GET` | `/api/download?file=...` | Downloads a file from R2 |

### Generation Flow

1. User enters topic on `/` and clicks "Generate".
2. Frontend creates a Stripe PaymentIntent via `/api/payment/create`.
3. User completes card payment via Stripe Elements.
4. On success, frontend calls `/api/generate` with the topic.
5. Backend verifies payment, marks it as `used`, then runs four parallel generation tasks:
   - `generatePPT()` → uploads `.pptx` to R2
   - `generateAudio()` → uploads `.mp3` to R2
   - `generateWorksheet()` → uploads `.docx` to R2
   - `generateImages()` + `downloadImages()` → uploads `.png` files to R2
6. File metadata is saved to the `packages` table as a JSON string.
7. User is redirected to `/dashboard` to download files.

---

## Testing Strategy

> **Current State:** The project has **no automated tests** and **no test runner** configured. There are no `*.test.*` or `*.spec.*` files.

Testing is currently manual:
- Run `npm run dev` and test the full user flow locally.
- Use Wrangler's local D1/R2 emulation for database and storage testing.
- Verify Stripe webhooks using the Stripe CLI or by inspecting the Stripe Dashboard.

If adding tests, the typical approach for this stack would be:
- **Unit tests:** Use Vitest for testing pure logic in `src/lib/`.
- **Integration tests:** Use Miniflare (via Wrangler) to test Hono routes with emulated D1/R2 bindings.

---

## Linting & Code Quality

- `npm run lint` runs `eslint src`.
- **There is no `.eslintrc` or `eslint.config.js` file** in the repository. ESLint uses its default built-in rules.
- There is no Prettier configuration. Formatting is manual.
- TypeScript is in `strict` mode. The project targets `ESNext` with `Bundler` module resolution.

---

## Deployment Architecture

- **Platform:** Cloudflare Workers (serverless edge functions running on Cloudflare's global network)
- **Entry:** `src/index.ts`
- **Compatibility Date:** `2024-11-01`
- **Compatibility Flag:** `nodejs_compat` (required for some npm packages like `pptxgenjs`, `docx`, `pdf-lib`)
- **Assets:** Static files served from `./public` via Wrangler's `[assets]` config
- **Domain:** DNS and SSL managed through Cloudflare
- **Observability:** Enabled in `wrangler.toml` for Cloudflare logging

### Resources to Provision

Before first deploy, the following Cloudflare resources must exist in your Cloudflare account:

1. **D1 Database:** `wrangler d1 create teach-anything-db`
2. **R2 Bucket:** `wrangler r2 bucket create teach-anything-assets`
3. **Domain:** Add `teachanythingnow.com` (or your chosen domain) to your Cloudflare account and configure DNS to point to the Workers deployment.
4. **Secrets:** Set all secrets listed in the Secrets table above via `wrangler secret put`.

---

## Security Considerations

1. **Secrets Management:** Live API keys (Stripe, OpenAI, Gemini, Better Auth) are stored in `.dev.vars` for local dev and as Wrangler secrets for production. Never commit `.dev.vars`.
2. **Stripe Webhooks:** The webhook endpoint (`/api/webhooks/stripe`) validates the Stripe signature using `STRIPE_WEBHOOK_SECRET`. Always verify signatures in production.
3. **Auth Sessions:** Better Auth sessions are cookie-based and encrypted with `BETTER_AUTH_SECRET`. The `baseURL` must match the deployed domain.
4. **File Downloads:** The `/api/download` endpoint does not enforce authentication — anyone with the filename can download. Files in R2 should ideally be non-listable, and filenames contain random IDs for obscurity.
5. **Payment Verification:** Before generating content, the `/api/generate` endpoint verifies that the user has an unused, successful payment for the topic. It also syncs payment status from Stripe as a fallback if the webhook has not yet arrived.
6. **No Rate Limiting:** There is no rate limiting implemented on API endpoints. Consider adding Cloudflare Rate Limiting or in-app throttling for the generation endpoint.
7. **Input Sanitization:** Topic input is not strictly sanitized beyond basic JSON parsing. Since content is passed to OpenAI prompts, prompt injection by users is a theoretical risk.

---

## Common Development Tasks

### Adding a New Database Table

1. Define the table in `src/db/schema.ts` using `sqliteTable()`.
2. Run `npm run db:generate` to create a migration file.
3. Run `npm run db:migrate` (local) or `npm run db:migrate:remote` (production).
4. Import the table in `src/index.ts` or relevant `lib/` files and use with Drizzle.

### Adding a New Page

1. Create a new `.tsx` file in `src/pages/` with the `/** @jsxImportSource hono/jsx */` pragma.
2. Wrap the page in the `Layout` component from `./Layout`.
3. Add the route in `src/index.ts` using `app.get("/new-path", (c) => c.html(<NewPage />))`.
4. For auth-protected pages, validate the session and redirect to `/login` if missing.

### Adding a New API Endpoint

1. Add the route in `src/index.ts`.
2. For routes requiring auth, copy the session check pattern:
   ```ts
   const db = getDb(c.env.DB);
   const auth = getAuth(db, c.env);
   const session = await auth.api.getSession({ headers: c.req.raw.headers });
   if (!session) return c.json({ error: "Unauthorized" }, 401);
   ```
3. Use `c.req.json()` for POST bodies and `c.req.query()` for query params.

### Modifying the Generation Pipeline

- `src/lib/content-generator.ts` is the orchestrator. It generates slides first, then derives the podcast script and worksheet questions from those slides for consistency.
- Each generator (`ppt-generator.ts`, `audio-generator.ts`, etc.) is independent and can be modified without affecting others, as long as the input/output interfaces remain compatible.
- All generators include fallback logic (template-based) if the AI API fails or is unavailable, **except** `audio-generator.ts` which throws an error rather than falling back to text.

---

## Dependencies of Note

- **`hono`** — Lightweight web framework with JSX support.
- **`drizzle-orm` / `drizzle-kit`** — Type-safe SQL-like ORM and migration generator.
- **`better-auth`** — Authentication framework with Drizzle adapter.
- **`pptxgenjs`** — Generates PowerPoint files in Node/Worker environments.
- **`docx`** — Generates Word documents.
- **`pdf-lib`** — Generates PDF documents (used for answer keys).
- **`openai`** — Official OpenAI SDK for chat completions and TTS.
- **`stripe`** — Official Stripe SDK for payments.
- **`zod`** — Installed but not actively used in the current codebase.

---

## Troubleshooting

- **D1 migration fails locally:** Ensure `.dev.vars` has `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` set, or pass them as environment variables.
- **`npm run lint` fails with config error:** There is no ESLint config file. Either create one (`.eslintrc.cjs` or `eslint.config.js`) or run `npx eslint src --ext .ts,.tsx` directly.
- **Stripe webhook not working locally:** Use Stripe CLI to forward webhooks to your local dev server:
  ```bash
  stripe listen --forward-to localhost:8787/api/webhooks/stripe
  ```
- **OpenAI/Gemini timeouts:** The OpenAI client is configured with a 60s–120s timeout. In Wrangler dev, Workers have a 50ms CPU limit in the free tier but longer wall-clock time for I/O. For long generations, monitor for 524/1101 errors.

---

*Last updated: 2026-04-18*
