import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const lenis = (window as any).lenisInstance;
    if (lenis) {
      lenis.start();
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
}
