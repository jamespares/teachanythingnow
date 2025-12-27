-- Migration: Add payment security fields to prevent reuse attacks
-- Run this migration to add the used_at field to your payments table
-- This prevents users from reusing the same payment for multiple generations

-- Add used_at field to track when a payment has been consumed
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS used_at TIMESTAMP WITH TIME ZONE NULL;

-- Add index for faster lookups of unused payments
CREATE INDEX IF NOT EXISTS idx_payments_used_at ON payments(used_at) WHERE used_at IS NULL;

-- Add comment explaining the field
COMMENT ON COLUMN payments.used_at IS 'Timestamp when payment was consumed for generation. NULL means unused. Prevents payment reuse attacks.';

-- Optional: If you want to ensure payments table has all required fields, uncomment below:
-- ALTER TABLE payments 
--   ADD COLUMN IF NOT EXISTS amount INTEGER CHECK (amount > 0),
--   ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'gbp',
--   ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled'));

