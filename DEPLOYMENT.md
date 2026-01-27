# Deployment Guide

## Important Note About GitHub Pages

**GitHub Pages only serves static files**, but this Next.js application uses:
- Server-side middleware (for locale routing)
- Server components with next-intl
- Dynamic routing

These features **cannot be statically exported** to GitHub Pages.

## Recommended: Deploy to Vercel (Free & Optimal)

Vercel is the recommended platform for Next.js applications and offers:
- ✅ Free hosting
- ✅ Automatic deployments from GitHub
- ✅ Full support for Next.js server features
- ✅ Edge network for fast global performance
- ✅ Automatic SSL certificates
- ✅ Zero configuration needed

### Quick Deploy to Vercel:

1. **Push your code to GitHub** (already done ✅)

2. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

3. **Import your repository**:
   - Click "Add New Project"
   - Select the `MoeinTech` repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

4. **Your site will be live in ~2 minutes!**
   - URL format: `https://moeintech.vercel.app`
   - You can add a custom domain later

## Alternative: GitHub Pages (Requires Code Changes)

If you must use GitHub Pages, you would need to:

1. Remove middleware (`middleware.ts`)
2. Convert to static export
3. Use client-side routing only
4. Refactor next-intl implementation

This would significantly change the architecture. **We recommend using Vercel instead.**

## Current Deployment Status

The repository is set up with:
- ✅ GitHub Actions workflow (`.github/workflows/deploy.yml`)
- ✅ Proper git structure
- ✅ All code committed and pushed

**Next Step**: Deploy to Vercel for the best experience!

