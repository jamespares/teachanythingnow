# Teach Anything Now

A Cloudflare-native educational content generation platform. This application allows users to enter any topic and generate a complete teaching package including a PowerPoint presentation, a podcast-style audio explanation, an editable worksheet with answer keys, and high-quality educational images.

## 🚀 Tech Stack

- **Framework**: [Hono](https://hono.dev/) (Cloudflare Workers / Pages)
- **Frontend**: Hono JSX (Server-Side Rendering)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Storage**: [Cloudflare R2](https://developers.cloudflare.com/r2/)
- **AI Stack**: OpenAI (GPT-4o, TTS-1-HD), Google Gemini (Image Generation)
- **Payments**: Stripe

## 🛠️ Getting Started

### Prerequisites

- [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Node.js (v18+)

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Initialize Cloudflare Resources**:
   ```bash
   # Create D1 Database
   npx wrangler d1 create teach-anything-db
   
   # Create R2 Bucket
   npx wrangler r2 bucket create teach-anything-assets
   ```

3. **Configure Environment**:
   Update `wrangler.toml` with your `database_id` and bucket bindings.

4. **Database Migrations**:
   ```bash
   # Generate migrations from Drizzle schema
   npm run db:generate
   
   # Apply migrations to local/remote D1
   npm run db:migrate
   ```

5. **Secrets**:
   Add your API keys to Cloudflare:
   ```bash
   npx wrangler secret put STRIPE_SECRET_KEY
   npx wrangler secret put OPENAI_API_KEY
   npx wrangler secret put GOOGLE_GEMINI_API_KEY
   npx wrangler secret put BETTER_AUTH_SECRET
   ```

6. **Development**:
   ```bash
   npm run dev
   ```

## 📐 Project Structure

- `src/index.ts`: Main Hono router and API endpoints.
- `src/db/`: Database schema and Drizzle configuration.
- `src/lib/`: Generation logic (PPT, Audio, Worksheet, Images).
- `src/pages/`: Hono JSX components for UI rendering.
- `public/`: Static assets and global CSS.

## 📄 License

MIT
