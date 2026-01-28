'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fa', name: 'فارسی' }
  ];

  const switchLanguage = (newLocale: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className={`flex items-center ${compact ? 'gap-1.5' : 'gap-3'}`}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchLanguage(lang.code)}
          className={`flex items-center justify-center transition-all duration-200 rounded-lg ${
            compact
              ? `gap-1.5 px-2.5 py-2 text-sm font-semibold min-w-0 ${
                  locale === lang.code
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-200'
                }`
              : `gap-3 px-6 py-3.5 text-lg font-bold rounded-xl min-w-[120px] ${
                  locale === lang.code
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-400 shadow-sm hover:shadow-md'
                }`
          }`}
          aria-label={`Switch to ${lang.name}`}
        >
          <span className="whitespace-nowrap">{lang.name}</span>
        </button>
      ))}
    </div>
  );
}
