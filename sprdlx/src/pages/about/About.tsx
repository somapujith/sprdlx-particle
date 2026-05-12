import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Flip from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import SplitType from 'split-type';

import MenuOverlay from '../../components/canvas/MenuOverlay';
import FaultyTerminal from '../../components/faulty-terminal/FaultyTerminal';

import { useAppBootstrap } from '../../context/AppBootstrapContext';
import { useSEO } from '../../hooks/useSEO';

import './about.css';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isBootLoaderComplete } = useAppBootstrap();
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    if (isBootLoaderComplete) {
      const timer = setTimeout(() => {
        setShowTerminal(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isBootLoaderComplete]);

  useSEO({
    title: 'About — Studio layout | SPRDLX',
    description:
      'Full-viewport landing concept: Super Deluxe Studios–style typography, stacked image choreography, and studio details.',
    canonical: '/about',
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

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevScrollbarGutter = html.style.scrollbarGutter;

    html.style.overflow = 'hidden';
    html.style.scrollbarGutter = 'auto';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prevOverflow;
      html.style.scrollbarGutter = prevScrollbarGutter;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  useLayoutEffect(() => {
    if (!isBootLoaderComplete) return undefined;
    if (!containerRef.current) return undefined;

    gsap.registerPlugin(Flip, CustomEase);
    CustomEase.create(
      'hop',
      'M0,0 C0.355,0.022 0.448,0.079 0.5,0.5 0.542,0.846 0.615,1 1,1 ',
    );
    CustomEase.create(
      'hop2',
      'M0,0 C0.078,0.617 0.114,0.716 0.255,0.828 0.373,0.922 0.561,1 1,1 ',
    );

    const container = containerRef.current;
    const h2 = container.querySelector('.site-info h2') as HTMLElement;
    if (h2) {
      const split = new SplitType(h2, { types: 'lines' });
      split.lines?.forEach((line) => {
        const text = line.textContent;
        const wrapper = document.createElement('div');
        wrapper.className = 'line';
        const span = document.createElement('span');
        span.textContent = text ?? '';
        wrapper.appendChild(span);
        line.parentNode?.replaceChild(wrapper, line);
      });
    }

    const ctx = gsap.context(() => {
      const mainTl = gsap.timeline();
      const revealerTl = gsap.timeline();
      const scaleTl = gsap.timeline();

      revealerTl
        .to('.r-1', {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          duration: 1.5,
          ease: 'hop',
        })
        .to(
          '.r-2',
          {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            duration: 1.5,
            ease: 'hop',
          },
          '<',
        );

      scaleTl.to('.img:first-child', {
        scale: 1,
        duration: 2,
        ease: 'power4.inOut',
      });

      const images = container.querySelectorAll('.img:not(:first-child)');
      images.forEach((img) => {
        scaleTl.to(
          img,
          {
            opacity: 1,
            scale: 1,
            duration: 1.25,
            ease: 'power3.out',
          },
          '>-0.95',
        );
      });

      mainTl
        .add(revealerTl)
        .add(scaleTl, '-=1.25')
        .add(() => {
          container.querySelectorAll('.img:not(.main)').forEach((img) => img.remove());

          const state = Flip.getState('.main');
          const imagesContainer = container.querySelector('.images');
          imagesContainer?.classList.add('stacked-container');

          container.querySelectorAll('.main').forEach((img, i) => {
            img.classList.add('stacked');
            (img as HTMLElement).style.order = String(i);
            gsap.set('.img.stacked', {
              clearProps: 'transform,top,left',
            });
          });

          return Flip.from(state, {
            duration: 2,
            ease: 'hop',
            absolute: true,
            stagger: {
              amount: -0.3,
            },
          });
        })
        .to('.word h1, .nav-item p, .line p, .site-info h2 .line span', {
          y: 0,
          duration: 1.5,
          ease: 'hop2',
          stagger: 0.1,
          delay: 1,
        })
        .to('.team-img', {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
          duration: 2,
          ease: 'hop',
          delay: -4.75,
        });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [isBootLoaderComplete]);

  return createPortal(
    <>
      <div className="cg-kin-landing-page" ref={containerRef} aria-hidden={!isBootLoaderComplete}>
        {isBootLoaderComplete ? (
          <div className="cg-kin-container">
            {showTerminal && (
              <div className="fixed inset-0 z-0 pointer-events-none">
                <FaultyTerminal
                  scale={2.4}
                  gridMul={[2, 1]}
                  digitSize={1.9}
                  timeScale={1}
                  pause={false}
                  scanlineIntensity={1}
                  glitchAmount={1}
                  flickerAmount={1}
                  noiseAmp={1}
                  chromaticAberration={0}
                  dither={0}
                  curvature={0.2}
                  tint="#f3f7a8"
                  mouseReact={true}
                  mouseStrength={0.5}
                  pageLoadAnimation={true}
                  brightness={1}
                />
              </div>
            )}
            <div className="revealers relative z-10">
            <div className="revealer r-1" />
            <div className="revealer r-2" />
          </div>

          <div className="images relative z-10">
            <div className="img"><img src="/projects/pulp/cosmic-dew.png" alt="Pulp creative storytelling platform" /></div>
            <div className="img"><img src="/projects/esthetic-insights/gallery-2.png" alt="Esthetic Insights beauty analytics interface" /></div>
            <div className="img"><img src="/projects/assets/anthill1.png" alt="Anthill AI venture capital platform" /></div>
            <div className="img"><img src="/projects/assets/anthill4.png" alt="Anthill portfolio management dashboard" /></div>
            <div className="img"><img src="/projects/esthetic-insights/gallery-1.png" alt="Esthetic Insights design tools" /></div>
            <div className="img main"><img src="/projects/esthetic-insights/gallery-2.png" alt="Esthetic Insights platform showcase" /></div>
            <div className="img main"><img src="/projects/assets/anthill1.png" alt="Anthill platform showcase" /></div>
            <div className="img main"><img src="/projects/pulp/cosmic-dew.png" alt="Pulp platform showcase" /></div>
          </div>

          <div className="hero-content relative z-10">
            <div className="site-logo">
              <div className="word">
                <h1>Super</h1>
              </div>
              <div className="word">
                <h1>Deluxe Studios<sup>&copy;</sup></h1>
              </div>
            </div>

            <div className="team-img team-logo">
              <img src="/favicon.svg" alt="" />
            </div>

            <div className="site-info">
              <div className="row">
                <div className="col">
                  <div className="line"><p>Featured Works</p></div>
                </div>
                <div className="col">
                  <h2>
                    SPRDLX builds modern digital solutions that blend creativity, technology, and innovation. We create high-performance websites, scalable applications, and intelligent systems designed to help brands grow, evolve, and lead in the digital world.
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
    {isBootLoaderComplete && <MenuOverlay />}
    </>,
    document.body,
  );
}
