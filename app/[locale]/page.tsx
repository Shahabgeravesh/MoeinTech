import { getTranslations, setRequestLocale } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import InquiryForm from '@/components/InquiryForm';
import Link from 'next/link';
import Image from 'next/image';
import { locales } from '@/i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return {
    title: t('hero.title'),
    description: t('hero.subtitle'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'fa': '/fa'
      }
    }
  };
}

// Helper function to get app icon from iTunes API
async function getAppIcon(appId: string): Promise<string | null> {
  try {
    const response = await fetch(`https://itunes.apple.com/lookup?id=${appId}&country=us`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].artworkUrl512 || data.results[0].artworkUrl100 || null;
    }
  } catch (error) {
    console.error(`Failed to fetch icon for app ${appId}:`, error);
  }
  return null;
}

// Tech Logo Component
function TechLogo({ name, color, icon }: { name: string; color: string; icon: string }) {
  const getColorClasses = (col: string) => {
    switch(col) {
      case 'green': return 'hover:border-green-500 hover:text-green-600 bg-gradient-to-br from-green-400 to-emerald-600';
      case 'purple': return 'hover:border-purple-500 hover:text-purple-600 bg-gradient-to-br from-purple-400 to-purple-600';
      case 'blue': return 'hover:border-blue-500 hover:text-blue-600 bg-gradient-to-br from-blue-400 to-blue-600';
      case 'orange': return 'hover:border-orange-500 hover:text-orange-600 bg-gradient-to-br from-orange-400 to-orange-600';
      case 'red': return 'hover:border-red-500 hover:text-red-600 bg-gradient-to-br from-red-400 to-red-600';
      case 'yellow': return 'hover:border-yellow-500 hover:text-yellow-600 bg-gradient-to-br from-yellow-400 to-yellow-600';
      case 'black': return 'hover:border-gray-800 hover:text-gray-800 bg-gradient-to-br from-gray-700 to-gray-900';
      case 'teal': return 'hover:border-teal-500 hover:text-teal-600 bg-gradient-to-br from-teal-400 to-teal-600';
      default: return 'hover:border-blue-500 hover:text-blue-600 bg-gradient-to-br from-blue-400 to-blue-600';
    }
  };

  const bgClass = getColorClasses(color);

  return (
    <div className="group flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white min-w-[140px]">
      <div className="w-16 h-16 mb-3 flex items-center justify-center relative">
        <div className={`absolute inset-0 ${bgClass} rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
        <TechIcon icon={icon} />
      </div>
      <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors text-center">{name}</span>
    </div>
  );
}

// Tech Icon Component
function TechIcon({ icon }: { icon: string }) {
  const icons: Record<string, JSX.Element> = {
    openai: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-1.103l-2.53 1.176a3.996 3.996 0 0 1-1.336 1.336l-1.177 2.53a5.985 5.985 0 0 0 1.103.515l2.53-1.177a3.996 3.996 0 0 1 1.336-1.336l1.177-2.53a5.985 5.985 0 0 0 .515-1.103l-2.53-1.177a3.996 3.996 0 0 1-1.336-1.336l-1.177-2.53a5.985 5.985 0 0 0-1.103-.515l2.53 1.177a3.996 3.996 0 0 1 1.336 1.336l1.177 2.53a5.985 5.985 0 0 0 .515 1.103l-2.53 1.177a3.996 3.996 0 0 1-1.336 1.336l-1.177 2.53z" fill="#10A37F"/>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#10A37F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    claude: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#D977A6"/>
        <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" fill="white"/>
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4" stroke="white" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
    gemini: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#4285F4"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="3" fill="#34A853"/>
        <path d="M12 9v6M9 12h6" stroke="white" strokeWidth="1.5"/>
      </svg>
    ),
    huggingface: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#FFD21E"/>
      </svg>
    ),
    tensorflow: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.603l-6.168 3.564.015-5.31zm21.43 5.311l-1.966-1.13-6.168 3.574v11.923l4.095-2.382V11.16l4.04-2.334v2.341zm-10.91-7.19l-4.096 2.37v4.71l4.096-2.37V3.977z" fill="#FF6F00"/>
      </svg>
    ),
    pytorch: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#EE4C2C"/>
        <path d="M12 6v6l4 2" stroke="#EE4C2C" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    aws: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.808 8.823l-1.076-.344a.19.19 0 0 1-.134-.23l.323-1.03a.19.19 0 0 1 .23-.135l1.077.344a.19.19 0 0 1 .134.23l-.323 1.03a.19.19 0 0 1-.23.135z" fill="#FF9900"/>
        <path d="M12.5 2.5L22 8l-9.5 5.5L3 8l9.5-5.5z" fill="#FF9900"/>
        <path d="M3 16l9.5 5.5L22 16l-9.5-5.5L3 16z" fill="#232F3E"/>
      </svg>
    ),
    azure: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 2.5L21 7l-7.5 4.5L6 7l7.5-4.5z" fill="#0078D4"/>
        <path d="M3 12.5v7L10.5 22v-7L3 12.5z" fill="#0078D4"/>
        <path d="M21 12.5v7L13.5 22v-7L21 12.5z" fill="#0078D4"/>
      </svg>
    ),
    gcp: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.405 3.74L9.53 6.615l2.875 2.875 2.875-2.875-2.875-2.875z" fill="#4285F4"/>
        <path d="M6.615 9.53L3.74 12.405l2.875 2.875 2.875-2.875-2.875-2.875z" fill="#34A853"/>
        <path d="M17.385 9.53l-2.875 2.875 2.875 2.875 2.875-2.875-2.875-2.875z" fill="#FBBC04"/>
        <path d="M12.405 20.26l2.875-2.875-2.875-2.875-2.875 2.875 2.875 2.875z" fill="#EA4335"/>
      </svg>
    ),
    vercel: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 22h20L12 2z" fill="#000000"/>
      </svg>
    ),
    netlify: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#00C7B7"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00C7B7" strokeWidth="1.5"/>
      </svg>
    ),
    cloudflare: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.5 10.5c-1.1 0-2.1.5-2.8 1.3l-1.2-1.2c1-1.1 2.4-1.8 4-1.8 2.8 0 5 2.2 5 5s-2.2 5-5 5H5c-2.2 0-4-1.8-4-4s1.8-4 4-4c.3 0 .6.1.9.1l1.1-1.1C6.4 8.2 5.7 8 5 8c-2.2 0-4 1.8-4 4s1.8 4 4 4h13.5c1.9 0 3.5-1.6 3.5-3.5s-1.6-3.5-3.5-3.5z" fill="#F38020"/>
      </svg>
    ),
    mongodb: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#47A248"/>
      </svg>
    ),
    postgresql: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#336791"/>
        <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2"/>
      </svg>
    ),
    redis: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#DC382D"/>
        <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2"/>
      </svg>
    ),
    firebase: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771-6.002 10.613zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0l7.926-4.428zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 16.984z" fill="#FFCA28"/>
      </svg>
    ),
    supabase: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#3ECF8E"/>
        <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2"/>
      </svg>
    ),
    react: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="2" fill="#61DAFB"/>
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" strokeWidth="1" fill="none"/>
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" strokeWidth="1" fill="none" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" strokeWidth="1" fill="none" transform="rotate(-60 12 12)"/>
      </svg>
    ),
    nextjs: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#000000"/>
        <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    flutter: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.314 0L2.3 12 6 15.7 21.684 0zm-8.628 22.14L6 18.84l8.686-8.686L18.314 12z" fill="#02569B"/>
      </svg>
    ),
    typescript: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#3178C6"/>
        <path d="M8 8h8v2h-3v6h-2v-6H8V8zm9 0h2v8h-2v-2h-2v2h-2V8h2v2h2V8z" fill="white"/>
      </svg>
    ),
    nodejs: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#339933"/>
        <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2"/>
      </svg>
    ),
    python: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#3776AB"/>
        <path d="M12 6v12M6 12h12" stroke="#FFD43B" strokeWidth="2"/>
      </svg>
    ),
    go: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#00ADD8"/>
        <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2"/>
      </svg>
    ),
    docker: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.983 10.848h2.119l-1.892-4.202-2.12 4.202h1.893zm-5.183 0h2.12L9.83 6.646l-2.12 4.202h2.12zm-5.184 0h2.12L4.647 6.646 2.527 10.848h2.12zm15.55 0h2.118l-1.891-4.202-2.119 4.202h1.892z" fill="#2496ED"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#2496ED"/>
      </svg>
    ),
    kubernetes: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#326CE5"/>
        <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2"/>
      </svg>
    ),
    stripe: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#635BFF"/>
        <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2"/>
      </svg>
    ),
    github: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.84c.85.004 1.7.115 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48C19.14 20.17 22 16.42 22 12c0-5.52-4.48-10-10-10z" fill="#181717"/>
      </svg>
    ),
    gitlab: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#FC6D26"/>
        <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2"/>
      </svg>
    ),
    figma: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#F24E1E"/>
        <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2"/>
      </svg>
    ),
  };

  return icons[icon] || (
    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
      <span className="text-xs text-gray-500">{icon}</span>
    </div>
  );
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // Fetch app icons from iTunes API
  const appIcons = {
    courtOfficer: await getAppIcon('6744664594'),
    tennis: await getAppIcon('6754825833'),
    publicSpeaking: await getAppIcon('6755028699'),
    musicSheet: await getAppIcon('6754809246'),
    guardCard: await getAppIcon('6751480977'),
    dateGenie: await getAppIcon('6749169858'),
    asisCpp: await getAppIcon('6741053163'),
    quickDraw: await getAppIcon('6757971448'),
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/${locale}`} className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              MoeinTech
            </Link>
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                href={`/${locale}#services`} 
                className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                {t('nav.services')}
              </Link>
              <Link 
                href={`/${locale}#industries`} 
                className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                {t('nav.industries')}
              </Link>
              <Link 
                href={`/${locale}#projects`} 
                className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                {t('nav.caseStudies')}
              </Link>
              <Link 
                href={`/${locale}#about`} 
                className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                {t('nav.about')}
              </Link>
              <div className="mx-2">
                <LanguageSwitcher />
              </div>
              <Link
                href={`/${locale}#contact`}
                className="ml-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all rounded-lg shadow-md hover:shadow-lg"
              >
                {t('hero.ctaPrimary')}
              </Link>
            </div>
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 text-center">
              <div className={`inline-flex items-center gap-3 md:gap-5 px-8 md:px-10 py-4 md:py-5 bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group overflow-hidden relative ${locale === 'fa' ? 'font-[Tahoma, Arial, sans-serif]' : ''}`}>
                {/* Subtle animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {locale === 'fa' ? (
                  <span className="relative text-sm md:text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 via-purple-600 to-orange-600 to-emerald-600 bg-clip-text text-transparent">
                    {t('hero.servicesBadge')}
                  </span>
                ) : (
                  <>
                    <span className="relative text-sm md:text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300">
                      Mobile
                    </span>
                    <span className="text-gray-300 font-light text-base">/</span>
                    <span className="relative text-sm md:text-base font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:to-indigo-600 transition-all duration-300">
                      Web
                    </span>
                    <span className="text-gray-300 font-light text-base">/</span>
                    <span className="relative text-sm md:text-base font-semibold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-purple-600 transition-all duration-300">
                      Marketing
                    </span>
                    <span className="text-gray-300 font-light text-base">/</span>
                    <span className="relative text-sm md:text-base font-semibold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:to-orange-600 transition-all duration-300">
                      AI
                    </span>
                    <span className="text-gray-300 font-light text-base">/</span>
                    <span className="relative text-sm md:text-base font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:to-emerald-600 transition-all duration-300">
                      Consulting
                    </span>
                  </>
                )}
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-12 leading-relaxed max-w-3xl font-medium">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}#contact`}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transform duration-300"
              >
                {t('hero.ctaPrimary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="border-t border-gray-100 bg-gradient-to-b from-white via-blue-50/20 to-indigo-50/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 text-center">
              {t('services.title') && (
                <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent tracking-tight">
                  {t('services.title')}
                </h2>
              )}
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-medium">
                {t('services.subtitle')}
              </p>
            </div>

            {/* Services Grid - Uniform Layout */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* App Development */}
              <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1">
                <div className="w-14 h-14 mb-4 flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {t('services.appDevelopment.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {t('services.appDevelopment.description')}
                </p>
              </div>

              {/* Web Development */}
              <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1">
                <div className="w-14 h-14 mb-4 flex items-center justify-center bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {t('services.webDevelopment.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {t('services.webDevelopment.description')}
                </p>
              </div>

              {/* Marketing */}
              <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1">
                <div className="w-14 h-14 mb-4 flex items-center justify-center bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">
                  {t('services.marketing.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {t('services.marketing.description')}
                </p>
              </div>

              {/* Business Consulting */}
              <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1">
                <div className="w-14 h-14 mb-4 flex items-center justify-center bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {t('services.consulting.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {t('services.consulting.description')}
                </p>
              </div>

              {/* AI Solutions */}
              <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 md:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 mb-4 flex items-center justify-center bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-orange-600 transition-colors">
                  {t('services.ai.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {t('services.ai.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section - Infinite Scroll */}
      <section id="technologies" className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900 tracking-tight">
                {t('technologies.title')}
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                {t('technologies.subtitle')}
              </p>
            </div>
            
            {/* Infinite Scrolling Container */}
            <div className="relative overflow-hidden">
              <div className="flex">
                {/* First set of logos */}
                <div className="flex animate-scroll gap-8 items-center flex-shrink-0">
                  {/* AI Platforms */}
                  <TechLogo name="OpenAI" color="green" icon="openai" />
                  <TechLogo name="Claude" color="purple" icon="claude" />
                  <TechLogo name="Gemini" color="blue" icon="gemini" />
                  <TechLogo name="Hugging Face" color="yellow" icon="huggingface" />
                  <TechLogo name="TensorFlow" color="orange" icon="tensorflow" />
                  <TechLogo name="PyTorch" color="red" icon="pytorch" />
                  
                  {/* Cloud Platforms */}
                  <TechLogo name="AWS" color="orange" icon="aws" />
                  <TechLogo name="Azure" color="blue" icon="azure" />
                  <TechLogo name="GCP" color="blue" icon="gcp" />
                  <TechLogo name="Vercel" color="black" icon="vercel" />
                  <TechLogo name="Netlify" color="teal" icon="netlify" />
                  <TechLogo name="Cloudflare" color="orange" icon="cloudflare" />
                  
                  {/* Databases */}
                  <TechLogo name="MongoDB" color="green" icon="mongodb" />
                  <TechLogo name="PostgreSQL" color="blue" icon="postgresql" />
                  <TechLogo name="Redis" color="red" icon="redis" />
                  <TechLogo name="Firebase" color="orange" icon="firebase" />
                  <TechLogo name="Supabase" color="green" icon="supabase" />
                  
                  {/* Frontend */}
                  <TechLogo name="React" color="blue" icon="react" />
                  <TechLogo name="Next.js" color="black" icon="nextjs" />
                  <TechLogo name="React Native" color="blue" icon="react" />
                  <TechLogo name="Flutter" color="blue" icon="flutter" />
                  <TechLogo name="TypeScript" color="blue" icon="typescript" />
                  
                  {/* Backend */}
                  <TechLogo name="Node.js" color="green" icon="nodejs" />
                  <TechLogo name="Python" color="yellow" icon="python" />
                  <TechLogo name="Go" color="blue" icon="go" />
                  <TechLogo name="Docker" color="blue" icon="docker" />
                  <TechLogo name="Kubernetes" color="blue" icon="kubernetes" />
                  
                  {/* Tools & Services */}
                  <TechLogo name="Stripe" color="purple" icon="stripe" />
                  <TechLogo name="GitHub" color="black" icon="github" />
                  <TechLogo name="GitLab" color="orange" icon="gitlab" />
                  <TechLogo name="Figma" color="purple" icon="figma" />
                </div>
                
                {/* Duplicate set for seamless loop */}
                <div className="flex animate-scroll gap-8 items-center flex-shrink-0" aria-hidden="true">
                  {/* AI Platforms */}
                  <TechLogo name="OpenAI" color="green" icon="openai" />
                  <TechLogo name="Claude" color="purple" icon="claude" />
                  <TechLogo name="Gemini" color="blue" icon="gemini" />
                  <TechLogo name="Hugging Face" color="yellow" icon="huggingface" />
                  <TechLogo name="TensorFlow" color="orange" icon="tensorflow" />
                  <TechLogo name="PyTorch" color="red" icon="pytorch" />
                  
                  {/* Cloud Platforms */}
                  <TechLogo name="AWS" color="orange" icon="aws" />
                  <TechLogo name="Azure" color="blue" icon="azure" />
                  <TechLogo name="GCP" color="blue" icon="gcp" />
                  <TechLogo name="Vercel" color="black" icon="vercel" />
                  <TechLogo name="Netlify" color="teal" icon="netlify" />
                  <TechLogo name="Cloudflare" color="orange" icon="cloudflare" />
                  
                  {/* Databases */}
                  <TechLogo name="MongoDB" color="green" icon="mongodb" />
                  <TechLogo name="PostgreSQL" color="blue" icon="postgresql" />
                  <TechLogo name="Redis" color="red" icon="redis" />
                  <TechLogo name="Firebase" color="orange" icon="firebase" />
                  <TechLogo name="Supabase" color="green" icon="supabase" />
                  
                  {/* Frontend */}
                  <TechLogo name="React" color="blue" icon="react" />
                  <TechLogo name="Next.js" color="black" icon="nextjs" />
                  <TechLogo name="React Native" color="blue" icon="react" />
                  <TechLogo name="Flutter" color="blue" icon="flutter" />
                  <TechLogo name="TypeScript" color="blue" icon="typescript" />
                  
                  {/* Backend */}
                  <TechLogo name="Node.js" color="green" icon="nodejs" />
                  <TechLogo name="Python" color="yellow" icon="python" />
                  <TechLogo name="Go" color="blue" icon="go" />
                  <TechLogo name="Docker" color="blue" icon="docker" />
                  <TechLogo name="Kubernetes" color="blue" icon="kubernetes" />
                  
                  {/* Tools & Services */}
                  <TechLogo name="Stripe" color="purple" icon="stripe" />
                  <TechLogo name="GitHub" color="black" icon="github" />
                  <TechLogo name="GitLab" color="orange" icon="gitlab" />
                  <TechLogo name="Figma" color="purple" icon="figma" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why MoeinTech Section */}
      <section id="why" className="border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent tracking-tight">
                {t('why.title')}
              </h2>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center font-medium">
                {t('why.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-gray-900 tracking-tight">
                {t('industries.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('industries.subtitle')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Education */}
              <div className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 mb-4 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {t('industries.education.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('industries.education.description')}
                </p>
              </div>

              {/* Sports & Fitness */}
              <div className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 mb-4 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">
                  {t('industries.sports.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('industries.sports.description')}
                </p>
              </div>

              {/* Lifestyle */}
              <div className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-pink-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 mb-4 flex items-center justify-center bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-pink-600 transition-colors">
                  {t('industries.lifestyle.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('industries.lifestyle.description')}
                </p>
              </div>

              {/* Healthcare */}
              <div className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 mb-4 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-green-600 transition-colors">
                  {t('industries.healthcare.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('industries.healthcare.description')}
                </p>
              </div>

              {/* Finance */}
              <div className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 mb-4 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {t('industries.finance.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('industries.finance.description')}
                </p>
              </div>

              {/* Entertainment */}
              <div className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-red-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 mb-4 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-red-600 transition-colors">
                  {t('industries.entertainment.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('industries.entertainment.description')}
                </p>
              </div>

              {/* Productivity */}
              <div className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 mb-4 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {t('industries.productivity.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('industries.productivity.description')}
                </p>
              </div>

              {/* E-Commerce */}
              <div className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 mb-4 flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-orange-600 transition-colors">
                  {t('industries.ecommerce.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('industries.ecommerce.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                {t('about.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                {t('about.subtitle')}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-semibold text-white">DM</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">
                  {t('about.drMoeen.title')}
                </h3>
                <p className="text-sm text-blue-600 font-medium mb-6">
                  {t('about.drMoeen.role')}
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t('about.drMoeen.bio')}
                </p>
              </div>
              <div>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {t('about.description')}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="text-3xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">100+</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">{locale === 'fa' ? 'پروژه موفق' : 'Successful Projects'}</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                    <div className="text-3xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">10+</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">{locale === 'fa' ? 'سال تجربه' : 'Years Experience'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="projects" className="border-t border-gray-100 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-gray-900 tracking-tight">
                {t('projects.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('projects.subtitle')}
              </p>
            </div>
            
            <div className="flex justify-center items-center min-h-[200px]">
              {/* Placeholder for future case studies */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                <p className="text-gray-500">Case studies coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Inquiry Form Section */}
      <section id="contact" className="relative border-t border-gray-100 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-tight drop-shadow-lg">
                {t('cta.title')}
              </h2>
              <p className="text-lg md:text-xl text-blue-50 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
                {t('cta.subtitle')}
              </p>
            </div>
            
            <div className="mt-12" id="inquiry-form">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">MoeinTech</div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('footer.description')}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">{t('footer.company')}</h4>
              <ul className="space-y-2">
                <li>
                  <Link href={`/${locale}#services`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    {t('footer.services')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}#projects`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    {t('footer.caseStudies')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}#about`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    {t('footer.about')}
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    {t('footer.blog')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    {t('footer.privacy')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">{t('footer.newsletter')}</h4>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder={locale === 'fa' ? 'ایمیل شما' : 'Your email'}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
                  {t('footer.subscribe')}
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">{t('footer.connect')}</h4>
              <div className="flex space-x-3">
                <a href="#" className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <svg className="w-4 h-4 text-gray-600 hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <svg className="w-4 h-4 text-gray-600 hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 text-center">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} MoeinTech. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
