import { getTranslations, setRequestLocale } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';
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

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/${locale}`} className="text-lg font-semibold text-gray-800 tracking-tight">
              MoeinTech
            </Link>
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                href={`/${locale}#services`} 
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t('nav.services')}
              </Link>
              <Link 
                href={`/${locale}#about`} 
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t('nav.about')}
              </Link>
              <Link 
                href={`/${locale}#contact`} 
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t('nav.contact')}
              </Link>
              <div className="mx-2">
                <LanguageSwitcher />
              </div>
              <Link
                href={`/${locale}#contact`}
                className="ml-2 px-4 py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 transition-colors rounded-md"
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
            <span className="inline-block px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded-full border border-gray-200">
              {locale === 'fa' ? 'پیشرو در فناوری' : 'Leading in Technology'}
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold mb-6 leading-tight text-gray-800 tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 mb-12 leading-relaxed max-w-2xl">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/${locale}#services`}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 transition-colors rounded-md"
            >
              {t('hero.ctaPrimary')}
            </Link>
            <Link
              href={`/${locale}#contact`}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 transition-colors rounded-md"
            >
              {t('hero.ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="border-t border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-800 tracking-tight">
                {t('services.title')}
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl">
                {t('services.subtitle')}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* App Development */}
              <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 mb-6 flex items-center justify-center bg-gray-100 rounded-md">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  {t('services.appDevelopment.title')}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t('services.appDevelopment.description')}
                </p>
              </div>

              {/* SEO & Marketing */}
              <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 mb-6 flex items-center justify-center bg-gray-100 rounded-md">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  {t('services.seoMarketing.title')}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t('services.seoMarketing.description')}
                </p>
              </div>

              {/* AI Capabilities */}
              <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 mb-6 flex items-center justify-center bg-gray-100 rounded-md">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  {t('services.ai.title')}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t('services.ai.description')}
                </p>
              </div>

              {/* Business Consulting */}
              <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 mb-6 flex items-center justify-center bg-gray-100 rounded-md">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  {t('services.consulting.title')}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
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
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-800 tracking-tight">
                {t('about.title')}
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl">
                {t('about.subtitle')}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <div className="w-16 h-16 mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-semibold text-gray-700">DM</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  {t('about.drMoeen.title')}
                </h3>
                <p className="text-sm text-gray-500 font-medium mb-6">
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
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-3xl font-semibold text-gray-700 mb-1">100+</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">{locale === 'fa' ? 'پروژه موفق' : 'Successful Projects'}</div>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-3xl font-semibold text-gray-700 mb-1">10+</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">{locale === 'fa' ? 'سال تجربه' : 'Years Experience'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-800 tracking-tight">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <Link
              href={`/${locale}#contact`}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 transition-colors rounded-md"
            >
              {t('cta.button')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-lg font-semibold text-gray-800 mb-4">MoeinTech</div>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t('footer.description')}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">{t('footer.company')}</h4>
              <ul className="space-y-2">
                <li>
                  <Link href={`/${locale}#about`} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    {t('footer.about')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}#services`} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    {t('footer.services')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}#contact`} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    {t('footer.contact')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">{t('footer.resources')}</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    {t('footer.blog')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    {t('footer.support')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">{t('footer.connect')}</h4>
              <div className="flex space-x-3">
                <a href="#" className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:border-gray-400 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:border-gray-400 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
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
