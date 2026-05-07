import { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Flip from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import SplitType from 'split-type';

import MenuOverlay from '../../components/Canvas/MenuOverlay';

import { useAppBootstrap } from '../../context/AppBootstrapContext';
import { useSEO } from '../../hooks/useSEO';

import './aboutCgKin.css';

export default function AboutCgKin() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isBootLoaderComplete } = useAppBootstrap();

  useSEO({
    title: 'About — Studio layout | SPRDLX',
    description:
      'Full-viewport landing concept: Super Deluxe Studios–style typography, stacked image choreography, and studio details.',
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
          duration: 3,
          ease: 'hop2',
          stagger: 0.1,
          delay: 1.25,
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
            <div className="revealers">
            <div className="revealer r-1" />
            <div className="revealer r-2" />
          </div>

          <div className="images">
            <div className="img"><img src="/projects/pulp/cosmic-dew.png" alt="" /></div>
            <div className="img"><img src="/projects/esthetic-insights/gallery-2.png" alt="" /></div>
            <div className="img"><img src="/projects/assets/anthill1.png" alt="" /></div>
            <div className="img"><img src="/projects/assets/anthill4.png" alt="" /></div>
            <div className="img"><img src="/projects/esthetic-insights/gallery-1.png" alt="" /></div>
            <div className="img main"><img src="/projects/esthetic-insights/gallery-2.png" alt="" /></div>
            <div className="img main"><img src="/projects/assets/anthill1.png" alt="" /></div>
            <div className="img main"><img src="/projects/pulp/cosmic-dew.png" alt="" /></div>
          </div>

          <div className="hero-content">
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
