import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function PageTransition() {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayTransition, setDisplayTransition] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    setDisplayTransition(true);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 bg-black transition-opacity duration-[1200ms] ease-in-out"
      style={{ opacity: isTransitioning ? 1 : 0 }}
      aria-hidden
    />
  );
}
