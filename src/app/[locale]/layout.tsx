import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import ClientLayout from '@/components/ClientLayout';
import Script from 'next/script';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <>
      <Script id="set-locale-lang" strategy="beforeInteractive">
        {`document.documentElement.lang = '${locale}';`}
      </Script>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </NextIntlClientProvider>
    </>
  );
}