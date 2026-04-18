# HyperFrames Demo Video Prompt — Teach Anything Now

Use this prompt with Claude Code + the HyperFrames skill to generate a 15-second product demo MP4.

## Prerequisites

```bash
npx skills add heygen-com/hyperframes
```

Then in Claude Code, run:

```
/hyperframes Create a demo video for my product using the spec in demo-video/PROMPT.md
```

---

## Product Overview

**Teach Anything Now** — an AI tool for teachers and educators. Type any topic, pay £1, and instantly receive a complete lesson package: PowerPoint presentation, podcast audio MP3, student worksheet, and AI-generated images.

**Brand colors:**
- Primary green: `#00a884`
- Dark green: `#008f70`
- Background: `#0a0a0a`
- Card background: `#1a1a1a`
- Border: `#333333`
- Text primary: `#ffffff`
- Text secondary: `#a1a1aa`
- Text muted: `#71717a`

**Fonts:**
- Headings: `Lexend` (Google Fonts) — weights 600, 700
- Body: `Inter` (Google Fonts) — weights 400, 500

---

## Video Specification

| Property | Value |
|----------|-------|
| Resolution | 1920 × 1080 |
| Duration | 15 seconds |
| Frame rate | 30 fps |
| Format | MP4 |
| Background | Dark `#0a0a0a` with subtle grid pattern |

---

## Scene Breakdown

### Scene 1 — Hero (0.0s → 4.5s)

**Content:**
- Large title: **"Teach Anything Now"**
- Subtitle: **"Create complete lesson materials in seconds with AI."**
- CTA button: **"Get Started →"** (green `#00a884` background, white text)

**Animation:**
1. At 0.2s: Title slides up from `y: 60` with fade in. Duration 1.0s. Ease: `power3.out`.
2. At 0.6s: Subtitle slides up from `y: 40` with fade in. Duration 0.8s. Ease: `power3.out`.
3. At 1.0s: CTA button scales from 0.95 to 1.0 and fades in with a slight bounce. Duration 0.6s. Ease: `back.out(1.4)`.
4. At 3.8s: Entire scene slides up `y: -40` and fades out. Duration 0.5s. Ease: `power2.in`.

**Layout:**
- All elements centered horizontally and vertically.
- Title: 96px, Lexend 700, white, letter-spacing `-0.03em`.
- Subtitle: 36px, Inter 400, `#a1a1aa`, line-height 1.4.
- CTA: 28px, Lexend 600, white on `#00a884`, padding `20px 48px`, border-radius 12px.

---

### Scene 2 — Topic Input (4.5s → 8.5s)

**Content:**
- Section label (top center): **"TYPE ANY TOPIC"** — 20px, Lexend 600, `#00a884`, uppercase, letter-spacing `0.15em`.
- Input box (center): simulates typing **"The Solar System"** with a blinking cursor.

**Animation:**
1. At 4.5s: Scene fades in (opacity 0 → 1). Duration 0.4s.
2. At 4.9s: Typewriter effect begins. Each character of "The Solar System" appears one by one, ~80ms per character.
3. Blinking cursor (green `#00a884`, 3px wide, 32px tall) pulses continuously.
4. At 8.0s: Scene slides up `y: -30` and fades out. Duration 0.4s.

**Layout:**
- Input box: 800px wide, 80px tall, background `rgba(255,255,255,0.06)`, border `2px solid #333`, border-radius 12px.
- Inside box: "e.g." in muted gray, then typed text in white (`#ffffff`), then blinking cursor.
- Font inside box: 28px, Inter.

---

### Scene 3 — Output Cards (8.5s → 12.5s)

**Content:**
- Section label (top center): **"INSTANTLY RECEIVE"** — same style as Scene 2 label.
- Four cards in a horizontal row, centered:
  1. 📊 **Presentation** `.pptx`
  2. 🎙️ **Podcast** `.mp3`
  3. 📝 **Worksheet** `.docx`
  4. 🎨 **AI Images** `.png`

**Animation:**
1. At 8.5s: Scene fades in. Duration 0.4s.
2. At 8.8s: Card 1 slides up from `y: 80`, scales from 0.9 to 1.0, fades in. Duration 0.5s. Ease: `back.out(1.2)`.
3. At 9.0s: Card 2 same animation.
4. At 9.2s: Card 3 same animation.
5. At 9.4s: Card 4 same animation.
6. At 12.0s: Scene slides up `y: -30` and fades out. Duration 0.4s.

**Card layout:**
- Each card: 360px wide, 480px tall, background `#1a1a1a`, border `1px solid #333`, border-radius 16px.
- Icon: 72px emoji, centered top.
- Label: 28px, Lexend 600, white, centered.
- File extension: 20px, `#00a884`, centered below label.
- Cards spaced 32px apart.

---

### Scene 4 — Final CTA (12.5s → 15.0s)

**Content:**
- Main text: **"£1 per lesson. Instant results."**
- URL: **"teachanythingnow.com"**
- Subtext: **"Sign up & generate in 60 seconds"**

**Animation:**
1. At 12.5s: Scene fades in. Duration 0.4s.
2. At 12.6s: Main text slides up from `y: 50` and fades in. Duration 0.7s. Ease: `power3.out`.
3. At 13.1s: URL slides up from `y: 30` and fades in. Duration 0.5s. Ease: `power3.out`.
4. At 13.4s: Subtext slides up from `y: 20` and fades in. Duration 0.5s. Ease: `power3.out`.
5. Hold until video ends at 15.0s.

**Layout:**
- All centered.
- Main text: 64px, Lexend 700, white, line-height 1.2.
- URL: 48px, Lexend 600, `#00a884`.
- Subtext: 28px, Inter 400, `#71717a`.

---

## Shared Background Elements

These persist across all scenes:

1. **Grid pattern:** Subtle 60px grid lines at `rgba(255,255,255,0.03)`. CSS:
   ```css
   background-image:
     linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
     linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
   background-size: 60px 60px;
   ```

2. **Glow orb:** Large radial gradient circle, `600px × 600px`, positioned top-right corner:
   ```css
   background: radial-gradient(circle, rgba(0,168,132,0.15) 0%, transparent 70%);
   ```

Both background layers should use `data-start="0" data-duration="15" data-track-index="0"` (grid) and `data-track-index="1"` (glow).

---

## HyperFrames Data Attributes

Every timed element must have:
- `class="clip"`
- `data-start` (seconds)
- `data-duration` (seconds)
- `data-track-index` (layer order, higher = in front)

The root stage:
```html
<div id="stage"
     data-composition-id="tan-demo"
     data-start="0"
     data-width="1920"
     data-height="1080">
```

GSAP timeline must be registered as:
```js
window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
```

Use `gsap.timeline({ paused: true })`.

**Critical:** Do NOT use `Math.random()` or any `async` operations in the setup script. Renders must be deterministic.

---

## Google Fonts Include

```html
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
```

---

## Render Command

After generating the composition:

```bash
npx hyperframes render index.html --output tan-demo.mp4
```

Or if using a project directory:
```bash
npx hyperframes render --output tan-demo.mp4
```

---

## Acceptance Criteria

- [ ] 1920×1080 resolution
- [ ] Exactly 15 seconds duration
- [ ] All 4 scenes present with correct timing
- [ ] Brand colors match the spec exactly
- [ ] Lexend for headings, Inter for body text
- [ ] Smooth GSAP animations with specified easings
- [ ] Deterministic (same input = identical output)
- [ ] Final file is MP4 format
- [ ] No `Math.random()` or async in setup
- [ ] All timed elements have `class="clip"` and correct `data-*` attributes
