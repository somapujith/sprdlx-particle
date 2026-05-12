import { Link, useNavigate, type LinkProps } from 'react-router-dom';
import { forwardRef, useCallback } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

declare global {
  interface Document {
    startViewTransition(callback: () => void): {
      finished: Promise<void>;
      ready: Promise<void>;
    };
  }
  interface Window {
    lenisInstance?: Lenis;
  }
}

const pageModules: Record<string, () => Promise<unknown>> = {
  '/about': () => import('@/pages/about/About'),
  '/projects': () => import('@/pages/projects/Projects'),
  '/projects-detail': () => import('@/pages/projects/ProjectDetail'),
};

function prefetchPath(path: string) {
  if (path === '/' || path.startsWith('/#')) {
    return;
  }
  const key = path.startsWith('/projects/') && path !== '/projects' ? '/projects-detail' : path;
  void pageModules[key]?.();
}

const VTLink = forwardRef<HTMLAnchorElement, LinkProps>(function VTLink(
  { to, onClick, replace, state, target, onPointerEnter, onFocus, onTouchStart, ...rest },
  ref
) {
  const navigate = useNavigate();

  const warm = useCallback(
    (path: string) => {
      prefetchPath(path);
    },
    []
  );

  return (
    <Link
      ref={ref}
      to={to}
      replace={replace}
      state={state}
      target={target}
      {...rest}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        if (typeof to === 'string' && !/^https?:\/\//i.test(to)) warm(to.split('#')[0] || '/');
      }}
      onFocus={(e) => {
        onFocus?.(e);
        if (typeof to === 'string' && !/^https?:\/\//i.test(to)) warm(to.split('#')[0] || '/');
      }}
      onTouchStart={(e) => {
        onTouchStart?.(e);
        if (typeof to === 'string' && !/^https?:\/\//i.test(to)) warm(to.split('#')[0] || '/');
      }}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (target === '_blank') return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (typeof to === 'string') {
          if (/^https?:\/\//i.test(to) || to.startsWith('mailto:')) return;
        }
        e.preventDefault();

        if (typeof to === 'string') {
          prefetchPath(to.split('#')[0] || '/');
        }

        window.lenisInstance?.stop();
        const run = () => navigate(to, { replace, state });

        if (typeof document !== 'undefined' && typeof document.startViewTransition === 'function') {
          document.documentElement.classList.add('vt-active');
          const transition = document.startViewTransition(run);
          void transition.finished.finally(() => {
            document.documentElement.classList.remove('vt-active');
            requestAnimationFrame(() => ScrollTrigger.refresh());
          });
        } else {
          run();
        }
      }}
    />
  );
});

export default VTLink;
