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
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_0_0_1px_rgba(59,130,246,0.7),0_10px_26px_rgba(79,70,229,0.55)]'
                    : 'text-blue-700 border border-blue-200 bg-blue-50/80 hover:bg-blue-100 hover:border-blue-300'
                }`
              : `gap-3 px-6 py-3.5 text-lg font-bold rounded-xl min-w-[120px] ${
                  locale === lang.code
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_0_0_1px_rgba(59,130,246,0.7),0_18px_38px_rgba(79,70,229,0.6)] scale-105'
                    : 'bg-white text-blue-800 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 shadow-sm hover:shadow-md'
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
