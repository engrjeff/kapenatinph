import { FeaturesSection } from '~/components/features-section';
import { HeroSection } from '~/components/hero-section';

export function meta() {
  return [
    { title: 'Kape Natin PH' },
    { name: 'description', content: 'Simple Coffee Shop Management system.' },
  ];
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  );
}
