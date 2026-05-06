/**
 * Decorative section break for Liquid Chrome pages (semantic tokens live under `[data-motif="chrome"]`).
 */
export function SectionDivider({
  variant = 'bar',
  className = '',
}: {
  variant?: 'bar' | 'blob';
  className?: string;
}) {
  const base = 'section-divider shrink-0';
  if (variant === 'blob') {
    return <div className={`${base} section-divider--blob ${className}`} aria-hidden />;
  }
  return <div className={`${base} section-divider--bar ${className}`} role="presentation" />;
}
