# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed — 2026-07-29: Free tier + Workers AI + English-only
- **Service is now free**: Removed all Stripe payment logic (`/api/payment/create`, `/api/webhooks/stripe`, Stripe Elements card form, payment verification gate in `/api/generate`). Users get 5 free lesson packages per account per day (resets midnight UTC), enforced in `/api/generate`.
- **All AI now runs on Cloudflare Workers AI**: Text generation (slides, podcast script, worksheet) uses Kimi K2.6 primary with Llama 3.3 70B fallback (previously OpenAI GPT-4o). Audio narration uses Deepgram Aura-1 (previously OpenAI TTS-1-HD), with sentence-boundary chunking for long scripts. Image prompt crafting moved to Workers AI text models; FLUX.1 schnell image generation unchanged. No OpenAI or AI Gateway keys required.
- **English-only UI**: Removed the unused i18n system (`src/lib/i18n.ts`, FR/ZH dictionaries) and legacy `src/pages/Layout.tsx`.
- **UI consistency pass**: Fixed utility classes the markup relied on but the stylesheet never defined (two-column form grid, `flex-wrap`, `pl-6`, hero sizing, and ~30 others), unified inputs on a consistent radius with an `.input-compact` variant, replaced the off-palette dashboard badge with an accent `.badge`, shared the Footer component across Auth/Reset Password/Terms pages, and removed leftover Stripe/lang-toggle CSS.
- **Config**: Removed `stripe` and `openai` npm dependencies, `STRIPE_*`/`OPENAI_*`/`CF_AI_GATEWAY_*` env vars from `wrangler.jsonc` and `.env.example`. The historical `payments` D1 table is kept untouched but no longer referenced in code.
- **Terms of Service**: Replaced payment/refund/chargeback sections with free-service fair-use terms.


### Added
- **Samples section**: Added a new "Samples" section on the landing page where users can download sample resources (PowerPoint, audio, worksheets, answer keys) to preview quality
- **Google Gemini Nano Banana integration**: Updated image generation to use Google Gemini Nano Banana API for faster and more efficient image generation
- **Blog posts table migration**: Added SQL migration file for creating the blog_posts table in Supabase

### Changed
- **Logo updates**: Updated logo across all pages - removed text labels, increased size (250x83), and improved background blending with CSS mix-blend-mode
- **Header styling**: Removed grey border separator lines from all headers for cleaner design
- **Landing page**: Replaced "How It Works" section with "Samples" section to showcase resource quality

### Fixed
- **Podcast generation**: Fixed issue where podcast was outputting as text script instead of MP3 file. Now always generates MP3 audio or throws a clear error if generation fails (removed silent text fallback).

### Technical
- **Image generator**: Refactored to support Google Gemini API with fallback to Banana.dev API
- **Base64 image handling**: Updated download function to handle base64 data URLs from Gemini API
