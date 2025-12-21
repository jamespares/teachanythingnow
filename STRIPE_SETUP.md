# Stripe Setup Guide

Complete guide to setting up Stripe for the £5/month subscription.

## 1. Create Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Sign up"
3. Complete registration
4. Verify your email

## 2. Get API Keys

### Test Mode (for development)

1. In Stripe Dashboard, ensure you're in **Test mode** (toggle in top right)
2. Go to **Developers → API keys**
3. Copy your keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - click "Reveal test key"

### Live Mode (for production)

1. Complete Stripe account activation (add business details, bank account)
2. Switch to **Live mode**
3. Go to **Developers → API keys**
4. Copy your live keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

## 3. Create Product and Price

1. In Stripe Dashboard, go to **Products → Add product**
2. Fill in product details:
   - **Name:** Teach Anything Now Subscription
   - **Description:** Unlimited AI-powered educational content generation
3. Under **Pricing**:
   - **Pricing model:** Standard pricing
   - **Price:** 5.00
   - **Currency:** GBP (£)
   - **Billing period:** Recurring → Monthly
4. Click **Save product**
5. Copy the **Price ID** (starts with `price_`) - you'll need this for `.env.local`

## 4. Set Up Webhook (Development)

For local development, use Stripe CLI:

### Install Stripe CLI

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows:**
```bash
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Linux:**
Download from [https://github.com/stripe/stripe-cli/releases](https://github.com/stripe/stripe-cli/releases)

### Configure Webhook

1. Login to Stripe CLI:
```bash
stripe login
```

2. Forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

3. Copy the webhook signing secret that appears (starts with `whsec_`)
4. Add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

**Keep this terminal running while developing!**

## 5. Set Up Webhook (Production)

When deploying to production:

1. Go to Stripe Dashboard → **Developers → Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL:** `https://yourdomain.com/api/stripe/webhook`
   - For Railway: `https://your-app.up.railway.app/api/stripe/webhook`
   - For Vercel: `https://your-app.vercel.app/api/stripe/webhook`
4. **Events to send:**
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Click on the webhook you just created
7. Copy the **Signing secret** (starts with `whsec_`)
8. Add it to your production environment variables

## 6. Environment Variables

Update your `.env.local`:

```bash
# Stripe Configuration (Test Mode for development)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PRICE_ID=price_your_price_id_here
```

For production, use your **live** keys:
```bash
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
STRIPE_PRICE_ID=price_your_price_id
```

## 7. Test Payment Flow

### Test Cards (Test Mode Only)

Use these test cards in test mode:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |
| `4000 0000 0000 9995` | Declined card |

**CVV:** Any 3 digits  
**Expiry:** Any future date  
**ZIP:** Any 5 digits

### Testing Steps

1. Start your dev server:
```bash
npm run dev
```

2. In another terminal, start Stripe webhook forwarding:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

3. Go to `http://localhost:3000`
4. Sign in with any email
5. Click "Subscribe Now"
6. Use test card `4242 4242 4242 4242`
7. Complete checkout
8. Verify you're redirected back with success message
9. Check Stripe CLI terminal for webhook events
10. Try generating content

## 8. Monitor Subscriptions

### View Customers and Subscriptions

1. Go to Stripe Dashboard → **Customers**
2. Click on a customer to see:
   - Subscription status
   - Payment history
   - Upcoming invoices

### View Payments

1. Go to **Payments** to see all transactions
2. Filter by status: Succeeded, Failed, etc.

### View Webhook Events

1. Go to **Developers → Webhooks**
2. Click on your webhook endpoint
3. View recent deliveries and responses

## 9. Customer Portal

The app includes Stripe Customer Portal for users to:
- View subscription details
- Update payment method
- View billing history
- Cancel subscription

This is accessible from the Account page after subscribing.

## 10. Going Live Checklist

Before accepting real payments:

- [ ] Complete Stripe account activation
- [ ] Add business details and tax information
- [ ] Verify bank account for payouts
- [ ] Switch to Live mode API keys
- [ ] Update production environment variables
- [ ] Set up production webhook endpoint
- [ ] Test the entire flow in production
- [ ] Monitor webhook deliveries for first few customers

## 11. Troubleshooting

### "No such price" error
- Verify the `STRIPE_PRICE_ID` is correct
- Ensure you're using the Price ID, not the Product ID
- Check you're in the right mode (test/live)

### Webhook not receiving events
- Ensure Stripe CLI is running (development)
- Verify webhook URL is correct (production)
- Check webhook signing secret matches
- View webhook logs in Stripe Dashboard

### Payment succeeds but subscription not active
- Check webhook is properly configured
- View webhook delivery attempts in Stripe Dashboard
- Check application logs for errors

### Customer portal not working
- Ensure Stripe account is fully activated
- Customer portal is automatically enabled in test mode
- For live mode, configure it in Stripe Dashboard → Settings → Customer portal

## 12. Pricing Changes

To change the £5 price:

1. Go to your product in Stripe Dashboard
2. Click **Add another price**
3. Set new price and billing period
4. Copy the new Price ID
5. Update `STRIPE_PRICE_ID` in environment variables
6. Redeploy

**Note:** Existing subscriptions continue at their original price.

## 13. Testing Subscription Cancellation

1. Subscribe with test card
2. Go to Account page
3. Click "Manage Subscription"
4. This opens Stripe Customer Portal
5. Click "Cancel subscription"
6. Confirm cancellation
7. Verify access is revoked after cancellation

## Support Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing Cards](https://stripe.com/docs/testing)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Stripe Dashboard](https://dashboard.stripe.com)


