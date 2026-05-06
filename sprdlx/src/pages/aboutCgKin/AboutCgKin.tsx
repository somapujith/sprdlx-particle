import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { useAppBootstrap } from '../../context/AppBootstrapContext';
import { useSEO } from '../../hooks/useSEO';

import './aboutCgKin.css';

export default function AboutCgKin() {
  const { isBootLoaderComplete } = useAppBootstrap();

  useSEO({
    title: 'About — Studio layout | SPRDLX',
    description:
      'Full-viewport landing concept: Arc Worldwide–style typography, stacked image choreography, and studio details.',
    canonical: '/about/kin',
  });

  useEffect(() => {
    const prev = document.documentElement.getAttribute('data-motif');
    document.documentElement.removeAttribute('data-motif');
    return () => {
      if (prev) document.documentElement.setAttribute('data-motif', prev);
      else document.documentElement.removeAttribute('data-motif');
    };
  }, []);

  useEffect(() => {
    const w = window as unknown as { lenisInstance?: { stop: () => void; start: () => void } };
    w.lenisInstance?.stop();
    return () => w.lenisInstance?.start();
  }, []);

  /** Full-bleed: neutralize scrollbar-gutter + scrolling so fixed layers match the paint viewport (#root-safe). */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      gutter: html.style.scrollbarGutter,
    };
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    html.style.scrollbarGutter = 'auto';
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      html.style.scrollbarGutter = prev.gutter;
    };
  }, []);

  return createPortal(
    <div className="cg-kin-iframe-page" aria-hidden={!isBootLoaderComplete}>
      {isBootLoaderComplete && (
        <iframe
          title="CG Kin landing page"
          src="/cg-kin-landing-page/index.html"
          className="cg-kin-iframe"
        />
      )}
    </div>,
    document.body,
  );
}
