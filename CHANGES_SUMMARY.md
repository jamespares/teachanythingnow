# Changes Summary - Pricing, Landing Page & Database

## ✅ Completed Changes

### 1. Pricing Updated to £25/month
- Updated pricing display in `app/page.tsx` from £5 to £25/month
- Updated pricing in landing page to £25/month

### 2. Landing Page Created
- New landing page at `/app/landing/page.tsx`
- Sleek, modern design with:
  - Hero section with clear value proposition
  - Feature grid showcasing all 4 content types
  - Pricing section
  - Call-to-action buttons
- Unauthenticated users are redirected from `/` to `/landing`
- Authenticated users visiting `/landing` are redirected to `/`

### 3. Supabase Database Integration
- **Package Added**: `@supabase/supabase-js` added to `package.json`
- **Database Client**: Created `lib/supabase.ts` with admin client
- **Database Schema**: Created `supabase-schema.sql` with:
  - `users` table (email, stripe_customer_id)
  - `subscriptions` table (subscription status, period end)
  - Indexes for fast queries
  - Auto-updating timestamps
- **Webhook Updated**: `app/api/stripe/webhook/route.ts` now:
  - Syncs subscriptions to Supabase on create/update
  - Deletes subscriptions on cancellation
  - Handles payment success/failure events
- **Subscription Check Updated**: `lib/subscription.ts` now:
  - Checks Supabase first (faster than Stripe API)
  - Falls back to Stripe API if needed
  - Syncs user data to Supabase

## 📋 Next Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
Follow the instructions in `SUPABASE_SETUP.md`:
1. Create Supabase project
2. Run the SQL schema
3. Get API keys
4. Add environment variables

### 3. Update Stripe Price
In your Stripe dashboard:
1. Go to Products → Your Product
2. Create a new price: £25/month (or update existing)
3. Update `STRIPE_PRICE_ID` environment variable

### 4. Test the Flow
1. Visit `/landing` (should see new landing page)
2. Sign in → redirected to `/`
3. Subscribe → webhook should sync to Supabase
4. Check Supabase dashboard → should see subscription data

## 🔧 Environment Variables Needed

Add these to your `.env.local` and Railway:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth (Required for authentication)
NEXTAUTH_URL=http://localhost:3000  # or https://your-domain.com for production
NEXTAUTH_SECRET=gi33cVi2Vt97N7K1DIKv2UCl5WLn1eJK3vuW8TTgexs=

# Stripe (already have these)
STRIPE_SECRET_KEY=sk_...
STRIPE_PRICE_ID=price_... (update to £25/month price)
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Note**: `NEXTAUTH_SECRET` is required for NextAuth to work. A secure secret has been generated above. Generate a new one with `openssl rand -base64 32` if needed.

## 📊 Benefits

1. **Faster Subscription Checks**: Database queries are much faster than Stripe API calls
2. **Better Reliability**: Database acts as cache/backup for subscription status
3. **Future-Ready**: Database ready for usage tracking, analytics, etc.
4. **Professional Landing Page**: Better conversion with dedicated landing page
5. **Higher Pricing**: £25/month provides better profit margins

## 🐛 Troubleshooting

- **Landing page not showing?** Make sure you're not logged in, or visit `/landing` directly
- **Database errors?** Check `SUPABASE_SETUP.md` for setup instructions
- **Webhook not syncing?** Verify webhook URL in Stripe and check Railway logs

