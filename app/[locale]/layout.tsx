import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '../globals.css';

export const metadata: Metadata = {
  title: {
    default: 'MoeinTech - Leading Technology Solutions | App Development, SEO, AI & Consulting',
    template: '%s | MoeinTech'
  },
  description: 'MoeinTech offers cutting-edge technology solutions including app development, website development, SEO & marketing, AI capabilities, and business consulting. Led by Dr. Moein.',
  keywords: ['technology solutions', 'app development', 'website development', 'SEO', 'digital marketing', 'AI', 'artificial intelligence', 'business consulting', 'MoeinTech', 'Dr. Moein'],
  authors: [{ name: 'MoeinTech' }],
  creator: 'MoeinTech',
  publisher: 'MoeinTech',
  metadataBase: new URL('https://moeintech.com'),
  icons: {
    icon: [
      { url: '/assets/logos/Favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/assets/logos/Favicon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/assets/logos/Favicon.png', sizes: '180x180', type: 'image/png' }],
  },
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'fa': '/fa'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'fa_IR',
    siteName: 'MoeinTech',
    title: 'MoeinTech - Leading Technology Solutions',
    description: 'Transform your business with cutting-edge technology solutions. App development, SEO, AI capabilities, and business consulting.',
    url: 'https://moeintech.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoeinTech - Leading Technology Solutions',
    description: 'Transform your business with cutting-edge technology solutions.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="https://moeintech.com/assets/logos/Favicon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="https://moeintech.com/assets/logos/Favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://moeintech.com/assets/logos/Favicon.png" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'MoeinTech',
              url: 'https://moeintech.com',
              logo: 'https://moeintech.com/assets/logos/Favicon.png',
              description: 'Leading technology solutions including app development, SEO, AI capabilities, and business consulting.',
              founder: {
                '@type': 'Person',
                name: 'Dr. Moein',
                jobTitle: 'Founder & Technology Leader'
              },
              sameAs: [
                // Add your social media links here
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                availableLanguage: ['en', 'fa']
              }
            })
          }}
        />
      </body>
    </html>
  );
}

