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
                    ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-cyan-500 text-white shadow-[0_0_0_1px_rgba(14,165,233,0.7),0_10px_26px_rgba(8,145,178,0.6)]'
                    : 'text-cyan-700 border border-cyan-200 bg-cyan-50/80 hover:bg-cyan-100 hover:border-cyan-300'
                }`
              : `gap-3 px-6 py-3.5 text-lg font-bold rounded-xl min-w-[120px] ${
                  locale === lang.code
                    ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-cyan-500 text-white shadow-[0_0_0_1px_rgba(14,165,233,0.7),0_18px_38px_rgba(8,145,178,0.65)] scale-105'
                    : 'bg-white text-cyan-900 border-2 border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50 shadow-sm hover:shadow-md'
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
