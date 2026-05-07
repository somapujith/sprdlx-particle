import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function PageTransition() {
  const location = useLocation();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(true);

  useEffect(() => {
    setIsFadingOut(true);
    setIsFadingIn(false);

    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(false);
      setIsFadingIn(true);
    }, 600);

    const fadeInTimer = setTimeout(() => {
      setIsFadingIn(false);
    }, 1200);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(fadeInTimer);
    };
  }, [location.pathname]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-600 ease-in-out ${
        isFadingOut || isFadingIn ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{
        opacity: isFadingOut && !isFadingIn ? 1 : 0,
      }}
      aria-hidden
    />
  );
}
