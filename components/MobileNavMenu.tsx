'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

const navKeys = ['services', 'technologies', 'why', 'industries', 'caseStudies', 'about'] as const;

export default function MobileNavMenu() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations('nav');

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20"
            style={{ top: '4rem' }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-xl overflow-y-auto max-h-[calc(100vh-4rem)]" style={{ top: '4rem' }}>
            <div className="container mx-auto px-4 py-6 space-y-1">
              {navKeys.map((key) => (
                <Link
                  key={key}
                  href={`/${locale}#${key === 'caseStudies' ? 'projects' : key}`}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {t(key)}
                </Link>
              ))}
              <div className="pt-4 pb-2">
                <LanguageSwitcher />
              </div>
              <Link
                href={`/${locale}#contact`}
                onClick={() => setOpen(false)}
                className="block w-full text-center px-4 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-lg shadow-md hover:shadow-lg transition-all mt-4"
              >
                {t('getStarted')}
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
