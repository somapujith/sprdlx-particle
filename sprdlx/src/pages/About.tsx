import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EarthquakeParticleHero from '../components/Canvas/EarthquakeParticleHero';

export default function About() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      navigate('/', { state: { fromAbout: true } });
    }, 800);
  };

  return (
    <motion.div
      animate={{ opacity: isExiting ? 0 : 1, filter: isExiting ? 'blur(10px)' : 'blur(0px)' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden"
    >
      {/* Hero — full-bleed WebGL rose (reference layout) */}
      <section
        id="about-hero"
        aria-label="Hero"
        className="relative z-0 flex min-h-screen min-h-[100dvh] h-screen w-full flex-col justify-between overflow-x-hidden overflow-y-visible bg-black"
      >
        <div className="absolute inset-0 z-0">
          <EarthquakeParticleHero />
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between pointer-events-none">
          <header className="flex w-full items-center justify-between p-8 md:p-12 pointer-events-auto">
            <div className="cursor-pointer" onClick={handleHomeClick}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 873 774" className="w-8 h-auto md:w-20" fill="white">
                <path
                  d="M578 587.2c-19.3-19-42.1-41-64.2-63.7-4-4-7-11-7-16.8-.7-32-.4-64-.4-97.3 5-.2 9.1-.5 13.2-.5 27.9-.1 55.8.3 83.6-.3 8.6-.1 14.1 3 20.1 8.7 22 21.2 44.6 41.6 68 63.3l33.5-32.4c13.4-12.9 24.7-30.8 40.6-37.2 16.4-6.6 37.3-2 56.2-2.1 16.2-.2 32.4 0 50 0v55c-.2 17.4 4 36.6-2.2 51.5-6 14.6-22.3 25-34.5 37-12.6 12.4-25.6 24.4-37.8 36.1 22.2 22.9 42.3 44.2 63.3 64.7 8 7.9 11.8 15.7 11.5 27.2-.8 30.5-.3 61-.3 92.5-3.3.4-6.2 1-9.1 1-29.7 0-59.4.3-89.1-.3a25.7 25.7 0 0 1-15.7-7c-19.7-19.2-39-38.7-57.8-58.8-7.8-8.4-12.6-9.4-20.8-.2a1453.3 1453.3 0 0 1-57 59.6 23.5 23.5 0 0 1-14.7 6.4c-30 .5-60.1-.1-90.2.4-9 .1-11-3-11-11.4.5-29.8 0-59.6.5-89.3.1-5 3-11 6.5-14.9 20.7-23.4 42-46.4 64.7-71.2Zm-1.4-204.4V.8c4.5-.3 8.2-.7 12-.7 72 0 144-.2 215.9.3 6.1 0 13.5 3.1 18 7.3A844.6 844.6 0 0 1 866 51.2a21 21 0 0 1 5.4 13c.4 37.4.4 75 0 112.5 0 4.7-2.8 10.3-6 14-12.4 14.8-25.5 29-39.2 44.5 13 14.8 26.2 28.8 38.2 43.8 3.9 4.8 6.8 12 7 18.2.6 28.2.2 56.4.2 86.6-13.4 0-26.6-1.8-39.3.3-32.1 5.3-54.9-6.9-73.7-32.4-11.8-15.9-26.8-29.4-42.6-46.5v77.6H576.7Zm140-273.1v55.1h12.8c0-16-.3-31.4.2-46.7.3-10-4.4-11-13-8.4ZM272.4 1v134.1h-92.2c3.5 4.4 5.2 7 7.4 9.3 26.2 26.3 52.7 52.3 78.5 79a25.8 25.8 0 0 1 6.5 15.9c.7 25.5.5 51 .1 76.5 0 4.2-1.5 9.3-4.1 12.4a1554.2 1554.2 0 0 1-45.4 49.7 18 18 0 0 1-11.6 5.6c-68.5.4-137 .3-205.5.2-1.5 0-3-.4-5-.8V247.3h81.7c-4.2-4.8-6.4-7.7-9-10.2-21.8-22-43.4-44-65.6-65.6a24.2 24.2 0 0 1-7.8-19.4C.7 122.7.3 93.3.8 64c0-4.7 2.5-10.5 5.8-14 14.3-15.1 29-29.8 44.2-44.3 3-2.9 7.9-5.3 12-5.3 67.6-.4 135.3-.4 203-.4 1.9 0 3.7.5 6.5 1ZM.9 408.8H68c43.3 0 86.7-.2 130 .3a26 26 0 0 1 16 6.6c15.4 14.5 35.8 27.5 43.4 45.7 7.7 18.1 2.4 41.8 2.5 63 .1 61.9.2 123.8-.3 185.6 0 6.1-3.2 13.4-7.4 18a582.3 582.3 0 0 1-39.6 39 26 26 0 0 1-16 6.6c-31 0-61.8-1.3-92.7-1.3s-62.6.8-94 1.7c-7.4.2-10-2.2-10-9.9.2-116 .1-232 .2-348 0-2 .3-3.8.7-7.3Zm123.6 260.4c7.5 2.5 11.3 1.3 11.2-7.4-.2-47.2-.2-94.4 0-141.6.1-9.3-3.8-10.2-11.2-7.6v156.6Zm164.9-286.3V.8c3.7-.2 7.4-.8 11-.8C366 0 431.3-.1 496.7.3a27 27 0 0 1 17 7 770.1 770.1 0 0 1 41.6 42c3.3 3.5 5.8 9.3 5.8 14 .4 49.5.4 99 0 148.5a21 21 0 0 1-5.4 13 986.8 986.8 0 0 1-43.4 43.4 23.1 23.1 0 0 1-14.2 5.6c-23.5.5-47.1.2-72 .2v109H289.5ZM425.6 164l3.8 2.8c2.2-2.4 6.1-4.8 6.2-7.2.6-15 .5-30 0-45.1 0-2-3.2-4-5-6-1.6 2-4.7 4-4.8 6-.4 16.5-.2 33-.2 49.5Zm66.5 608.9H275.8V409.7H404v243.4h88v119.8Z"
                />
              </svg>
            </div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex cursor-pointer items-center gap-4 font-serif text-2xl transition-opacity hover:opacity-70 md:text-3xl"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor" />
                <path d="M15.54 8.46A5 5 0 0 1 15.54 15.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Menu</span>
            </motion.div>
          </header>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pointer-events-none absolute right-8 top-1/2 flex -translate-y-1/2 flex-col items-center"
          >
            <div className="z-10 h-3 w-1 rounded-full bg-white" />
            <div className="-mt-1 h-32 w-px bg-white/25" />
          </motion.div>

          {/* Bottom typography — thin sans headline, subtitle right (reference) */}
          <div className="relative w-full flex flex-col items-center px-6 pb-10 pt-8 md:px-12 md:pb-14">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mb-3 w-full max-w-6xl md:mb-4"
            >
              <p className="text-right font-sans text-base font-extralight tracking-wide text-white/90 md:text-2xl">
                Innovation In Every Pixel
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.45 }}
              className="w-full text-center font-sans text-[clamp(1.75rem,8.5vw,6.5rem)] font-extralight leading-[0.95] tracking-[-0.03em] text-white"
            >
              BUILDING YOUR DIGITAL VISION
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Story + services (no duplicate hero headline) */}
      <section
        id="about-data"
        aria-label="About"
        className="relative z-10 border-t border-white/10 bg-black px-8 py-20 md:px-12 md:py-28"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 text-lg font-extralight leading-relaxed md:grid-cols-2 md:text-xl">
          <div>
            <p className="mb-6">
              We are SPRDLX — a Creative Web Studio. Throughout our journey, we&apos;ve had the opportunity to create
              diverse websites and gain valuable experience. This allows us to collaborate with designers, translating
              their creative vision into functional implementations.
            </p>
            <p>We have a deep commitment to transforming concepts into polished, pixel-perfect realities.</p>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest opacity-40">Services</h2>
              <ul className="space-y-2">
                <li>Creative Direction</li>
                <li>3D WebGL Development</li>
                <li>Brand Identity</li>
                <li>Interactive Design</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer
        id="about-footer"
        className="relative z-10 border-t border-white/10 bg-black px-8 py-16 md:px-12 md:py-20"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <span className="font-serif text-2xl tracking-tight">Lewis.</span>
          <p className="text-center text-sm text-white/50 md:text-right">
            © {new Date().getFullYear()} SPRDLX. All rights reserved.
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
