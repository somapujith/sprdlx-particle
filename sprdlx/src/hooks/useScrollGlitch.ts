import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollGlitch(triggerPoints: number[] = [500, 1000]) {
  useEffect(() => {
    let lastGlitchTime = 0;
    const glitchCooldown = 2000;

    triggerPoints.forEach((point) => {
      ScrollTrigger.create({
        trigger: 'body',
        start: `top ${point}px`,
        onEnter: () => {
          const now = Date.now();
          if (now - lastGlitchTime < glitchCooldown) return;

          lastGlitchTime = now;
          const glitch = document.createElement('div');
          glitch.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: screen;
            background: repeating-linear-gradient(
              0deg,
              rgba(255, 0, 0, 0.3) 0,
              rgba(255, 0, 0, 0.3) 2px,
              transparent 2px,
              transparent 4px
            );
          `;

          document.body.appendChild(glitch);
          gsap.to(glitch, {
            opacity: 0,
            duration: 0.08,
            onComplete: () => glitch.remove(),
          });
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [triggerPoints]);
}
