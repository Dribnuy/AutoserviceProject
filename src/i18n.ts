import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'uk'] as const;
export const defaultLocale = 'uk' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  const selectedLocale = (locale && locales.includes(locale as any)) ? locale : defaultLocale;
  
  
  const messages = (await import(`./messages/${selectedLocale}.json`)).default;
  
  
  return {
    locale: selectedLocale,
    messages: {
      common: messages
    }
  };
});