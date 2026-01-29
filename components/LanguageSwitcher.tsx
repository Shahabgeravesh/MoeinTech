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
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-amber-800 border border-amber-300 bg-amber-50/90 hover:bg-amber-100 hover:border-amber-400'
                }`
              : `gap-3 px-6 py-3.5 text-lg font-extrabold rounded-xl min-w-[120px] ${
                  locale === lang.code
                    ? 'bg-amber-500 text-white shadow-lg scale-105'
                    : 'bg-white text-amber-900 border-2 border-amber-300 hover:border-amber-500 hover:bg-amber-50 shadow-sm hover:shadow-md'
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
