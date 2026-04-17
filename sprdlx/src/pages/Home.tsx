import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import SplineHero from '../components/Canvas/SplineHero';
import { AsciiCanvas } from '../components/Canvas/AsciiCanvas';
import { MagneticLink } from '../components/ui/MagneticLink';
import { useTextScramble } from '../hooks/useTextScramble';

export default function Home() {
  useEffect(() => { document.title = 'SPRDLX — Creative Digital Studio'; }, []);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const fromAbout = location.state?.fromAbout || false;

  const [showAscii, setShowAscii] = useState(false);

  const uiRootRef = useRef<HTMLDivElement>(null);
  const heroLineRef = useRef<HTMLParagraphElement>(null);

  useTextScramble(heroLineRef, true);

  const handleAboutClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsBlasting(true);
    (window as any).lenisInstance?.stop();
    setTimeout(() => {
      navigate('/about');
    }, 800);
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
      <AsciiCanvas active={showAscii} />
      <div className="absolute inset-0 z-0 min-h-full min-w-full">
        <SplineHero sceneUrl="https://prod.spline.design/3-lMEnYXiIUpQC2s/scene.splinecode" />
        {/* Film grain (replaces fragile WebGL post-processing stack) */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
      </div>

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
          <div data-home-reveal data-cursor-hover className="pointer-events-auto text-xs font-medium uppercase tracking-widest">
            <a
              href="/about"
              onClick={handleAboutClick}
              className="text-[#888888] transition-opacity hover:opacity-70"
            >
              {t('nav.about')}
            </a>
          </div>

          <div
            data-home-reveal
            data-cursor-hover
            className="pointer-events-auto flex items-center gap-4 text-xs font-medium tracking-widest"
          >
            <button type="button" onClick={() => setShowAscii(!showAscii)} className="flex items-center gap-2 uppercase">
              <span className={!showAscii ? 'opacity-100' : 'opacity-40'}>ASCII</span>
              <div className="relative flex h-4 w-8 items-center rounded-full bg-[#222222] px-1">
                <span
                  className="inline-block h-2 w-2 rounded-full bg-[#f0f0f0] transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(${showAscii ? 16 : 0}px)` }}
                />
              </div>
              <span className={showAscii ? 'opacity-100' : 'opacity-40'}>NORMAL</span>
            </button>
            <span className="opacity-40">•</span>
          </div>
        </header>

        <div
          data-home-reveal
          className="pointer-events-none absolute left-6 top-1/2 max-w-[min(22rem,42vw)] -translate-y-1/2 md:left-12"
        >
          <p
            ref={heroLineRef}
            className="text-[10px] font-medium uppercase leading-relaxed tracking-[0.28em] text-[#888888] md:text-xs cursor-pointer"
          >
            {t('hero.line1')}
            <span className="mx-2 inline-block opacity-40">/</span>
            <span className="block pt-2 text-[10px] tracking-[0.35em] text-[#888888] opacity-80 md:inline md:pt-0">
              {t('hero.line2')}
            </span>
          </p>
        </div>

        <footer className="relative mt-auto flex flex-col gap-8">
          <nav
            data-home-reveal
            className="pointer-events-auto absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-6 text-xs font-medium uppercase tracking-widest"
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
              onClick={handleAboutClick}
              className="text-[#888888] hover:opacity-80"
            >
              ABOUT
            </MagneticLink>
            <span className="select-none opacity-40">•</span>
            <MagneticLink
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-[#888888] opacity-70 hover:opacity-80"
            >
              CONTACT
            </MagneticLink>
          </nav>
        </footer>
      </div>
    </div>
  );
}
