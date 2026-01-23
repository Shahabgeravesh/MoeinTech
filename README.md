# MoeinTech - Professional Technology Solutions Website

A professional, bilingual (English/Farsi) business website built with Next.js 14, TypeScript, Tailwind CSS, and next-intl. The website showcases MoeinTech's services including app development, SEO & marketing, AI capabilities, and business consulting, under the leadership of Dr. Moein.

## Features

- 🌍 **Bilingual Support**: Fully localized in English and Farsi (Persian) with RTL support
- ⚡ **Next.js 14**: Built with the latest App Router for optimal performance
- 🎨 **Modern Design**: Beautiful, professional UI with gradient accents and smooth animations
- 📱 **Fully Responsive**: Optimized for all devices and screen sizes
- 🔍 **SEO Optimized**: Comprehensive SEO with meta tags, structured data, sitemap, and robots.txt
- 🚀 **Performance**: Optimized for speed and Core Web Vitals
- ♿ **Accessible**: Built with accessibility best practices
- 🌐 **Internationalization**: Powered by next-intl for seamless language switching

## Services

1. **App & Website Development**: Custom mobile applications and responsive websites
2. **SEO & Marketing**: Strategic digital marketing and SEO optimization
3. **AI Capabilities**: Artificial intelligence and machine learning solutions
4. **Business Consulting**: Expert technology consulting services

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone git@github.com:Shahabgeravesh/MoeinTech.git
cd MoeinTech
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

The website will automatically redirect to `/en` (English) or you can manually navigate to `/fa` for Farsi.

## Project Structure

```
MoeinTech/
├── app/
│   ├── [locale]/           # Locale-specific pages
│   │   ├── layout.tsx      # Locale layout with SEO
│   │   └── page.tsx        # Homepage
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── robots.ts           # Robots.txt generator
│   └── sitemap.ts          # Sitemap generator
├── components/
│   └── LanguageSwitcher.tsx # Language switcher component
├── messages/
│   ├── en.json             # English translations
│   └── fa.json             # Farsi translations
├── i18n.ts                 # i18n configuration
├── middleware.ts           # Next.js middleware for locale routing
└── next.config.mjs         # Next.js configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## SEO Features

- Comprehensive meta tags (title, description, keywords)
- Open Graph tags for social media
- Twitter Card support
- Structured data (JSON-LD) for Organization schema
- XML sitemap generation
- Robots.txt configuration
- Canonical URLs
- Language alternates (hreflang)

## Customization

### Adding/Editing Translations

Edit the JSON files in the `messages/` directory:
- `messages/en.json` - English translations
- `messages/fa.json` - Farsi translations

### Styling

The project uses Tailwind CSS. Modify `tailwind.config.ts` to customize the design system.

### SEO Configuration

Update SEO metadata in:
- `app/[locale]/layout.tsx` - Global SEO settings
- `app/[locale]/page.tsx` - Page-specific metadata

## Deployment

The website is ready to deploy on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- Any Node.js hosting platform

Make sure to set up environment variables if needed and configure your domain's DNS settings.

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Calendly URL for scheduling calls (optional)
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-username/meeting

# Formspree endpoint for contact form submissions
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

**Note**: If `NEXT_PUBLIC_CALENDLY_URL` is not set, the "Schedule a Call" button will fall back to the contact form.

## Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **next-intl** - Internationalization
- **React** - UI library

## License

Copyright © 2025 MoeinTech. All rights reserved.

## Contact

For inquiries, please visit the website and use the contact form.
