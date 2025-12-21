# Deployment Guide for teachanythingnow.com

## Prerequisites

1. **OpenAI API Key**: Sign up at [OpenAI](https://platform.openai.com) and get an API key
2. **GitHub Account**: For version control and deployment
3. **Vercel Account**: Free tier works perfectly for this project

## Step-by-Step Deployment

### 1. Prepare Your Code

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key

# Test locally
npm run dev
```

### 2. Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/teachanythingnow.git
git push -u origin main
```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 4. Add Environment Variables

In Vercel project settings:
1. Go to "Settings" → "Environment Variables"
2. Add:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key
   - **Environment**: Production, Preview, Development (select all)

### 5. Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be live at `your-project.vercel.app`

### 6. Configure Custom Domain (teachanythingnow.com)

1. In Vercel project, go to "Settings" → "Domains"
2. Add `teachanythingnow.com`
3. Add `www.teachanythingnow.com` (optional)
4. Follow DNS configuration instructions:
   - Add a CNAME record pointing to `cname.vercel-dns.com`
   - Or add an A record (Vercel will provide IP addresses)

### 7. SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt. No action needed.

## Post-Deployment Checklist

- [ ] Test content generation with a sample topic
- [ ] Verify all file downloads work
- [ ] Check that OpenAI API is working (audio generation)
- [ ] Test on mobile devices
- [ ] Monitor Vercel analytics for errors

## Environment Variables

Required:
- `OPENAI_API_KEY`: Your OpenAI API key for content generation and TTS

Optional (for future enhancements):
- `NODE_ENV`: Set to `production` in Vercel (automatic)

## Troubleshooting

### Audio not generating
- Check that `OPENAI_API_KEY` is set correctly
- Verify OpenAI account has credits
- Check Vercel function logs for errors

### Files not downloading
- Check that `temp/` directory has write permissions
- Verify file paths in download API route
- Check Vercel function logs

### Build failures
- Ensure all dependencies are in `package.json`
- Check TypeScript errors: `npm run build`
- Verify Node.js version compatibility (Vercel uses Node 18+)

## Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth/month
- **OpenAI API**: Pay-per-use pricing
  - GPT-4: ~$0.03 per request (content generation)
  - TTS-1: ~$0.015 per 1000 characters (audio generation)
- **Estimated cost**: ~$0.05-0.10 per complete content generation

## Scaling Considerations

For high traffic:
1. Implement rate limiting
2. Add caching for common topics
3. Consider using Vercel Pro plan
4. Implement queue system for generation requests
5. Add database for storing generated content

## Monitoring

- Use Vercel Analytics (built-in)
- Set up error tracking (Sentry recommended)
- Monitor OpenAI API usage
- Track generation times and success rates

