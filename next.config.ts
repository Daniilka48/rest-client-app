import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
  },
};

export default nextConfig;
