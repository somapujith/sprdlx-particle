import { useEffect } from 'react';

export function useTextScramble(
  ref: React.RefObject<HTMLElement>,
  enabled = true
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const originalText = el.textContent || '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

    const handleMouseEnter = () => {
      let index = 0;
      const timer = setInterval(() => {
        if (index >= originalText.length) {
          el.textContent = originalText;
          clearInterval(timer);
          return;
        }

        let scrambled = originalText.substring(0, index);
        for (let i = index; i < originalText.length; i++) {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
        el.textContent = scrambled;
        index++;
      }, 30);
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    return () => el.removeEventListener('mouseenter', handleMouseEnter);
  }, [ref, enabled]);
}
