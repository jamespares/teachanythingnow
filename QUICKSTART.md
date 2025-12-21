# Quick Start Guide

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## First Test

1. Enter a topic like "Photosynthesis" or "World War II"
2. Click "Generate Educational Content"
3. Wait for generation (may take 30-60 seconds)
4. Download the generated files

## Getting an OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key and add it to `.env.local`

**Note:** You'll need to add payment information to OpenAI to use the API (they have usage-based pricing).

## Troubleshooting

### "OPENAI_API_KEY not set" warning
- Make sure `.env.local` exists in the root directory
- Verify the key is correct (starts with `sk-`)
- Restart the dev server after adding the key

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (requires Node 18+)

### Audio not generating
- Verify OpenAI API key is correct
- Check OpenAI account has credits
- Check browser console for errors

## Next Steps

- See [README.md](./README.md) for full documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions

