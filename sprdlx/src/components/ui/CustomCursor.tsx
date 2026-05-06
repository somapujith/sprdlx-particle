import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { isChromeMotifPath } from '../../lib/chromeMotifPaths';

const CURSOR_SIZE = 8;

/**
 * Smooth GSAP-follow cursor; scales on `[data-cursor-hover]` targets.
 * Prism aura only on Liquid Chrome routes (non-Home).
 */
export function CustomCursor() {
  const location = useLocation();
  const showChromeAura = isChromeMotifPath(location.pathname);
  const disableCustomCursor = location.pathname === '/about/kin';

  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const [useFinePointer, setUseFinePointer] = useState(false);

  useLayoutEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setUseFinePointer(fine && !prefersReduced);
    if (fine && !prefersReduced && !disableCustomCursor) {
      document.documentElement.classList.add('has-custom-cursor');
    } else {
      document.documentElement.classList.remove('has-custom-cursor');
    }
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [disableCustomCursor]);

  useLayoutEffect(() => {
    if (!useFinePointer || disableCustomCursor || !containerRef.current || !dotRef.current) return;

    const wrapper = containerRef.current;
    const el = dotRef.current;
    xTo.current = gsap.quickTo(wrapper, 'x', { duration: 0.55, ease: 'power3.out' });
    yTo.current = gsap.quickTo(wrapper, 'y', { duration: 0.55, ease: 'power3.out' });

    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    gsap.set(wrapper, { x: startX, y: startY });

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
    hoverElements.forEach((node) => {
      node.addEventListener('mouseenter', onEnter);
      node.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseenter', onEnter, true);
      document.removeEventListener('mouseleave', onLeave, true);
      hoverElements.forEach((node) => {
        node.removeEventListener('mouseenter', onEnter);
        node.removeEventListener('mouseleave', onLeave);
      });
    };
  }, [useFinePointer, disableCustomCursor]);

  if (!useFinePointer || disableCustomCursor) return null;

  return (
    <div ref={containerRef} className="pointer-events-none fixed left-0 top-0 z-[99999]" style={{ willChange: 'transform' }}>
      {showChromeAura ? (
        <div
          className="pointer-events-none absolute rounded-full left-0 top-0"
          style={{
            width: 28,
            height: 28,
            marginLeft: -14,
            marginTop: -14,
            background: 'linear-gradient(120deg, #7be1ff, #ff66c4, #fca311)',
            filter: 'blur(12px)',
            opacity: 0.52,
          }}
          aria-hidden
        />
      ) : null}
      <div
        ref={dotRef}
        className="pointer-events-none absolute rounded-full left-0 top-0"
        style={{
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
          marginLeft: -CURSOR_SIZE / 2,
          marginTop: -CURSOR_SIZE / 2,
          background: '#ffffff',
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
        aria-hidden
      />
    </div>
  );
}
