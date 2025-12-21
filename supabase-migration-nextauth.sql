-- NextAuth.js Database Tables for Magic Link Authentication
-- Run this in your Supabase SQL Editor after the main schema

-- Verification Tokens table (required for magic link / email auth)
-- These tokens are single-use and expire after a short period
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Accounts table (stores OAuth provider accounts linked to users)
-- Required by NextAuth adapter for potential future OAuth providers
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, provider_account_id)
);

-- Sessions table (for database session strategy - optional but recommended)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);

-- Add name column to users table if not exists (required by NextAuth)
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS image TEXT;

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_verification_tokens_identifier ON verification_tokens(identifier);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_session_token ON sessions(session_token);

-- Enable RLS on new tables
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Policies for service role access
CREATE POLICY "Service role full access on verification_tokens" ON verification_tokens
  FOR ALL USING (true);

CREATE POLICY "Service role full access on accounts" ON accounts
  FOR ALL USING (true);

CREATE POLICY "Service role full access on sessions" ON sessions
  FOR ALL USING (true);

