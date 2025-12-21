# Resend Magic Link Authentication Setup

This guide walks you through setting up magic link authentication using Resend.

## 1. Create a Resend Account

1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to API Keys section
3. Create a new API key with "Sending access" permission
4. Copy the API key (starts with `re_`)

## 2. Configure Your Domain (Production)

For production, you need to verify a domain to send from:

1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `teachanything.app`)
3. Add the DNS records Resend provides (SPF, DKIM, DMARC)
4. Wait for verification (usually 5-10 minutes)

**Note:** For development, you can use Resend's test email (`delivered@resend.dev`) or send to the email address associated with your Resend account.

## 3. Environment Variables

Add these to your `.env.local` file:

```bash
# Resend API Key (required)
RESEND_API_KEY=re_your_api_key_here

# Email sender address (must be from verified domain in production)
# For development, use: "Teach Anything <onboarding@resend.dev>"
EMAIL_FROM="Teach Anything <noreply@yourdomain.com>"

# NextAuth configuration (if not already set)
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## 4. Run Database Migration

Execute the SQL migration in your Supabase SQL Editor:

```sql
-- File: supabase-migration-nextauth.sql
-- This creates the required tables for NextAuth magic link authentication
```

The migration adds:
- `verification_tokens` - Stores magic link tokens
- `accounts` - For OAuth providers (future use)
- `sessions` - Database session storage
- Additional columns to `users` table (`name`, `email_verified`, `image`)

## 5. Testing

### Development Testing

1. Start your dev server: `npm run dev`
2. Go to `/auth/signin`
3. Enter your email (must be the email associated with your Resend account during development, or use `delivered@resend.dev` for testing)
4. Check your email for the magic link
5. Click the link to sign in

### Production Checklist

- [ ] Domain verified in Resend
- [ ] `EMAIL_FROM` uses verified domain
- [ ] `NEXTAUTH_URL` set to production URL
- [ ] Database migration applied to production Supabase
- [ ] `NEXTAUTH_SECRET` is a secure random string

## Troubleshooting

### Email not received
- Check spam/junk folder
- Verify `RESEND_API_KEY` is correct
- In development, ensure you're using your Resend account email
- Check Resend dashboard for delivery logs

### "Configuration" error
- Ensure all required environment variables are set
- Verify Supabase connection is working

### "Verification" error
- The magic link has expired (24 hours) or already been used
- Request a new magic link

### Database errors
- Ensure the migration SQL was run successfully
- Check that `SUPABASE_SERVICE_ROLE_KEY` has correct permissions

## How It Works

1. User enters email on `/auth/signin`
2. NextAuth generates a secure token and stores it in `verification_tokens` table
3. Resend sends an email with a magic link containing the token
4. User clicks the link, NextAuth verifies the token
5. User is authenticated and a session is created
6. Token is deleted (single-use)

## Security Notes

- Tokens expire after 24 hours
- Each token can only be used once
- Sessions are stored in the database for better security
- The magic link URL contains a secure, random token

