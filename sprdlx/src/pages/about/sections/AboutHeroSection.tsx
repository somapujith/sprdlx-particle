import { Suspense, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import WaterRipple from '../../../components/canvas/WaterRipple';

gsap.registerPlugin(useGSAP);

export default function AboutHeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.fromTo(
        '.about-hero-ripple',
        { opacity: 0, scale: 1.03 },
        { opacity: 1, scale: 1, duration: 1.1 }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about-hero"
      aria-label="Hero"
      className="relative z-0 flex min-h-dvh h-screen w-full flex-col justify-between overflow-hidden bg-[color:var(--color-bg)]"
    >
      <Suspense fallback={null}>
        <div className="about-hero-ripple h-full w-full">
          <WaterRipple />
        </div>
      </Suspense>
    </section>
  );
}
