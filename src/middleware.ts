import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false
});

export const config = {
  matcher: [
    '/',
    '/(uk|en)/:path*',
    '/((?!_next|_vercel|favicon.png|.*\\..*).*)'
  ]
};