# Demo Video — HyperFrames

This folder contains a **HyperFrames** composition that renders a 15-second product demo video for Teach Anything Now.

## What is HyperFrames?

[HyperFrames](https://github.com/heygen-com/hyperframes) is an open-source framework by HeyGen that turns HTML + CSS + GSAP into deterministic MP4 videos. No After Effects, no cloud API, no GPU required.

## Quick Start

### 1. Install HyperFrames

```bash
npx skills add heygen-com/hyperframes
```

Or manually:

```bash
git clone https://github.com/heygen-com/hyperframes
cd hyperframes
npm install
```

### 2. Preview (browser, live reload)

```bash
npx hyperframes preview index.html
```

### 3. Render to MP4

```bash
npx hyperframes render index.html --output tan-demo.mp4
```

### 4. Lint (check for common issues)

```bash
npx hyperframes lint index.html
```

## Video Structure

| Time | Scene | Description |
|------|-------|-------------|
| 0.0s – 4.5s | Hero | Title "Teach Anything Now" + subtitle + CTA button fade in |
| 4.5s – 8.5s | Input | Topic box with typewriter animation typing "The Solar System" |
| 8.5s – 12.5s | Output | 4 cards slide up: PPTX, MP3, DOCX, AI Images |
| 12.5s – 15.0s | CTA | "£1 per lesson. Instant results." + URL |

**Resolution:** 1920×1080  
**Duration:** 15 seconds  
**Frame rate:** 30fps (HyperFrames default)

## Customising

- Edit `index.html` to change text, colours, timing
- Adjust GSAP tweens in the `<script>` block
- Swap emoji icons for SVGs or images
- Add background music with an `<audio>` tag + `data-start` / `data-duration`

## Requirements

- Node.js ≥ 22
- FFmpeg (HyperFrames auto-detects or installs)

---

For full docs: https://hyperframes.heygen.com/introduction
