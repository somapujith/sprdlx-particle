import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ParticleLogo from '../components/Canvas/ParticleLogo';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const fromAbout = location.state?.fromAbout || false;
  
  const [soundOn, setSoundOn] = useState(false);
  const [isSolid, setIsSolid] = useState(false);
  const [isBlasting, setIsBlasting] = useState(false);

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsBlasting(true);
    setTimeout(() => {
      navigate('/about');
    }, 1500); // Wait for blast animation to finish
  };

  return (
    <div className="relative w-full h-screen bg-[#dcdcdc] overflow-hidden font-sans text-gray-900">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <ParticleLogo isSolid={isSolid} isBlasting={isBlasting} fromAbout={fromAbout} />
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)' }} />

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-12">
        
        {/* Header */}
        <header className="flex justify-end items-start">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex items-center gap-4 pointer-events-auto text-xs font-medium tracking-widest"
          >
            <button 
              onClick={() => setIsSolid(!isSolid)}
              className="flex items-center gap-2 uppercase"
            >
              <span className={!isSolid ? "opacity-100" : "opacity-40"}>{t('ui.particles')}</span>
              <div className="w-8 h-4 bg-gray-300 rounded-full relative flex items-center px-1">
                <motion.div 
                  className="w-2 h-2 bg-black rounded-full"
                  animate={{ x: isSolid ? 16 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
              <span className={isSolid ? "opacity-100" : "opacity-40"}>{t('ui.solid')}</span>
            </button>
          </motion.div>
        </header>

        {/* Footer */}
        <footer className="flex justify-between items-end">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="pointer-events-auto"
          >
            <button 
              onClick={() => setSoundOn(!soundOn)}
              className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase hover:opacity-70 transition-opacity"
            >
              <span>{soundOn ? t('ui.sound_on') : t('ui.sound_off')}</span>
              {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-6 text-xs font-medium tracking-widest uppercase pointer-events-auto"
          >
            <a href="#" className="hover:opacity-70 transition-opacity">SPRDLX</a>
            <span className="opacity-40">•</span>
            <a href="/about" onClick={handleAboutClick} className="hover:opacity-70 transition-opacity opacity-40">ABOUT</a>
            <span className="opacity-40">•</span>
            <a href="#" className="hover:opacity-70 transition-opacity opacity-40">CONTACT</a>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}
