import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const title = 'SPRDLX';
const subtitle = 'Creative Studio';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'expanding'>('loading');
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const loadMs = 2800;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / loadMs, 1);
      setProgress(Math.round(easeOutCubic(t) * 100));

      if (t >= 1) {
        setPhase('expanding');
        window.setTimeout(() => completeRef.current(), 950);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#dcdcdc] text-gray-900"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Subtle grain + vignette */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 45%, transparent 0%, rgba(0,0,0,0.12) 100%)',
        }}
      />

      {/* Ambient orbit — slow drift */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[38%] h-[11rem] w-[11rem] -translate-x-1/2 -translate-y-1/2 md:h-[13rem] md:w-[13rem]"
        animate={{ rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 72, 144, 216, 288].map((deg) => (
          <span
            key={deg}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-black/20"
            style={{
              transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-5.25rem)`,
            }}
          />
        ))}
      </motion.div>

      {/* Morphing core + soft echo */}
      <motion.div
        className="absolute left-1/2 top-[38%] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/10 blur-xl md:h-24 md:w-24"
        animate={
          phase === 'expanding'
            ? { scale: 55, opacity: 0, transition: { duration: 0.95, ease: [0.65, 0, 0.35, 1] } }
            : {
                scale: [1, 1.08, 0.96, 1.05, 1],
                opacity: [0.35, 0.55, 0.4, 0.5, 0.35],
              }
        }
        transition={
          phase === 'expanding'
            ? {}
            : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
        }
      />
      <motion.div
        className="absolute left-1/2 top-[38%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 bg-black md:h-[4.5rem] md:w-[4.5rem]"
        animate={
          phase === 'expanding'
            ? {
                scale: 48,
                borderRadius: '50%',
                transition: { duration: 0.95, ease: [0.65, 0, 0.35, 1] },
              }
            : {
                borderRadius: [
                  '50%',
                  '45% 55% 52% 48% / 48% 45% 55% 52%',
                  '52% 48% 45% 55% / 55% 52% 48% 45%',
                  '50%',
                ],
                rotate: [0, 120, 240, 360],
              }
        }
        transition={
          phase === 'expanding'
            ? {}
            : { duration: 6, repeat: Infinity, ease: 'linear' }
        }
      />

      {/* Foreground copy */}
      <motion.div
        className="relative z-10 flex min-h-[50vh] w-full max-w-4xl flex-col items-center justify-between px-6 pb-16 pt-12 md:px-12"
        animate={{ opacity: phase === 'expanding' ? 0 : 1, y: phase === 'expanding' ? -12 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col items-center gap-3 md:gap-4 [perspective:900px]">
          <div className="flex items-center justify-center gap-1 md:gap-1.5">
            {title.split('').map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                className="inline-block origin-bottom font-semibold tracking-tight text-3xl md:text-5xl"
                initial={{ opacity: 0, y: 28, rotateX: -55, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                transition={{
                  delay: 0.06 + i * 0.05,
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          <motion.div
            className="flex items-center gap-3 text-sm font-light tracking-[0.35em] text-gray-600 md:text-base"
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.35em' }}
            transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="h-px w-8 bg-black/20" />
            {subtitle}
            <span className="h-px w-8 bg-black/20" />
          </motion.div>
        </div>

        {/* Progress ring + shimmer track */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative h-28 w-28 md:h-32 md:w-32">
            <svg className="-rotate-90" viewBox="0 0 100 100" aria-hidden>
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-black/10"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-black transition-[stroke-dashoffset] duration-100 ease-out"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-lg tabular-nums tracking-tight text-gray-800 md:text-xl">
                {progress}
                <span className="text-sm text-gray-500">%</span>
              </span>
            </div>
          </div>

          <div className="h-[2px] w-52 overflow-hidden rounded-full bg-black/[0.08] md:w-72">
            <motion.div
              className="h-full w-full origin-left bg-gradient-to-r from-black/30 via-black/80 to-black/40"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ type: 'spring', stiffness: 100, damping: 28 }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
