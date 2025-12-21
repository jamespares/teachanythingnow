# Deploying to Railway

Railway is a modern platform for deploying applications with built-in database support and automatic deployments.

## Prerequisites

- Railway account ([Sign up here](https://railway.app))
- GitHub repository with your code
- Stripe account configured (see main README)

## Deployment Steps

### 1. Create New Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your repositories
5. Select your `teachanythingnow` repository

### 2. Configure Environment Variables

In your Railway project settings, add all environment variables:

```bash
# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Authentication
NEXTAUTH_URL=https://your-app-name.up.railway.app
NEXTAUTH_SECRET=your_nextauth_secret_here

# Stripe
STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
STRIPE_PRICE_ID=price_your_monthly_subscription_price_id
```

**Important Notes:**
- Use **live** Stripe keys for production (starts with `sk_live_` and `pk_live_`)
- Generate `NEXTAUTH_SECRET` with: `openssl rand -base64 32`
- Update `NEXTAUTH_URL` with your Railway domain (found in project settings)

### 3. Configure Build Settings

Railway auto-detects Next.js projects, but verify these settings:

- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Root Directory:** `/` (unless your project is in a subdirectory)

### 4. Set Up Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your Railway URL: `https://your-app-name.up.railway.app/api/stripe/webhook`
4. Select events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret (starts with `whsec_`)
6. Add it to Railway environment variables as `STRIPE_WEBHOOK_SECRET`
7. Redeploy your Railway app

### 5. Deploy

Railway automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Deploy to Railway"
git push origin main
```

Railway will:
1. Detect the push
2. Build your Next.js app
3. Deploy to production
4. Provide a public URL

### 6. Custom Domain (Optional)

To use your custom domain (`teachanythingnow.com`):

1. In Railway project settings, go to "Domains"
2. Click "Add Domain"
3. Enter `teachanythingnow.com`
4. Railway will provide DNS records
5. Add these records to your domain provider:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: Your Railway domain
6. Wait for DNS propagation (up to 24 hours)
7. Update `NEXTAUTH_URL` environment variable to `https://teachanythingnow.com`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `NEXTAUTH_URL` | Your app's URL | `https://yourapp.up.railway.app` |
| `NEXTAUTH_SECRET` | Random secret for auth | Generate with `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | Stripe secret key (live) | `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key (live) | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `STRIPE_PRICE_ID` | Stripe monthly price ID | `price_...` |

## Monitoring

Railway provides built-in monitoring:
- **Logs:** View real-time application logs
- **Metrics:** CPU, memory, and network usage
- **Deployments:** Track deployment history
- **Analytics:** Request and response metrics

Access these in your Railway project dashboard.

## Troubleshooting

### Deployment Fails

Check Railway logs for errors:
```bash
# In Railway dashboard, go to your project → Deployments → View Logs
```

Common issues:
- Missing environment variables
- Build errors (check Node.js version compatibility)
- Memory issues (upgrade Railway plan if needed)

### Webhook Not Working

1. Verify webhook URL is correct in Stripe Dashboard
2. Check `STRIPE_WEBHOOK_SECRET` is set correctly
3. View webhook delivery attempts in Stripe Dashboard
4. Check Railway logs for webhook errors

### Authentication Issues

1. Verify `NEXTAUTH_URL` matches your actual domain
2. Ensure `NEXTAUTH_SECRET` is set
3. Check browser console for errors

## Costs

Railway offers:
- **Free Tier:** $5 of usage credits per month
- **Hobby Plan:** $5/month for $5 in credits
- **Pro Plan:** $20/month for $20 in credits

Your app should fit within the Hobby plan with moderate usage.

## Updates and Maintenance

To update your app:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main
```

Railway automatically deploys the changes.

## Rollback

If something goes wrong:

1. Go to Railway Dashboard → Deployments
2. Find a previous successful deployment
3. Click "..." → "Redeploy"

## Support

- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app
- GitHub Issues: Your repository issues page
