import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ParticleHands from '../components/Canvas/ParticleHands';

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
      {/* 1 — Hero: Three.js / R3F particle scene */}
      <section
        id="about-hero"
        aria-label="Hero"
        className="relative z-0 flex min-h-screen h-screen w-full flex-col justify-between overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <ParticleHands />
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between pointer-events-none">
          <header className="flex w-full items-center justify-between p-8 md:p-12 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="cursor-pointer"
              onClick={handleHomeClick}
            >
              <span className="font-serif text-3xl tracking-tight">Lewis.</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex cursor-pointer items-center gap-4 transition-opacity hover:opacity-70"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor" />
                <path d="M15.54 8.46A5 5 0 0 1 15.54 15.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="font-serif text-2xl">Menu</span>
            </motion.div>
          </header>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pointer-events-auto absolute left-0 top-1/2 flex -translate-y-1/2 cursor-pointer flex-col items-center bg-white py-4 px-2 text-black"
          >
            <span className="mb-6 text-xl font-bold">W.</span>
            <span
              className="text-[10px] font-medium uppercase tracking-widest"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Honors
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pointer-events-none absolute right-8 top-1/2 flex -translate-y-1/2 flex-col items-center gap-0"
          >
            <div className="z-10 h-3 w-1 rounded-full bg-white" />
            <div className="-mt-1 h-24 w-px bg-white/20" />
          </motion.div>

          <div className="flex flex-1 flex-col items-center justify-center px-8 pb-16 pt-8 md:px-12" />
        </div>
      </section>

      {/* 2 — Heading */}
      <section
        id="about-heading"
        aria-label="Heading"
        className="relative z-10 border-t border-white/10 bg-black px-8 py-20 md:px-12 md:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1 }}
            className="mb-4 flex w-full justify-end md:mb-6"
          >
            <p className="font-sans text-lg font-light tracking-wide text-gray-300 md:text-2xl">
              Innovation In Every Pixel
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, delay: 0.1 }}
            className="w-full text-center font-serif text-[10vw] font-light leading-none tracking-tighter"
          >
            BUILDING YOUR DIGITAL VISION
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mx-auto mt-12 h-32 w-32 cursor-pointer rounded-full bg-white md:mt-16"
          />
        </div>
      </section>

      {/* 3 — Data */}
      <section
        id="about-data"
        aria-label="Data"
        className="relative z-10 border-t border-white/10 bg-black px-8 py-20 md:px-12 md:py-24"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 text-lg font-light leading-relaxed md:grid-cols-2 md:text-xl">
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

      {/* 4 — Footer */}
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
