'use client';

import { useRouter } from 'next/router';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { pathname, query, asPath, locale } = router;

  const changeLanguage = (newLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')} disabled={locale === 'en'}>
        English
      </button>
      <button onClick={() => changeLanguage('ru')} disabled={locale === 'ru'}>
        Русский
      </button>
    </div>
  );
}
