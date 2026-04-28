import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import sprdlxTextLogo from '../../../sprdlx.svg';

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
  const [showSkipHint, setShowSkipHint] = useState(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    const MIN_LOAD_TIME = 3000;
    const startTime = Date.now();

    const preloadAssets = async () => {
      const assets = [
        '/spline/themuseum.splinecode',
      ];

      let loaded = 0;
      const updateProgress = (current: number) => {
        setProgress(current);
      };

      const preloadAsset = (src: string) => {
        return new Promise((resolve) => {
          fetch(src, { method: 'HEAD' })
            .then(() => {
              loaded++;
              resolve(null);
            })
            .catch(() => {
              loaded++;
              resolve(null);
            });
        });
      };

      await Promise.all(assets.map((asset) => preloadAsset(asset)));

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOAD_TIME - elapsedTime);

      const progressInterval = setInterval(() => {
        const now = Date.now();
        const timeLeft = Math.max(0, MIN_LOAD_TIME - (now - startTime));
        const newProgress = Math.round(((MIN_LOAD_TIME - timeLeft) / MIN_LOAD_TIME) * 100);
        updateProgress(Math.min(newProgress, 99));
      }, 50);

      await new Promise((r) => setTimeout(r, remainingTime));
      clearInterval(progressInterval);

      setProgress(100);
      await new Promise((r) => setTimeout(r, 300));
      setPhase('fadeOut');
    };

    preloadAssets();
  }, []);

  useEffect(() => {
    if (phase !== 'fadeOut') return;
    const id = window.setTimeout(() => completeRef.current(), FADE_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    let skipEnabled = false;
    const enableTimer = setTimeout(() => {
      skipEnabled = true;
      setShowSkipHint(true);
    }, 2000);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && skipEnabled && phase === 'loading') {
        setProgress(100);
        setPhase('fadeOut');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      clearTimeout(enableTimer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [phase]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] text-[#f0f0f0]"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'fadeOut' ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: FADE_MS / 1000, ease: FADE_EASE }}
      style={{ willChange: 'opacity' }}
    >


      <motion.div
        className="relative z-10 flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: FADE_EASE }}
      >
        <img src={sprdlxTextLogo} alt="SPRDLX" className="h-32 md:h-40 w-auto object-contain brightness-0 invert" />
        <div className="flex items-center gap-4 text-[#888888]">
          <span className="font-normal text-sm md:text-base">AI Venture Studio</span>
          <span className="font-light text-[#f0f0f0]">✶</span>
        </div>
      </motion.div>

      <motion.p
        className="absolute bottom-[clamp(5rem,12vh,8rem)] text-[clamp(1.125rem,2.5vw,1.75rem)] font-extralight tabular-nums tracking-[0.35em] text-[#888888]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.95 }}
        transition={{ delay: 0.15, duration: 0.6, ease: FADE_EASE }}
      >
        {formatSpacedPercent(progress)} %
      </motion.p>

      <motion.p
        className="absolute bottom-8 text-xs uppercase tracking-widest text-white/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: showSkipHint ? 0.4 : 0 }}
        transition={{ duration: 0.6, ease: FADE_EASE }}
      >
        Press ESC to skip
      </motion.p>
    </motion.div>
  );
}
