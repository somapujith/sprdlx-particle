import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

const CURSOR_SIZE = 8;

/**
 * Smooth GSAP-follow cursor; scales on [data-cursor-hover] targets.
 */
export function CustomCursor() {
  const location = useLocation();
  const isAbout = location.pathname === '/about';
  const dotRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const [useFinePointer, setUseFinePointer] = useState(false);

  useLayoutEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    setUseFinePointer(fine);
    if (fine) {
      document.documentElement.classList.add('has-custom-cursor');
    }
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  useLayoutEffect(() => {
    if (!useFinePointer || !dotRef.current) return;

    const el = dotRef.current;
    xTo.current = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' });
    yTo.current = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' });

    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    gsap.set(el, { x: startX, y: startY });

    let isHovered = false;

    const onMove = (e: PointerEvent) => {
      xTo.current?.(e.clientX);
      yTo.current?.(e.clientY);

      if (isHovered) {
        gsap.to(el, {
          scale: 1.5,
          duration: 0.22,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    const onEnter = () => {
      isHovered = true;
      gsap.to(el, {
        scale: 1.5,
        duration: 0.22,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const onLeave = () => {
      isHovered = false;
      gsap.to(el, {
        scale: 1,
        duration: 0.22,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseenter', onEnter, true);
    document.addEventListener('mouseleave', onLeave, true);

    const hoverElements = document.querySelectorAll('[data-cursor-hover]');
    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseenter', onEnter, true);
      document.removeEventListener('mouseleave', onLeave, true);
      hoverElements.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, [useFinePointer]);

  if (!useFinePointer) return null;

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[99999]"
      style={{
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        marginLeft: -CURSOR_SIZE / 2,
        marginTop: -CURSOR_SIZE / 2,
        borderRadius: '50%',
        background: '#ffffff', // Always white so it works optimally with difference blending
        mixBlendMode: 'difference', // Mathematically guarantees perfect optical contrast everywhere
        willChange: 'transform',
      }}
      aria-hidden
    />
  );
}
