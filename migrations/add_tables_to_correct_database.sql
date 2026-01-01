-- ============================================================================
-- Add tables to CORRECT database (hhjbnaxncirkhlgmzago.supabase.co)
-- Run this in the CORRECT Supabase project SQL Editor
-- ============================================================================

-- 1. Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'gbp',
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
  topic TEXT,
  used_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Ensure used_at column exists (in case table was created without it)
-- This MUST happen before creating the index
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS used_at TIMESTAMP WITH TIME ZONE NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON public.payments(stripe_payment_intent_id);

-- Only create used_at index if the column exists (safety check)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'payments' 
    AND column_name = 'used_at'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_payments_used_at ON public.payments(used_at) WHERE used_at IS NULL;
  END IF;
END $$;

-- Add comment
COMMENT ON TABLE public.payments IS 'Stores payment intents from Stripe';
COMMENT ON COLUMN public.payments.used_at IS 'Timestamp when payment was consumed for generation. NULL means unused. Prevents payment reuse attacks.';

-- 2. Create packages table
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  payment_id UUID NULL,
  topic TEXT NOT NULL,
  file_id TEXT NOT NULL,
  files JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT packages_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_packages_user_id ON public.packages(user_id);
CREATE INDEX IF NOT EXISTS idx_packages_payment_id ON public.packages(payment_id);
CREATE INDEX IF NOT EXISTS idx_packages_file_id ON public.packages(file_id);

-- Add comment
COMMENT ON TABLE public.packages IS 'Stores generation packages (files) for users to view and redownload';
COMMENT ON COLUMN public.packages.file_id IS 'Unique identifier for the generation session, used as prefix for all files';
COMMENT ON COLUMN public.packages.files IS 'JSON object containing file names: {presentation, audio, worksheet, answerSheet, images[]}';

-- 3. Create blog_posts table (if not already created)
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Teach Anything Now Team',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at DESC);

-- Add updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at (drop first if they exist)
DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_packages_updated_at ON public.packages;
CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.blog_posts IS 'Stores blog posts for the application';
COMMENT ON COLUMN public.blog_posts.slug IS 'URL-friendly identifier for the blog post';
COMMENT ON COLUMN public.blog_posts.published IS 'Whether the blog post is published and visible to users';
COMMENT ON COLUMN public.blog_posts.featured IS 'Whether the blog post should be featured on the homepage';

