-- Fix Security Issues identified in Audit
-- Run this in the Supabase SQL Editor

-- 1. Enable Row Level Security (RLS) on tables
-- This specifically fixes the "Table is public, but RLS has not been enabled" warnings
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 2. Create Access Policies (Permissions)
-- Without these, enabling RLS would block ALL access (even legitimate ones)

-- PACKAGES: Users can only see their own packages
DROP POLICY IF EXISTS "Users can view own packages" ON public.packages;
CREATE POLICY "Users can view own packages" 
ON public.packages 
FOR SELECT 
USING (auth.uid() = user_id);

-- PAYMENTS: Users can only see their own payments
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

-- BLOG POSTS: Public can read, only Service Role can write
DROP POLICY IF EXISTS "Public can view published posts" ON public.blog_posts;
CREATE POLICY "Public can view published posts" 
ON public.blog_posts 
FOR SELECT 
USING (true);

-- 3. Fix Function Security (Mutable search_path)
-- This prevents malicious users from overriding system functions
ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_temp;

-- Note on View `public.payment_stats`:
-- If this view is flagged as having "SECURITY DEFINER", it likely calls a function with that property.
-- You should generally ensure such views/functions are set to SECURITY INVOKER unless they specifically need to bypass RLS.
-- Example fix if it were a function: ALTER FUNCTION public.payment_stats() SECURITY INVOKER;
