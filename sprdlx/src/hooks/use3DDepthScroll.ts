import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function use3DDepthScroll(depthRange: [number, number] = [0.6, 0.8]) {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-depth]');

    elements.forEach((el) => {
      const depth = parseFloat((el as HTMLElement).getAttribute('data-depth') || '0.5');
      const clampedDepth = Math.max(depthRange[0], Math.min(depthRange[1], depth));

      gsap.to(el, {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: (self) => {
            const offset = self.progress * 100 * (1 - clampedDepth);
            gsap.set(el, { y: offset });
          },
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [depthRange]);
}
