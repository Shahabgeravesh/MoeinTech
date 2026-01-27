# Deployment Guide

## Important Note About GitHub Pages

**GitHub Pages only serves static files**, but this Next.js application uses:
- Server-side middleware (for locale routing)
- Server components with next-intl
- Dynamic routing

These features **cannot be statically exported** to GitHub Pages.

## Recommended: Deploy to Cloudflare Pages (Free & Optimal)

Cloudflare Pages is an excellent free hosting platform for Next.js applications and offers:
- ✅ Free hosting with generous limits
- ✅ Automatic deployments from GitHub
- ✅ Full support for Next.js server features
- ✅ Global CDN for fast performance worldwide
- ✅ Automatic SSL certificates
- ✅ No authentication required to view the site
- ✅ Zero configuration needed

### Quick Deploy to Cloudflare Pages:

1. **Push your code to GitHub** (already done ✅)

2. **Go to [dash.cloudflare.com](https://dash.cloudflare.com)** and sign in (free account)

3. **Navigate to Pages**:
   - Click "Workers & Pages" in the sidebar
   - Click "Create application"
   - Select "Pages" tab
   - Click "Connect to Git"

4. **Connect your GitHub repository**:
   - Authorize Cloudflare to access your GitHub
   - Select the `MoeinTech` repository
   - Click "Begin setup"

5. **Configure build settings**:
   - **Framework preset**: Next.js (auto-detected)
   - **Build command**: `npm run build` (auto-filled)
   - **Build output directory**: `.next` (auto-filled)
   - **Root directory**: `/` (leave as default)
   - Click "Save and Deploy"

6. **Your site will be live in ~3-5 minutes!**
   - URL format: `https://moeintech.pages.dev` (or custom name you choose)
   - You can add a custom domain later in the Pages settings

### Alternative: Deploy to Vercel (Also Free)

Vercel is also an excellent option:
- ✅ Free hosting
- ✅ Automatic deployments from GitHub
- ✅ Full support for Next.js server features
- ✅ Edge network for fast global performance
- ✅ Automatic SSL certificates

**Quick Deploy to Vercel:**
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Select the `MoeinTech` repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"
6. Your site will be live at `https://moeintech.vercel.app`

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

