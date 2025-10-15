import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import ClientLayout from '@/components/ClientLayout';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  
  // Валідація локалі
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Отримання перекладів
  const messages = await getMessages();


  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ClientLayout>
        {children}
      </ClientLayout>
    </NextIntlClientProvider>
  );
}