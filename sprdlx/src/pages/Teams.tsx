import { useEffect } from 'react';
import { useSEO } from '../hooks/useSEO';
import MenuOverlay from '../components/Canvas/MenuOverlay';
import TeamsParallax from './teams/TeamsParallax';
import InteractiveTeamSection from './teams/InteractiveTeamSection';

export default function Teams() {
  useSEO({
    title: 'Teams — SPRDLX',
    description: 'Crftd scroll animation experience.',
    canonical: '/teams',
  });

  useEffect(() => {
    const lenis = (window as any).lenisInstance;
    if (!lenis) return;

    let isJumping = false;

    const handleScroll = ({ scroll }: any) => {
      // Trigger the jump if scrolled more than 5px but still in the first half of the first section
      if (scroll > 5 && scroll < window.innerHeight * 0.1 && !isJumping) {
        isJumping = true;
        lenis.scrollTo(window.innerHeight, {
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => {
            isJumping = false;
          }
        });
      }
    };

    lenis.on('scroll', handleScroll);
    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, []);

  return (
    <main className="w-full bg-black overflow-x-hidden">
      <MenuOverlay />
      
      <section className="h-screen w-full">
        <TeamsParallax />
      </section>

      <section className="h-screen w-full">
        <InteractiveTeamSection />
      </section>
    </main>
  );
}

