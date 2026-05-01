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
