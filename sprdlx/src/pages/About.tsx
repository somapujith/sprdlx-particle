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
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="relative min-h-screen bg-black text-white font-sans overflow-hidden"
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <ParticleHands />
      </div>

      {/* Hero Section - Exactly matching the reference */}
      <div className="relative z-10 h-screen w-full flex flex-col justify-between pointer-events-none">
        
        {/* Header */}
        <header className="flex justify-between items-center p-8 md:p-12 pointer-events-auto w-full">
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
            className="flex items-center gap-4 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor"/>
              <path d="M15.54 8.46A5 5 0 0 1 15.54 15.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="font-serif text-2xl">Menu</span>
          </motion.div>
        </header>

        {/* Left Badge (Awwwards style) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white text-black flex flex-col items-center py-4 px-2 pointer-events-auto cursor-pointer"
        >
          <span className="font-bold text-xl mb-6">W.</span>
          <span className="text-[10px] font-medium tracking-widest uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Honors</span>
        </motion.div>

        {/* Right Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0"
        >
          <div className="w-1 h-3 bg-white rounded-full z-10"></div>
          <div className="w-[1px] h-24 bg-white/20 -mt-1"></div>
        </motion.div>

        {/* Bottom Content */}
        <div className="w-full flex flex-col items-center relative pb-8 md:pb-12 px-8 md:px-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="w-full flex justify-end mb-2 md:mb-4"
          >
            <p className="text-lg md:text-2xl font-sans font-light tracking-wide text-gray-300">Innovation In Every Pixel</p>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-[10vw] font-serif font-light tracking-tighter leading-none whitespace-nowrap w-full text-center"
          >
            BUILDING YOUR DIGITAL VISION
          </motion.h1>
          
          {/* Bottom White Circle */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-white rounded-full pointer-events-auto cursor-pointer"
          />
        </div>
      </div>

      {/* Scrollable Content Below Fold */}
      <div className="relative z-10 bg-black min-h-screen p-8 md:p-12 pt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg md:text-xl leading-relaxed font-light max-w-6xl mx-auto">
          <div>
            <p className="mb-6">
              We are SPRDLX — a Creative Web Studio. Throughout our journey, we've had the opportunity to create diverse websites and gain valuable experience. This allows us to collaborate with designers, translating their creative vision into functional implementations.
            </p>
            <p>
              We have a deep commitment to transforming concepts into polished, pixel-perfect realities.
            </p>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold tracking-widest uppercase mb-4 opacity-40">Services</h3>
              <ul className="space-y-2">
                <li>Creative Direction</li>
                <li>3D WebGL Development</li>
                <li>Brand Identity</li>
                <li>Interactive Design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
