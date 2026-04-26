import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function PageTransition() {
  const location = useLocation();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(true);

  useEffect(() => {
    // Start fade out of current page
    setIsFadingOut(true);
    setIsFadingIn(false);

    // After fade out, switch page and fade in
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(false);
      setIsFadingIn(true);
    }, 600);

    // End fade in
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
      className="pointer-events-none fixed inset-0 z-50 bg-black transition-opacity duration-600 ease-in-out"
      style={{
        opacity: isFadingOut ? 1 : (isFadingIn ? 1 : 0),
      }}
      aria-hidden
    />
  );
}
