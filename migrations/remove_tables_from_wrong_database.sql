-- ============================================================================
-- Remove tables from WRONG database (pxzsexwycvcdhfdbpvjw.supabase.co)
-- Run this in the WRONG Supabase project SQL Editor
-- WARNING: This will DELETE all data in these tables!
-- ============================================================================

-- Drop tables in reverse order of dependencies (packages depends on payments)
-- Drop triggers first
DROP TRIGGER IF EXISTS update_packages_updated_at ON public.packages;
DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;

-- Drop tables (CASCADE will drop dependent objects like indexes, constraints)
DROP TABLE IF EXISTS public.packages CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;

-- Drop the trigger function if it's not used elsewhere
-- (Only drop if you're sure no other tables use it)
-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Note: The update_updated_at_column() function might be used by other tables
-- in the wrong database, so we're leaving it. If you want to remove it too,
-- uncomment the line above, but make sure no other tables depend on it first.

