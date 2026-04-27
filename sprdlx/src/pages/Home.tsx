import { useLayoutEffect, useRef, Suspense } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { useLazyLoad3D } from '../hooks/useLazyLoad3D';
import { MagneticLink } from '../components/ui/MagneticLink';
import SplineHero from '../components/Canvas/SplineHero';

const HOME_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'SPRDLX',
  description: 'Creative digital studio crafting immersive web experiences, design systems, and intelligent applications for high-growth startups.',
  url: 'https://sprdlx.co',
  email: 'hello@sprdlx.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    addressCountry: 'IN',
  },
  serviceType: ['Web Design', 'UI/UX Design', 'Design Systems', 'Frontend Development', 'Brand Identity'],
  priceRange: '$$',
};

export default function Home() {
  useSEO({
    title: 'SPRDLX — Creative Digital Studio | Immersive Web Experiences',
    description: 'SPRDLX is a creative digital studio crafting immersive web experiences, design systems, and intelligent applications. Trusted by Y Combinator, Sequoia, and Techstars-backed startups.',
    canonical: '/',
    schema: HOME_SCHEMA,
  });
  const navigate = useNavigate();
  const splineRef = useRef<HTMLDivElement>(null);
  const uiRootRef = useRef<HTMLDivElement>(null);

  const handleNavigation = (path: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    (window as any).lenisInstance?.stop();
    setTimeout(() => {
      navigate(path);
    }, 600);
  };


  useLayoutEffect(() => {
    const root = uiRootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-home-reveal]'));
      if (!sections.length) return;

      gsap.from(sections, {
        y: 20,
        autoAlpha: 0,
        duration: 0.88,
        stagger: 0.09,
        ease: 'power3.out',
        delay: 0.06,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative h-screen min-h-screen w-full overflow-hidden bg-[#0a0a0a] font-sans text-[#f0f0f0] pointer-coarse:cursor-auto">
      <div ref={splineRef} className="absolute inset-0 z-0 min-h-full min-w-full">
        <Suspense fallback={<div className="absolute inset-0 bg-[#0a0a0a]" />}>
          <SplineHero sceneUrl="/spline/themuseum.splinecode" />
        </Suspense>
      </div>

      {/* Film grain (replaces fragile WebGL post-processing stack) */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      <div
        ref={uiRootRef}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-12"
      >
        <header className="flex items-start justify-between gap-6">
        </header>

        <footer className="relative mt-auto flex flex-col gap-8">
          <nav
            data-home-reveal
            className="pointer-events-auto flex justify-center gap-6 text-xs font-medium uppercase tracking-widest"
          >
            <MagneticLink
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-[#f0f0f0] hover:opacity-80"
            >
              SPRDLX
            </MagneticLink>
            <span className="select-none opacity-40">•</span>
            <MagneticLink
              href="/about"
              onClick={handleNavigation('/about')}
              className="text-[#888888] hover:opacity-80"
            >
              ABOUT
            </MagneticLink>
            <span className="select-none opacity-40">•</span>
            <MagneticLink
              href="/projects"
              onClick={handleNavigation('/projects')}
              className="text-[#888888] hover:opacity-80"
            >
              PROJECTS
            </MagneticLink>
            <span className="select-none opacity-40">•</span>
            <MagneticLink
              href="/contact"
              onClick={handleNavigation('/contact')}
              className="text-[#888888] hover:opacity-80"
            >
              CONTACT
            </MagneticLink>
          </nav>
        </footer>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-40 bg-black transition-opacity duration-600 ease-in-out"
        style={{ opacity: 0 }}
        aria-hidden
      />
    </div>
  );
}
