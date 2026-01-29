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
              ? `gap-1.5 px-2.5 py-2 text-sm font-extrabold min-w-0 ${
                  locale === lang.code
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-sky-800 border border-sky-300 bg-sky-50/80 hover:bg-sky-100 hover:border-sky-400'
                }`
              : `gap-3 px-6 py-3.5 text-lg font-extrabold rounded-xl min-w-[120px] ${
                  locale === lang.code
                    ? 'bg-sky-600 text-white shadow-lg scale-105'
                    : 'bg-white text-sky-900 border-2 border-sky-300 hover:border-sky-500 hover:bg-sky-50 shadow-sm hover:shadow-md'
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
