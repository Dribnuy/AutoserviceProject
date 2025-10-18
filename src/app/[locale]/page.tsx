import Hero from '../../components/Hero';
import Services from '../../components/Services';
import { locales } from '@/i18n';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
    </main>
  );
}

export function generateStaticParams() {
  return (locales as readonly string[]).map((locale) => ({ locale }));
}