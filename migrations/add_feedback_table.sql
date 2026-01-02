-- Migration: Add feedback table
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id), -- Optional, if user is logged in
  type TEXT NOT NULL CHECK (type IN ('bug', 'feature', 'general', 'other')),
  message TEXT NOT NULL,
  page_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback (authenticated or anon)
CREATE POLICY "Anyone can submit feedback" 
ON public.feedback 
FOR INSERT 
WITH CHECK (true);

-- Only admins/service_role can view feedback (no public select)
-- (Implicitly denied for public/anon by default since no SELECT policy is added)
