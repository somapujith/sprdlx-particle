import { useEffect } from 'react';

/** Sets `document.documentElement.dataset.motif` while mounted (cleared on unmount). */
export function useMotif(motif: 'chrome' | null): void {
  useEffect(() => {
    if (motif !== 'chrome') return;
    document.documentElement.dataset.motif = 'chrome';
    return () => {
      delete document.documentElement.dataset.motif;
    };
  }, [motif]);
}
