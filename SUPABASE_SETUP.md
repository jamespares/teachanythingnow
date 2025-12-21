# Supabase Setup Guide

This guide will help you set up Supabase for your Teach Anything Now application.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: `teachanythingnow` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your Railway deployment
4. Click "Create new project"
5. Wait 2-3 minutes for the project to initialize

## Step 2: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click "Run" (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

## Step 3: Get Your API Keys

1. In Supabase dashboard, go to **Settings** → **API** (left sidebar)
2. You'll need two keys:
   - **Project URL** (under "Project URL") - This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** (under "Project API keys" → "service_role" → "Reveal") - This is your `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important**: Never expose the `service_role` key in client-side code. It bypasses Row Level Security.

## Step 4: Add Environment Variables

### For Local Development (.env.local)

Add these to your `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# NextAuth (Required for authentication)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gi33cVi2Vt97N7K1DIKv2UCl5WLn1eJK3vuW8TTgexs=
```

**Note**: The `NEXTAUTH_SECRET` above is a generated secure secret. You can generate a new one with:
```bash
openssl rand -base64 32
```

### For Railway Deployment

1. Go to your Railway project dashboard
2. Click on your service
3. Go to **Variables** tab
4. Add these environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = `your-service-role-key-here`
   - `NEXTAUTH_URL` = `https://your-app-name.up.railway.app` (your Railway domain)
   - `NEXTAUTH_SECRET` = `gi33cVi2Vt97N7K1DIKv2UCl5WLn1eJK3vuW8TTgexs=` (or generate new one)

## Step 5: Install Dependencies

Run this command in your project directory:

```bash
npm install
```

This will install `@supabase/supabase-js` which was added to `package.json`.

## Step 6: Verify Setup

1. Start your development server: `npm run dev`
2. Sign in to your app
3. Subscribe (or use Stripe test mode)
4. Check your Supabase dashboard → **Table Editor** → `subscriptions` table
5. You should see your subscription data appear after the webhook fires

## Troubleshooting

### Webhook not syncing data?

1. Make sure your webhook URL in Stripe is correct: `https://your-domain.com/api/stripe/webhook`
2. Check Railway logs for webhook errors
3. Verify environment variables are set correctly
4. Check Supabase logs: Dashboard → **Logs** → **Postgres Logs**

### Database connection errors?

1. Verify `NEXT_PUBLIC_SUPABASE_URL` starts with `https://`
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is the full key (starts with `eyJ...`)
3. Check that the schema was run successfully in SQL Editor

### Subscription check not working?

The app falls back to Stripe API if Supabase query fails, so it should still work. Check:
1. Supabase connection is working
2. Database schema was created correctly
3. Webhook is syncing data properly

## Database Schema Overview

- **users**: Stores user email and Stripe customer ID
- **subscriptions**: Stores subscription status, period end, and links to users

Both tables have automatic `updated_at` timestamps and indexes for fast queries.

## Next Steps

Once Supabase is set up, your app will:
- ✅ Store subscription data locally (faster lookups)
- ✅ Sync automatically via Stripe webhooks
- ✅ Have a reliable database for future features (usage tracking, analytics, etc.)

