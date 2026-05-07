import { useEffect } from 'react';
import { useSEO } from '../hooks/useSEO';
import MenuOverlay from '../components/Canvas/MenuOverlay';
import TeamsParallax from './teams/TeamsParallax';
import InteractiveTeamSection from './teams/InteractiveTeamSection';
import FaultyTerminal from '../components/FaultyTerminal/FaultyTerminal';

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
    <main className="w-full bg-black overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FaultyTerminal
          scale={2.4}
          gridMul={[2, 1]}
          digitSize={1.9}
          timeScale={1}
          pause={false}
          scanlineIntensity={1}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.2}
          tint="#f3f7a8"
          mouseReact={true}
          mouseStrength={0.5}
          pageLoadAnimation={false}
          brightness={1}
        />
      </div>
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

