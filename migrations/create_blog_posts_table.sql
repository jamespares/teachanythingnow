-- Create blog_posts table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at DESC);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.blog_posts IS 'Stores blog posts for the application';
COMMENT ON COLUMN public.blog_posts.slug IS 'URL-friendly identifier for the blog post';
COMMENT ON COLUMN public.blog_posts.published IS 'Whether the blog post is published and visible to users';
COMMENT ON COLUMN public.blog_posts.featured IS 'Whether the blog post should be featured on the homepage';

