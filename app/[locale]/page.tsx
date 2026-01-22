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
                href={`/${locale}#about`} 
                className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                {t('nav.about')}
              </Link>
              <Link 
                href={`/${locale}#projects`} 
                className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                {t('nav.projects')}
              </Link>
              <Link 
                href={`/${locale}#contact`} 
                className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                {t('nav.contact')}
              </Link>
              <div className="mx-2">
                <LanguageSwitcher />
              </div>
              <Link
                href={`/${locale}#contact`}
                className="ml-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all rounded-md shadow-sm"
              >
                {t('nav.getStarted')}
              </Link>
            </div>
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full border border-blue-100">
              {locale === 'fa' ? 'پیشرو در فناوری' : 'Leading in Technology'}
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold mb-6 leading-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-2xl">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/${locale}#services`}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all rounded-md shadow-md hover:shadow-lg"
            >
              {t('hero.ctaPrimary')}
            </Link>
            <Link
              href={`/${locale}#contact`}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 transition-all rounded-md"
            >
              {t('hero.ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="border-t border-gray-100 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                {t('services.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                {t('services.subtitle')}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* App Development */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 mb-6 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {t('services.appDevelopment.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('services.appDevelopment.description')}
                </p>
              </div>

              {/* SEO & Marketing */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 mb-6 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">
                  {t('services.seoMarketing.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('services.seoMarketing.description')}
                </p>
              </div>

              {/* AI Capabilities */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 mb-6 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {t('services.ai.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('services.ai.description')}
                </p>
              </div>

              {/* Business Consulting */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 mb-6 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {t('services.consulting.title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('services.consulting.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
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

      {/* Projects Section */}
      <section id="projects" className="border-t border-gray-100 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                {t('projects.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                {t('projects.subtitle')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Court Officer Flashcards App */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group">
                <div className="w-full h-48 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                  {appIcons.courtOfficer ? (
                    <Image 
                      src={appIcons.courtOfficer} 
                      alt="Court Officer Flashcards App"
                      width={192}
                      height={192}
                      className="rounded-2xl shadow-lg"
                    />
                  ) : (
                    <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                  Court Officer Flashcards App
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  A comprehensive study companion for the NY Court Officer exam. Features interactive flashcards, memory & recall practice, reading comprehension, grammar assessments, and situational judgment scenarios.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded">React Native</span>
                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded">Android & iOS</span>
                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded">Education</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <a 
                    href="https://apps.apple.com/us/app/court-officer-flashcards-app/id6744664594" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    {t('projects.viewProject')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Tennis Score Keeper */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group">
                <div className="w-full h-48 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                  {appIcons.tennis ? (
                    <Image 
                      src={appIcons.tennis} 
                      alt="Tennis Score Keeper"
                      width={192}
                      height={192}
                      className="rounded-2xl shadow-lg"
                    />
                  ) : (
                    <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
                  Tennis Score Keeper
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Track tennis matches with sets, games, and points. Features tiebreak support, match history, court mode, and automatic scoring. Perfect for players, coaches, and fans.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded">React Native</span>
                  <span className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded">Android & iOS</span>
                  <span className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded">Sports</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <a 
                    href="https://apps.apple.com/us/app/tennis-score-keeper/id6754825833" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                  >
                    {t('projects.viewProject')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Public Speaking Academy */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all group">
                <div className="w-full h-48 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                  {appIcons.publicSpeaking ? (
                    <Image 
                      src={appIcons.publicSpeaking} 
                      alt="Public Speaking Academy"
                      width={192}
                      height={192}
                      className="rounded-2xl shadow-lg"
                    />
                  ) : (
                    <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
                  Public Speaking Academy
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Master public speaking through 12 comprehensive modules and 180+ expert-crafted cards. Learn voice mechanics, breathing techniques, storytelling, and confident communication.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded">React Native</span>
                  <span className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded">Android & iOS</span>
                  <span className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded">Education</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <a 
                    href="https://apps.apple.com/us/app/public-speaking-academy/id6755028699" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                  >
                    {t('projects.viewProject')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Music Sheet Learn */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all group">
                <div className="w-full h-48 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                  {appIcons.musicSheet ? (
                    <Image 
                      src={appIcons.musicSheet} 
                      alt="Music Sheet Learn"
                      width={192}
                      height={192}
                      className="rounded-2xl shadow-lg"
                    />
                  ) : (
                    <svg className="w-16 h-16 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-emerald-600 transition-colors">
                  Music Sheet Learn
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Master reading music notation! Learn treble and bass clefs with interactive lessons, visual guides, and piano keyboard connections. Perfect for beginners and musicians.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 rounded">React Native</span>
                  <span className="px-2 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 rounded">Android & iOS</span>
                  <span className="px-2 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 rounded">Education</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <a 
                    href="https://apps.apple.com/us/app/music-sheet-learn/id6754809246" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                  >
                    {t('projects.viewProject')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Guard Card California */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all group">
                <div className="w-full h-48 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                  {appIcons.guardCard ? (
                    <Image 
                      src={appIcons.guardCard} 
                      alt="Guard Card California"
                      width={192}
                      height={192}
                      className="rounded-2xl shadow-lg"
                    />
                  ) : (
                    <svg className="w-16 h-16 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-orange-600 transition-colors">
                  Guard Card California
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Complete guide for California security guard certification. Find training centers, LiveScan locations, study materials, practice quizzes, and official BSIS resources.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-50 rounded">React Native</span>
                  <span className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-50 rounded">Android & iOS</span>
                  <span className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-50 rounded">Education</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <a 
                    href="https://apps.apple.com/us/app/guard-card-california/id6751480977" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                  >
                    {t('projects.viewProject')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* DateGenie */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all group">
                <div className="w-full h-48 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                  {appIcons.dateGenie ? (
                    <Image 
                      src={appIcons.dateGenie} 
                      alt="DateGenie"
                      width={192}
                      height={192}
                      className="rounded-2xl shadow-lg"
                    />
                  ) : (
                    <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-red-600 transition-colors">
                  DateGenie
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Discover 72 curated date ideas with scratch-off surprises. Browse by romantic, adventurous, budget-friendly, or luxury experiences. Perfect for couples planning unforgettable moments.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded">React Native</span>
                  <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded">Android & iOS</span>
                  <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded">Lifestyle</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <a 
                    href="https://apps.apple.com/us/app/dategenie/id6749169858" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    {t('projects.viewProject')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* ASIS CPP Exam Prep & Flashcard */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-yellow-300 hover:shadow-lg transition-all group">
                <div className="w-full h-48 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                  {appIcons.asisCpp ? (
                    <Image 
                      src={appIcons.asisCpp} 
                      alt="ASIS CPP Exam Prep & Flashcard"
                      width={192}
                      height={192}
                      className="rounded-2xl shadow-lg"
                    />
                  ) : (
                    <svg className="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-yellow-600 transition-colors">
                  ASIS CPP Exam Prep & Flashcard
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Master the ASIS CPP exam with 1,000+ flashcards aligned with exam topics. Organized by chapters covering Security Principles, Risk Management, Legal, and Investigations. Track progress and focus on weak areas.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 text-xs font-medium text-yellow-600 bg-yellow-50 rounded">React Native</span>
                  <span className="px-2 py-1 text-xs font-medium text-yellow-600 bg-yellow-50 rounded">Android & iOS</span>
                  <span className="px-2 py-1 text-xs font-medium text-yellow-600 bg-yellow-50 rounded">Education</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <a 
                    href="https://apps.apple.com/us/app/asis-cpp-exam-prep-flashcard/id6741053163" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1"
                  >
                    {t('projects.viewProject')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Draw */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-cyan-300 hover:shadow-lg transition-all group">
                <div className="w-full h-48 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                  {appIcons.quickDraw ? (
                    <Image 
                      src={appIcons.quickDraw} 
                      alt="Quick Draw"
                      width={192}
                      height={192}
                      className="rounded-2xl shadow-lg"
                    />
                  ) : (
                    <svg className="w-16 h-16 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-cyan-600 transition-colors">
                  Quick Draw :)
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Draw fast, guess faster. A quick party game for everyone. Quick Draw is a fast, fun drawing-and-guessing party game. Draw a word, let friends guess, and rotate turns across multiple rounds. Great for quick matches and friendly competition.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 text-xs font-medium text-cyan-600 bg-cyan-50 rounded">React Native</span>
                  <span className="px-2 py-1 text-xs font-medium text-cyan-600 bg-cyan-50 rounded">iPad</span>
                  <span className="px-2 py-1 text-xs font-medium text-cyan-600 bg-cyan-50 rounded">Board Game</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <a 
                    href="https://apps.apple.com/us/app/quick-draw/id6757971448" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
                  >
                    {t('projects.viewProject')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Inquiry Form Section */}
      <section id="contact" className="border-t border-gray-100 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-white tracking-tight">
                {t('cta.title')}
              </h2>
              <p className="text-lg text-blue-50 mb-10 max-w-xl mx-auto">
                {t('cta.subtitle')}
              </p>
            </div>
            <InquiryForm />
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
                  <Link href={`/${locale}#about`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    {t('footer.about')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}#services`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    {t('footer.services')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}#contact`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    {t('footer.contact')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">{t('footer.resources')}</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    {t('footer.blog')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    {t('footer.support')}
                  </a>
                </li>
              </ul>
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
