import { type ComponentProps, useCallback, useRef } from 'react';
import gsap from 'gsap';

type MagneticLinkProps = ComponentProps<'a'>;

const STRENGTH = 0.32;
const RADIUS = 140;

/**
 * Text subtly pulls toward the pointer while the cursor is near the link.
 */
export function MagneticLink({ children, className = '', onMouseMove, ...rest }: MagneticLinkProps) {
  const wrapRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onMouseMove?.(e);
      const wrap = wrapRef.current;
      const label = labelRef.current;
      if (!wrap || !label) return;

      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const falloff = Math.max(0, 1 - dist / RADIUS);

      gsap.to(label, {
        x: dx * STRENGTH * falloff,
        y: dy * STRENGTH * falloff,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    },
    [onMouseMove],
  );

  const handleLeave = useCallback(() => {
    const label = labelRef.current;
    if (!label) return;
    gsap.to(label, {
      x: 0,
      y: 0,
      duration: 0.55,
      ease: 'elastic.out(1, 0.65)',
      overwrite: 'auto',
    });
  }, []);

  return (
    <a
      ref={wrapRef}
      data-cursor-hover
      className={`relative inline-block ${className}`.trim()}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      <span ref={labelRef} className="inline-block will-change-transform">
        {children}
      </span>
    </a>
  );
}
