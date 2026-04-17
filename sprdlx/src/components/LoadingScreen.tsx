import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import sprdlxTextLogo from '../../sprdlx.svg';

/** Lewis-style spaced digits: e.g. 71 → "0 7 1", 100 → "1 0 0" */
function formatSpacedPercent(progress: number): string {
  if (progress < 10) return `0 0 ${progress}`;
  if (progress < 100) return `0 ${progress.toString().split('').join(' ')}`;
  return '1 0 0';
}

const FADE_MS = 1150;
const FADE_EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'fadeOut'>('loading');
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    const duration = 3200;
    const interval = 30;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setPhase('fadeOut');
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (phase !== 'fadeOut') return;
    const id = window.setTimeout(() => completeRef.current(), FADE_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] text-[#f0f0f0]"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'fadeOut' ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: FADE_MS / 1000, ease: FADE_EASE }}
      style={{ willChange: 'opacity' }}
    >


      <motion.div
        className="relative z-10 flex max-w-[90vw] flex-col items-center px-6 text-center font-serif"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: FADE_EASE }}
      >
        <h1 className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 gap-y-2 text-[clamp(1.25rem,4vw,2.75rem)] leading-tight">
          <img src={sprdlxTextLogo} alt="SPRDLX" className="h-10 md:h-16 lg:h-20 w-auto object-contain brightness-0 invert" />
          <span className="select-none font-light text-[#444444]" aria-hidden>
            |
          </span>
          <span className="font-normal text-[#888888]">AI Venture Studio</span>
          <span className="ml-0.5 font-light text-[#f0f0f0] md:ml-1" aria-hidden>
            ✶
          </span>
        </h1>
      </motion.div>

      <motion.p
        className="font-sf absolute bottom-[clamp(5rem,12vh,8rem)] text-[clamp(1.125rem,2.5vw,1.75rem)] font-extralight tabular-nums tracking-[0.35em] text-[#888888]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.95 }}
        transition={{ delay: 0.15, duration: 0.6, ease: FADE_EASE }}
      >
        {formatSpacedPercent(progress)} %
      </motion.p>
    </motion.div>
  );
}
