import { describe, it, expect } from 'vitest';

describe('Last Minute Lessons — Design System Migration', () => {
  it('should have the new styles.css file', async () => {
    const fs = await import('fs');
    const exists = fs.existsSync('./public/styles.css');
    expect(exists).toBe(true);
  });

  it('should have removed the old globals.css file', async () => {
    const fs = await import('fs');
    const exists = fs.existsSync('./public/globals.css');
    expect(exists).toBe(false);
  });

  it('should have component files', async () => {
    const fs = await import('fs');
    expect(fs.existsSync('./src/components/Layout.tsx')).toBe(true);
    expect(fs.existsSync('./src/components/Navbar.tsx')).toBe(true);
    expect(fs.existsSync('./src/components/Footer.tsx')).toBe(true);
  });

  it('should have removed the old pages/Layout.tsx', async () => {
    const fs = await import('fs');
    expect(fs.existsSync('./src/pages/Layout.tsx')).toBe(false);
  });

  it('should use design system tokens in styles.css', async () => {
    const fs = await import('fs');
    const css = fs.readFileSync('./public/styles.css', 'utf-8');
    expect(css).toContain('--accent: #f59e0b');
    expect(css).toContain('--font-body');
    expect(css).toContain('--font-heading');
    expect(css).toContain('--radius-xl');
    expect(css).toContain('--shadow-sm');
  });

  it('should have Better Auth configured', async () => {
    const fs = await import('fs');
    const auth = fs.readFileSync('./src/lib/auth.ts', 'utf-8');
    expect(auth).toContain('better-auth');
    expect(auth).toContain('drizzleAdapter');
    expect(auth).toContain('emailAndPassword');
  });
});

describe('Last Minute Lessons — Free tier & Workers AI migration', () => {
  it('should have removed the Stripe library', async () => {
    const fs = await import('fs');
    expect(fs.existsSync('./src/lib/stripe.ts')).toBe(false);
  });

  it('should have no Stripe or OpenAI references in source code', async () => {
    const fs = await import('fs');
    const files = [
      './src/index.ts',
      './src/pages/Home.tsx',
      './src/lib/content-generator.ts',
      './src/lib/audio-generator.ts',
      './src/lib/image-generator.ts',
    ];
    for (const file of files) {
      const src = fs.readFileSync(file, 'utf-8');
      expect(src.toLowerCase(), `${file} should not reference stripe`).not.toContain('stripe');
      expect(src, `${file} should not reference OpenAI`).not.toContain('openai');
      expect(src, `${file} should not reference OPENAI_API_KEY`).not.toContain('OPENAI_API_KEY');
    }
  });

  it('should have removed the legacy i18n system (English-only)', async () => {
    const fs = await import('fs');
    expect(fs.existsSync('./src/lib/i18n.ts')).toBe(false);
  });

  it('should not load Stripe.js or language toggles on the landing page', async () => {
    const fs = await import('fs');
    const home = fs.readFileSync('./src/pages/Home.tsx', 'utf-8');
    expect(home).not.toContain('js.stripe.com');
    expect(home).not.toContain('payment-element');
    const css = fs.readFileSync('./public/styles.css', 'utf-8');
    expect(css).not.toContain('.lang-toggle');
    expect(css).not.toContain('.StripeElement');
  });

  it('should run all generation on Cloudflare Workers AI', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('./src/lib/content-generator.ts', 'utf-8');
    expect(content).toContain('@cf/moonshotai/kimi-k2.6');
    expect(content).toContain('@cf/meta/llama-3.3-70b-instruct-fp8-fast');
    const audio = fs.readFileSync('./src/lib/audio-generator.ts', 'utf-8');
    expect(audio).toContain('@cf/deepgram/aura-1');
    const images = fs.readFileSync('./src/lib/image-generator.ts', 'utf-8');
    expect(images).toContain('@cf/black-forest-labs/flux-1-schnell');
  });

  it('should enforce a daily free limit in the generate route', async () => {
    const fs = await import('fs');
    const index = fs.readFileSync('./src/index.ts', 'utf-8');
    expect(index).toContain('DAILY_FREE_LIMIT');
    expect(index).toContain('429');
  });

  it('should define the utility classes used by the form grid and feature cards', async () => {
    const fs = await import('fs');
    const css = fs.readFileSync('./public/styles.css', 'utf-8');
    expect(css).toContain('.md\\:grid-cols-2');
    expect(css).toContain('.flex-wrap');
    expect(css).toContain('.flex-1');
    expect(css).toContain('.pl-6');
    expect(css).toContain('.feature-card');
    expect(css).toContain('.input-compact');
    expect(css).toContain('.badge');
    expect(css).toContain('.hero-h1');
  });
});
