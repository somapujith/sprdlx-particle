import { useEffect } from 'react';

export function usePageLoad() {
  useEffect(() => {
    const timer = setTimeout(() => {
      (window as any).lenisInstance?.start();
    }, 850);

    return () => clearTimeout(timer);
  }, []);
}
