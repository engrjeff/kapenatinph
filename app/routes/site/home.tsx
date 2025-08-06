import { FeaturesSection } from '~/components/features-section';
import { HeroSection } from '~/components/hero-section';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
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
