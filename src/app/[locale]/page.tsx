import WhyChooseUs from "@/components/WhyChooseUs";
import Hero from "../../components/Hero";

import Services from "../../components/Services";

import { locales } from "@/i18n";
import HowItWorks from "@/components/HowItWorks";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhyChooseUs />
      <HowItWorks />
      <Services />
    </main>
  );
}

export function generateStaticParams() {
  return (locales as readonly string[]).map((locale) => ({ locale }));
}
