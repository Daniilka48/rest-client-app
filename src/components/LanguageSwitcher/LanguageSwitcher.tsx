'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

const LanguageSwitcher: React.FC = () => {
  const pathname = usePathname(); // Get current path (e.g., /en/page-name)
  const router = useRouter();

  const changeLanguage = (lang: string) => {
    // Split pathname into segments
    const segments = pathname.split('/').filter(Boolean); // Remove empty strings
    // Replace existing language prefix with the new one
    if (segments[0] === 'en' || segments[0] === 'ru') {
      segments[0] = lang; // Replace the first segment (current language)
    } else {
      segments.unshift(lang); // Add language prefix if none exists
    }
    // Navigate to the new URL
    const newPathname = '/' + segments.join('/');
    router.push(newPathname);
  };

  return (
    <div>
      <button
        onClick={() => changeLanguage('en')}
        style={{
          marginRight: '8px',
          padding: '5px 10px',
          cursor: 'pointer',
        }}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('ru')}
        style={{
          marginRight: '8px',
          padding: '5px 10px',
          cursor: 'pointer',
        }}
      >
        RU
      </button>
    </div>
  );
};

export default LanguageSwitcher;
