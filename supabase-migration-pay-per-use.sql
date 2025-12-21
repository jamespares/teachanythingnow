-- Migration: Transition from Subscriptions to Pay-Per-Use Model
-- Run this in your Supabase SQL Editor
-- This migration removes subscription tables and ensures payments table is set up correctly

-- Step 1: Drop subscription-related tables if they exist
DROP TABLE IF EXISTS subscriptions CASCADE;

-- Step 2: Ensure payments table exists with correct structure
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 100, -- Amount in pence (100 = £1.00)
  currency TEXT NOT NULL DEFAULT 'gbp', -- Currency code
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
  topic TEXT, -- The topic that was generated
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Add currency column if it doesn't exist (for existing payments table)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'currency'
  ) THEN
    ALTER TABLE payments ADD COLUMN currency TEXT NOT NULL DEFAULT 'gbp';
  END IF;
END $$;

-- Step 4: Update existing payments to have currency if NULL
UPDATE payments SET currency = 'gbp' WHERE currency IS NULL;

-- Step 5: Ensure all indexes exist
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_topic ON payments(topic) WHERE topic IS NOT NULL;

-- Step 6: Ensure trigger exists for updated_at
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Ensure RLS policies are correct (remove subscription policies if they exist)
-- Drop old subscription policies if the table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscriptions') THEN
    DROP POLICY IF EXISTS "Service role full access on subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
  END IF;
END $$;

-- Ensure payments policy exists
DROP POLICY IF EXISTS "Service role full access on payments" ON payments;
CREATE POLICY "Service role full access on payments" ON payments
  FOR ALL USING (true);

-- Step 8: Add constraint to ensure amount is positive
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_amount_positive;
ALTER TABLE payments ADD CONSTRAINT payments_amount_positive CHECK (amount > 0);

-- Step 9: Add constraint to ensure currency is lowercase
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_currency_lowercase;
ALTER TABLE payments ADD CONSTRAINT payments_currency_lowercase CHECK (currency = LOWER(currency));

-- Step 10: Create a view for payment statistics (optional but useful)
CREATE OR REPLACE VIEW payment_stats AS
SELECT 
  COUNT(*) as total_payments,
  COUNT(*) FILTER (WHERE status = 'succeeded') as successful_payments,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_payments,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_payments,
  SUM(amount) FILTER (WHERE status = 'succeeded') as total_revenue_pence,
  AVG(amount) FILTER (WHERE status = 'succeeded') as average_payment_pence,
  MIN(created_at) as first_payment_date,
  MAX(created_at) as last_payment_date
FROM payments;

-- Migration complete!
-- The database is now configured for pay-per-use model (£1 per package)

