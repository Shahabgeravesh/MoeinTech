import { getTranslations, setRequestLocale } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileNavMenu from '@/components/MobileNavMenu';
import InquiryForm from '@/components/InquiryForm';
import TechLogoImage from '@/components/TechLogoImage';
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

// Industry Card Component - handles both video and icon+text formats
function IndustryCard({
  industryKey,
  title,
  description,
  icon,
  videoPath,
  colors,
  colSpan = '',
}: {
  industryKey: string;
  title: string;
  description?: string;
  icon?: JSX.Element;
  videoPath: string | null;
  colors: { bg: string; border: string; hoverBorder: string; hoverText: string; iconGradient: string; iconHoverText: string; iconHoverBorder: string };
  colSpan?: string;
}) {
  // If video exists, render video card
  if (videoPath) {
    return (
      <div className={`group bg-white p-6 md:p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${colSpan || 'lg:col-span-2'}`}>
        {/* Title */}
        <div className="mb-4 md:mb-6 text-center">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-gray-900 transition-colors">
            {title}
          </h3>
        </div>
        
        {/* Video */}
        <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-all duration-300">
          <video
            className="w-full h-auto rounded-xl"
            preload="metadata"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
          >
            <source src={videoPath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    );
  }

  // Otherwise, render icon+text card
  return (
    <div className={`group bg-white p-6 rounded-xl border border-gray-200 ${colors.iconHoverBorder} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      {icon && (
        <div className={`w-14 h-14 mb-4 flex items-center justify-center bg-gradient-to-br ${colors.iconGradient} rounded-xl group-hover:scale-110 transition-transform shadow-lg`}>
          {icon}
        </div>
      )}
      <h3 className={`text-lg font-semibold mb-3 text-gray-900 ${colors.iconHoverText} transition-colors`}>
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

// Tech Logo Component – bold names, main logos/colors, identical EN/FA (dir="ltr")
function TechLogo({ name, color, icon }: { name: string; color: string; icon: string }) {
  return (
    <div className="group flex flex-col items-center justify-center p-5 rounded-xl transition-all duration-300 hover:scale-105 bg-transparent min-w-[160px]" dir="ltr">
      <div className="mb-3 flex items-center justify-center overflow-hidden w-28 h-28">
        <TechIcon icon={icon} name={name} />
      </div>
      <span className="text-base font-bold text-gray-900 group-hover:text-gray-700 transition-colors text-center tracking-tight">{name}</span>
    </div>
  );
}

// App Logo Component – app icons from iTunes (logos only, no names)
function AppLogo({ name, iconUrl }: { name: string; iconUrl: string | null }) {
  return (
    <div className="group flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-300 hover:scale-105 bg-transparent min-w-[120px]">
      <div className="w-24 h-24 flex items-center justify-center rounded-2xl overflow-hidden bg-gray-100">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={name}
            className="w-full h-full object-contain"
            style={{ maxWidth: '96px', maxHeight: '96px' }}
            loading="lazy"
          />
        ) : (
          <span className="text-3xl font-bold text-gray-400">{name.charAt(0)}</span>
        )}
      </div>
    </div>
  );
}

// Tech Icon Component - Using authentic company logos
function TechIcon({ icon, name }: { icon: string; name: string }) {
  // Local overrides (optional) – from public/assets/
  const localLogoMap: Record<string, string> = {
    aws: '/assets/logos/AWS Logo.png',
    microsoft: '/assets/logos/Microsoft.png',
  };
  
  // CDN – main logos and brand colors (identical EN/FA). OpenAI uses jsdelivr (reliable).
  const cdnLogoMap: Record<string, string> = {
    openai: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg',
    claude: 'https://cdn.simpleicons.org/anthropic/D977A6',
    gemini: 'https://cdn.simpleicons.org/googlegemini/4285F4',
    // Use official full-color \"G\" Google logo (PNG so it keeps colors)
    google: 'https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png',
    tensorflow: 'https://cdn.simpleicons.org/tensorflow/FF6F00',
    aws: 'https://cdn.simpleicons.org/amazonaws/FF9900',
    azure: 'https://cdn.simpleicons.org/microsoftazure/0078D4',
    microsoft: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/microsoft.svg',
    gcp: 'https://cdn.simpleicons.org/googlecloud/4285F4',
    vercel: 'https://cdn.simpleicons.org/vercel/000000',
    netlify: 'https://cdn.simpleicons.org/netlify/00C7B7',
    cloudflare: 'https://cdn.simpleicons.org/cloudflare/F38020',
    mongodb: 'https://cdn.simpleicons.org/mongodb/47A248',
    postgresql: 'https://cdn.simpleicons.org/postgresql/336791',
    redis: 'https://cdn.simpleicons.org/redis/DC382D',
    firebase: 'https://cdn.simpleicons.org/firebase/FFCA28',
    supabase: 'https://cdn.simpleicons.org/supabase/3ECF8E',
    react: 'https://cdn.simpleicons.org/react/61DAFB',
    nextjs: 'https://cdn.simpleicons.org/nextdotjs/000000',
    flutter: 'https://cdn.simpleicons.org/flutter/02569B',
    typescript: 'https://cdn.simpleicons.org/typescript/3178C6',
    nodejs: 'https://cdn.simpleicons.org/nodedotjs/339933',
    python: 'https://cdn.simpleicons.org/python/3776AB',
    go: 'https://cdn.simpleicons.org/go/00ADD8',
    docker: 'https://cdn.simpleicons.org/docker/2496ED',
    kubernetes: 'https://cdn.simpleicons.org/kubernetes/326CE5',
    stripe: 'https://cdn.simpleicons.org/stripe/635BFF',
    github: 'https://cdn.simpleicons.org/github/181717',
    gitlab: 'https://cdn.simpleicons.org/gitlab/FC6D26',
    // Use official multicolor Figma logo instead of single-color orange
    figma: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
  };

  // Simple Icons slugs for fallbacks (icon key -> slug). Ensures GCP → googlecloud, etc.
  const iconToSlug: Record<string, string> = {
    openai: 'openai', claude: 'anthropic', gemini: 'googlegemini', google: 'google', tensorflow: 'tensorflow',
    aws: 'amazonaws', azure: 'microsoftazure', microsoft: 'microsoft', gcp: 'googlecloud',
    vercel: 'vercel', netlify: 'netlify', cloudflare: 'cloudflare', mongodb: 'mongodb',
    postgresql: 'postgresql', redis: 'redis', firebase: 'firebase', supabase: 'supabase',
    react: 'react', nextjs: 'nextdotjs', flutter: 'flutter', typescript: 'typescript',
    nodejs: 'nodedotjs', python: 'python', go: 'go', docker: 'docker', kubernetes: 'kubernetes',
    stripe: 'stripe', github: 'github', gitlab: 'gitlab', figma: 'figma',
  };

  const localLogo = localLogoMap[icon];
  const cdnUrl = cdnLogoMap[icon];
  const slug = iconToSlug[icon] ?? icon;
  const jsdelivrUrl = `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${slug}.svg`;
  const unpkgUrl = `https://unpkg.com/simple-icons@v11/icons/${slug}.svg`;
  const simpleiconsUrl = `https://cdn.simpleicons.org/${slug}`;
  // OpenAI: primary = jsdelivr (reliable), fallback = simpleicons (avoids retrying same URL).
  // Microsoft: primary = colored simpleicons (brand blue), fallback = unpkg, then jsdelivr.
  // Others: primary = cdnUrl (simpleicons colored), fallback = jsdelivr (different source for reliability).
  const useJsdelivrFirst = icon === 'openai';
  let primary: string;
  let fallback: string;
  
  if (icon === 'microsoft') {
    // Microsoft: use latest simple-icons from jsdelivr, then unpkg, then colored simpleicons
    primary = localLogo || 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/microsoft.svg';
    fallback = 'https://unpkg.com/simple-icons@latest/icons/microsoft.svg';
  } else {
    primary = localLogo || (useJsdelivrFirst ? jsdelivrUrl : cdnUrl) || jsdelivrUrl;
    fallback = useJsdelivrFirst ? simpleiconsUrl : jsdelivrUrl;
  }

  return (
    <TechLogoImage
      src={primary}
      alt={name}
      fallbackSrc={fallback}
      simpleIconsSlug={slug}
    />
  );

  // Fallback for unknown icons
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
      <span className="text-xs text-gray-500">{name || icon}</span>
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

  // Map industry categories to video paths (if video exists)
  const industryVideos: Record<string, string | null> = {
    entertainment: '/assets/Videos/Entertainment.mp4',
    education: '/assets/Videos/Education.mp4',
    sports: '/assets/Videos/Sports and Fitness.mp4',
    lifestyle: '/assets/Videos/Dating.mp4',
    smallBusiness: '/assets/Videos/Smallbusiness.mp4',
    travel: '/assets/Videos/Travel.mp4',
    foodRestaurant: '/assets/Videos/Food, restaurant.mp4',
    ecommerce: '/assets/Videos/ecommerce.mp4',
  };

  // Color schemes for each industry (for video cards and icon cards)
  const industryColors: Record<string, { 
    bg: string; 
    border: string; 
    hoverBorder: string; 
    hoverText: string;
    iconGradient: string;
    iconHoverText: string;
    iconHoverBorder: string;
  }> = {
    entertainment: {
      bg: 'from-purple-50 via-indigo-50 to-blue-50',
      border: 'border-purple-200',
      hoverBorder: 'hover:border-purple-400',
      hoverText: 'group-hover:text-purple-600',
      iconGradient: 'from-purple-500 to-purple-600',
      iconHoverText: 'group-hover:text-purple-600',
      iconHoverBorder: 'hover:border-purple-500',
    },
    education: {
      bg: 'from-blue-50 via-cyan-50 to-indigo-50',
      border: 'border-blue-200',
      hoverBorder: 'hover:border-blue-400',
      hoverText: 'group-hover:text-blue-600',
      iconGradient: 'from-blue-500 to-blue-600',
      iconHoverText: 'group-hover:text-blue-600',
      iconHoverBorder: 'hover:border-blue-500',
    },
    sports: {
      bg: 'from-purple-50 via-pink-50 to-rose-50',
      border: 'border-purple-200',
      hoverBorder: 'hover:border-purple-400',
      hoverText: 'group-hover:text-purple-600',
      iconGradient: 'from-purple-500 to-purple-600',
      iconHoverText: 'group-hover:text-purple-600',
      iconHoverBorder: 'hover:border-purple-500',
    },
    lifestyle: {
      bg: 'from-pink-50 via-rose-50 to-orange-50',
      border: 'border-pink-200',
      hoverBorder: 'hover:border-pink-400',
      hoverText: 'group-hover:text-pink-600',
      iconGradient: 'from-pink-500 to-pink-600',
      iconHoverText: 'group-hover:text-pink-600',
      iconHoverBorder: 'hover:border-pink-500',
    },
    smallBusiness: {
      bg: 'from-blue-50 via-indigo-50 to-purple-50',
      border: 'border-blue-200',
      hoverBorder: 'hover:border-blue-400',
      hoverText: 'group-hover:text-blue-600',
      iconGradient: 'from-blue-500 to-indigo-600',
      iconHoverText: 'group-hover:text-blue-600',
      iconHoverBorder: 'hover:border-blue-500',
    },
    travel: {
      bg: 'from-cyan-50 via-teal-50 to-emerald-50',
      border: 'border-cyan-200',
      hoverBorder: 'hover:border-cyan-400',
      hoverText: 'group-hover:text-cyan-600',
      iconGradient: 'from-cyan-500 to-teal-600',
      iconHoverText: 'group-hover:text-cyan-600',
      iconHoverBorder: 'hover:border-cyan-500',
    },
    foodRestaurant: {
      bg: 'from-red-50 via-orange-50 to-amber-50',
      border: 'border-red-200',
      hoverBorder: 'hover:border-red-400',
      hoverText: 'group-hover:text-red-600',
      iconGradient: 'from-red-500 to-orange-600',
      iconHoverText: 'group-hover:text-red-600',
      iconHoverBorder: 'hover:border-red-500',
    },
    ecommerce: {
      bg: 'from-orange-50 via-amber-50 to-yellow-50',
      border: 'border-orange-200',
      hoverBorder: 'hover:border-orange-400',
      hoverText: 'group-hover:text-orange-600',
      iconGradient: 'from-orange-500 to-orange-600',
      iconHoverText: 'group-hover:text-orange-600',
      iconHoverBorder: 'hover:border-orange-500',
    },
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link
                href={`/${locale}`}
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight hover:opacity-90 transition-opacity"
              >
                MoeinTech
              </Link>
              <Link
                href={`/${locale}#contact`}
                className="hidden md:inline-flex items-center justify-center ms-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                {t('hero.ctaPrimary')}
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <Link 
                href={`/${locale}#services`} 
                className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {t('nav.services')}
              </Link>
              <Link 
                href={`/${locale}#technologies`} 
                className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {t('nav.technologies')}
              </Link>
              <Link 
                href={`/${locale}#why`} 
                className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {t('nav.why')}
              </Link>
              <Link 
                href={`/${locale}#industries`} 
                className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {t('nav.industries')}
              </Link>
              <Link 
                href={`/${locale}#projects`} 
                className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {t('nav.caseStudies')}
              </Link>
              <Link 
                href={`/${locale}#about`} 
                className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {t('nav.about')}
              </Link>
              <div className="w-px h-6 bg-gray-200 mx-2" aria-hidden="true" />
              <div className="flex items-center gap-2">
                <LanguageSwitcher compact />
              </div>
            </div>
            <div className="flex items-center gap-3 md:hidden">
              <LanguageSwitcher compact />
              <MobileNavMenu />
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
              <div className="inline-flex items-center justify-center group">
                <span className="text-lg md:text-xl font-extrabold tracking-[0.16em] uppercase bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:via-purple-600 transition-all duration-300 drop-shadow-[0_10px_32px_rgba(59,130,246,0.3)]">
                  {t('hero.servicesBadge')}
                </span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-normal md:leading-snug bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent tracking-tight text-center">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto font-medium text-center">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-medium text-center">
                {t('services.subtitle')}
              </p>
            </div>

            {/* Services Grid - 2x2 Layout with 50/50 Image/Text Split */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* App Development */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 overflow-hidden">
                <div className="flex h-full">
                  {/* Image - 50% */}
                  <div className="w-1/2 flex items-center justify-center bg-white p-4 group-hover:scale-105 transition-transform duration-300">
                    <Image 
                      src="/assets/logos/App Dev.jpeg" 
                      alt="App Development" 
                      width={180} 
                      height={180} 
                      className="object-contain rounded-lg w-full h-full"
                    />
                  </div>
                  {/* Text - 50% */}
                  <div className="w-1/2 p-6 flex flex-col justify-center">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                      {t('services.appDevelopment.title')}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {t('services.appDevelopment.description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Web Development */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 overflow-hidden">
                <div className="flex h-full">
                  {/* Image - 50% */}
                  <div className="w-1/2 flex items-center justify-center bg-white p-4 group-hover:scale-105 transition-transform duration-300">
                    <Image 
                      src="/assets/logos/Web Dev.jpeg" 
                      alt="Web Development" 
                      width={180} 
                      height={180} 
                      className="object-contain rounded-lg w-full h-full"
                    />
                  </div>
                  {/* Text - 50% */}
                  <div className="w-1/2 p-6 flex flex-col justify-center">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {t('services.webDevelopment.title')}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {t('services.webDevelopment.description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Solutions */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 overflow-hidden">
                <div className="flex h-full">
                  {/* Image - 50% */}
                  <div className="w-1/2 flex items-center justify-center bg-white p-4 group-hover:scale-105 transition-transform duration-300">
                    <Image 
                      src="/assets/logos/AI.jpg" 
                      alt="AI" 
                      width={180} 
                      height={180} 
                      className="object-contain rounded-lg w-full h-full"
                    />
                  </div>
                  {/* Text - 50% */}
                  <div className="w-1/2 p-6 flex flex-col justify-center">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {t('services.ai.title')}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {t('services.ai.description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Marketing & Consulting */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 overflow-hidden">
                <div className="flex h-full">
                  {/* Image - 50% */}
                  <div className="w-1/2 flex items-center justify-center bg-white p-4 group-hover:scale-105 transition-transform duration-300">
                    <Image 
                      src="/assets/logos/Marketing.jpg" 
                      alt="Marketing" 
                      width={180} 
                      height={180} 
                      className="object-contain rounded-lg w-full h-full"
                    />
                  </div>
                  {/* Text - 50% */}
                  <div className="w-1/2 p-6 flex flex-col justify-center">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">
                      {t('services.marketingConsulting.title')}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {t('services.marketingConsulting.description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Idea Consulting - full-width card on its own row */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 overflow-hidden md:col-span-2">
                <div className="flex h-full">
                  <div className="w-1/3 min-w-[200px] flex items-center justify-center bg-white p-6 group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/assets/logos/Consulting.jpg"
                      alt={t('services.businessIdeaConsulting.title')}
                      width={200}
                      height={200}
                      className="object-contain rounded-lg w-full h-full max-h-48"
                    />
                  </div>
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                      {t('services.businessIdeaConsulting.title')}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed font-medium">
                      {t('services.businessIdeaConsulting.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section - Infinite Scroll (identical EN/FA: same logos, order, scroll) */}
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
            
            {/* Infinite Scrolling Container - always LTR */}
            <div className="relative overflow-hidden w-full" dir="ltr">
              <div className="flex animate-scroll-slow gap-8 items-center" style={{ width: 'max-content' }} dir="ltr">
                {[
                  { name: 'ChatGPT', color: 'green', icon: 'openai' },
                  { name: 'Claude', color: 'purple', icon: 'claude' },
                  { name: 'Google Gemini', color: 'blue', icon: 'google' },
                  { name: 'Amazon', color: 'orange', icon: 'aws' },
                  { name: 'Microsoft', color: 'blue', icon: 'microsoft' },
                  { name: 'Stripe', color: 'purple', icon: 'stripe' },
                  { name: 'GitHub', color: 'black', icon: 'github' },
                  { name: 'Figma', color: 'purple', icon: 'figma' },
                ].map((tech) => (
                  <TechLogo key={`tech-a-${tech.icon}-${tech.name}`} name={tech.name} color={tech.color} icon={tech.icon} />
                ))}

                {/* Duplicate set for seamless loop */}
                {[
                  { name: 'ChatGPT', color: 'green', icon: 'openai' },
                  { name: 'Claude', color: 'purple', icon: 'claude' },
                  { name: 'Google Gemini', color: 'blue', icon: 'google' },
                  { name: 'Amazon', color: 'orange', icon: 'aws' },
                  { name: 'Microsoft', color: 'blue', icon: 'microsoft' },
                  { name: 'Stripe', color: 'purple', icon: 'stripe' },
                  { name: 'GitHub', color: 'black', icon: 'github' },
                  { name: 'Figma', color: 'purple', icon: 'figma' },
                ].map((tech) => (
                  <TechLogo key={`tech-b-${tech.icon}-${tech.name}`} name={tech.name} color={tech.color} icon={tech.icon} />
                ))}
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
              {/* Small Business */}
              <IndustryCard
                industryKey="smallBusiness"
                title={t('industries.smallBusiness.title')}
                description={industryVideos.smallBusiness ? undefined : t('industries.smallBusiness.description')}
                icon={
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
                videoPath={industryVideos.smallBusiness}
                colors={industryColors.smallBusiness}
              />

              {/* E-Commerce */}
              <IndustryCard
                industryKey="ecommerce"
                title={t('industries.ecommerce.title')}
                description={industryVideos.ecommerce ? undefined : t('industries.ecommerce.description')}
                icon={
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                }
                videoPath={industryVideos.ecommerce}
                colors={industryColors.ecommerce}
              />

              {/* Education */}
              <IndustryCard
                industryKey="education"
                title={t('industries.education.title')}
                description={industryVideos.education ? undefined : t('industries.education.description')}
                icon={
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
                videoPath={industryVideos.education}
                colors={industryColors.education}
              />

              {/* Sports & Fitness */}
              <IndustryCard
                industryKey="sports"
                title={t('industries.sports.title')}
                description={industryVideos.sports ? undefined : t('industries.sports.description')}
                icon={
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                }
                videoPath={industryVideos.sports}
                colors={industryColors.sports}
              />

              {/* Lifestyle */}
              <IndustryCard
                industryKey="lifestyle"
                title={t('industries.lifestyle.title')}
                description={industryVideos.lifestyle ? undefined : t('industries.lifestyle.description')}
                icon={
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                }
                videoPath={industryVideos.lifestyle}
                colors={industryColors.lifestyle}
              />

              {/* Entertainment */}
              <IndustryCard
                industryKey="entertainment"
                title={t('industries.entertainment.title')}
                videoPath={industryVideos.entertainment}
                colors={industryColors.entertainment}
              />

              {/* Travel */}
              <IndustryCard
                industryKey="travel"
                title={t('industries.travel.title')}
                videoPath={industryVideos.travel}
                colors={industryColors.travel}
              />

              {/* Food & Restaurant */}
              <IndustryCard
                industryKey="foodRestaurant"
                title={t('industries.foodRestaurant.title')}
                videoPath={industryVideos.foodRestaurant}
                colors={industryColors.foodRestaurant}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Apps We've Built – same format as Technologies (nav: Case Studies / #projects) */}
      <section id="projects" className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900 tracking-tight">
                {t('appsWeBuilt.title')}
              </h2>
              {t('appsWeBuilt.subtitle') && (
                <p className="text-base text-gray-600 max-w-2xl mx-auto">
                  {t('appsWeBuilt.subtitle')}
                </p>
              )}
            </div>
            
            <div className="relative overflow-hidden w-full" dir="ltr">
              <div className="flex animate-scroll-fast gap-8 items-center" style={{ width: 'max-content' }} dir="ltr">
                <AppLogo name={t('projects.courtOfficer.title')} iconUrl={appIcons.courtOfficer} />
                <AppLogo name={t('projects.tennis.title')} iconUrl={appIcons.tennis} />
                <AppLogo name={t('projects.publicSpeaking.title')} iconUrl={appIcons.publicSpeaking} />
                <AppLogo name={t('projects.musicSheet.title')} iconUrl={appIcons.musicSheet} />
                <AppLogo name={t('projects.guardCard.title')} iconUrl={appIcons.guardCard} />
                <AppLogo name={t('projects.dateGenie.title')} iconUrl={appIcons.dateGenie} />
                <AppLogo name={t('projects.asisCpp.title')} iconUrl={appIcons.asisCpp} />
                <AppLogo name={t('projects.quickDraw.title')} iconUrl={appIcons.quickDraw} />
                {/* Duplicate for seamless loop */}
                <AppLogo name={t('projects.courtOfficer.title')} iconUrl={appIcons.courtOfficer} />
                <AppLogo name={t('projects.tennis.title')} iconUrl={appIcons.tennis} />
                <AppLogo name={t('projects.publicSpeaking.title')} iconUrl={appIcons.publicSpeaking} />
                <AppLogo name={t('projects.musicSheet.title')} iconUrl={appIcons.musicSheet} />
                <AppLogo name={t('projects.guardCard.title')} iconUrl={appIcons.guardCard} />
                <AppLogo name={t('projects.dateGenie.title')} iconUrl={appIcons.dateGenie} />
                <AppLogo name={t('projects.asisCpp.title')} iconUrl={appIcons.asisCpp} />
                <AppLogo name={t('projects.quickDraw.title')} iconUrl={appIcons.quickDraw} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-t border-gray-100 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 px-6 py-10 md:px-10 md:py-12">
              <div className="text-center mb-8 md:mb-10">
                <h2 className="text-3xl md:text-4xl font-semibold mb-3 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent tracking-tight">
                  {t('about.title')}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t('about.subtitle')}
                </p>
              </div>
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-gray-600 leading-relaxed mb-10">
                  {t('about.description')}
                </p>
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <div className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                      100+
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wide font-medium">
                      {t('about.successfulProjects')}
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                    <div className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                      {t('about.yearsExperience')}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wide font-medium">
                      {t('about.yearsExperienceLabel')}
                    </div>
                  </div>
                </div>
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
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-10 md:mb-12">
              {/* Brand */}
              <div className="text-center md:text-start">
                <Link
                  href={`/${locale}`}
                  className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
                >
                  MoeinTech
                </Link>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-xs mx-auto md:mx-0">
                  {t('footer.description')}
                </p>
              </div>

              {/* Services links */}
              <div className="text-center md:text-start">
                <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  {t('footer.services')}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link href={`/${locale}#services`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.services')}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${locale}#technologies`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.technologies')}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${locale}#industries`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.industries')}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${locale}#projects`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.caseStudies')}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company links */}
              <div className="text-center md:text-start">
                <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  {t('footer.company')}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link href={`/${locale}#why`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.why')}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${locale}#about`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('footer.about')}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${locale}#contact`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('footer.contact')}
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('footer.privacy')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500 text-center sm:text-start order-2 sm:order-1">
                &copy; {new Date().getFullYear()} MoeinTech. {t('footer.rights')}
              </p>
              <div className="order-1 sm:order-2">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
