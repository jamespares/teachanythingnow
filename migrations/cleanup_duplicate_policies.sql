-- Cleanup Duplicate Policies
-- Run this in the Supabase SQL Editor to fix the "Performance" issues

-- 1. Wipe ALL existing policies on 'packages' and 'payments' to remove duplicates
-- This uses a PL/pgSQL block to dynamically find and drop all policies on these tables
DO $$ 
DECLARE 
  r RECORD; 
BEGIN 
  FOR r IN (
    SELECT policyname, tablename 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename IN ('packages', 'payments')
  ) LOOP 
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename); 
  END LOOP; 
END $$;

-- 2. Re-create the single Source of Truth policies

-- PACKAGES: Users can only see their own packages
CREATE POLICY "Users can view own packages" 
ON public.packages 
FOR SELECT 
USING (auth.uid() = user_id);

-- PAYMENTS: Users can only see their own payments
CREATE POLICY "Users can view own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

-- 3. Ensure RLS is still enabled (just in case)
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
