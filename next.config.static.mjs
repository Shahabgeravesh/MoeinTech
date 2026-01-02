// Alternative config for static export (if needed)
// Note: This requires removing middleware for static export to work
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/MoeinTech',
  trailingSlash: true,
};

export default withNextIntl(nextConfig);

