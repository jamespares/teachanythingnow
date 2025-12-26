# Teach Anything Now

An AI-powered educational content generator that creates complete teaching packages including PowerPoint presentations, podcast-style audio, worksheets, and answer sheets.

## Features

- AI-generated PowerPoint presentations
- Podcast-style audio explanations
- Custom worksheets with questions
- Complete answer sheets
- Pay-per-use pricing (£1 per package)
- Secure authentication with NextAuth.js
- Payment processing with Stripe
- SEO optimized for teacher discoverability
- Modern, professional UI with Inter font

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Stripe account ([Create one here](https://stripe.com))

## Quick Setup

1. Clone and install dependencies:
```bash
git clone <your-repo-url>
cd teachanythingnow
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
```

3. Edit `.env.local` with your credentials:
```bash
# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key  # Get from https://resend.com/api-keys
EMAIL_FROM=onboarding@resend.dev  # Development (or use verified domain for production)

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here  # Generate with: openssl rand -base64 32

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID=price_your_monthly_subscription_price_id
```

4. Set up Stripe:
   - Create a product in Stripe Dashboard
   - Create a recurring price for £5/month
   - Copy the Price ID to `STRIPE_PRICE_ID`
   - Set up webhook endpoint (see below)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Stripe Configuration

### Create Product and Price

1. Go to Stripe Dashboard → Products
2. Create a new product: "Teach Anything Now Subscription"
3. Add a recurring price: £5.00 GBP / month
4. Copy the Price ID (starts with `price_`)

### Set Up Webhook

For local development:
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret (starts with `whsec_`) to `STRIPE_WEBHOOK_SECRET`.

For production, add your webhook endpoint in Stripe Dashboard:
- URL: `https://yourdomain.com/api/stripe/webhook`
- Events to listen for:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

## How It Works

1. Users sign in with email
2. Subscribe for £5/month via Stripe
3. Enter any topic to generate:
   - PowerPoint presentation (PPTX)
   - Podcast audio explanation (MP3)
   - Student worksheet (PDF)
   - Answer sheet (PDF)
4. Download all generated content

## Deployment

See [RAILWAY.md](./RAILWAY.md) for Railway deployment instructions.

For Vercel deployment:
1. Push code to GitHub
2. Connect repository in Vercel
3. Add all environment variables
4. Deploy

## Project Structure

```
teachanythingnow/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth routes
│   │   ├── generate/            # Content generation
│   │   ├── download/            # File downloads
│   │   ├── stripe/              # Stripe routes
│   │   └── subscription/        # Subscription status
│   ├── account/                 # Account management page
│   ├── auth/signin/             # Sign in page
│   ├── layout.tsx               # Root layout with SessionProvider
│   └── page.tsx                 # Main app page
├── lib/
│   ├── auth.ts                  # NextAuth configuration
│   ├── stripe.ts                # Stripe client
│   ├── subscription.ts          # Subscription utilities
│   ├── content-generator.ts     # AI content generation
│   ├── ppt-generator.ts         # PowerPoint generation
│   ├── audio-generator.ts       # Audio generation
│   └── worksheet-generator.ts   # Worksheet PDF generation
└── temp/                        # Generated files (gitignored)
```

## Troubleshooting

### Magic Link Emails Going to Spam
If sign-in emails are going to spam folder:
1. Check your spam/junk folder and mark as "Not Spam"
2. Add sender to your contacts
3. For production: Set up a verified domain in Resend (see [EMAIL-DELIVERABILITY.md](./EMAIL-DELIVERABILITY.md))
4. Use `EMAIL_FROM=onboarding@resend.dev` for development (better deliverability)

### Environment Variables Not Loading
Restart the development server after changing `.env.local`:
```bash
# Stop the server (Ctrl+C), then:
npm run dev
```

### Slow Generation Times
If you're using a VPN or in a region with restricted access:
- The app uses GPT-3.5-Turbo for faster responses
- Includes 60s timeout with 2 retries
- Typical generation time: 30-60 seconds

### Stripe Webhook Issues
Make sure:
- Webhook secret is correctly set in `.env.local`
- Stripe CLI is running for local development
- Webhook URL is correctly configured in Stripe Dashboard for production

## License

MIT
