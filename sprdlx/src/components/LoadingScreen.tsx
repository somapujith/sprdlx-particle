import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-white text-neutral-900"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'fadeOut' ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: FADE_MS / 1000, ease: FADE_EASE }}
      style={{ willChange: 'opacity' }}
    >
      {/* Reference: large black circle — bottom-right, partially off-canvas */}
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-[22rem] w-[22rem] rounded-full bg-black md:-bottom-28 md:-right-28 md:h-[26rem] md:w-[26rem]"
        aria-hidden
      />

      <motion.div
        className="relative z-10 flex max-w-[90vw] flex-col items-center px-6 text-center font-serif"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: FADE_EASE }}
      >
        <h1 className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-[clamp(1.25rem,4vw,2.75rem)] leading-tight">
          <span className="font-semibold tracking-tight">SPRDLX</span>
          <span className="select-none font-light text-neutral-300" aria-hidden>
            |
          </span>
          <span className="font-normal text-neutral-500">Creative Studio</span>
          <span className="ml-0.5 font-light text-neutral-800 md:ml-1" aria-hidden>
            ✶
          </span>
        </h1>
      </motion.div>

      <motion.p
        className="font-serif absolute bottom-[clamp(5rem,12vh,8rem)] text-[clamp(1.125rem,2.5vw,1.75rem)] font-light tabular-nums tracking-[0.35em] text-neutral-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.95 }}
        transition={{ delay: 0.15, duration: 0.6, ease: FADE_EASE }}
      >
        {formatSpacedPercent(progress)} %
      </motion.p>
    </motion.div>
  );
}
