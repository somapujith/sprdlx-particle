import { RefObject, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

type Params = {
  textContainerRef: RefObject<HTMLHeadingElement | null>;
  setCanRevealEntry: (value: boolean) => void;
  setForceReveal: (value: boolean) => void;
  setActiveTopicIndex: (value: number) => void;
};

export function useAboutPageAnimations({
  textContainerRef,
  setCanRevealEntry,
  setForceReveal,
  setActiveTopicIndex,
}: Params) {
  useEffect(() => {
    (window as any).lenisInstance?.start();

    const minCoverTimer = window.setTimeout(() => setCanRevealEntry(true), 300);
    const failSafeTimer = window.setTimeout(() => setForceReveal(true), 1500);

    const localSplits: SplitText[] = [];
    const ctx = gsap.context(() => {
      if (textContainerRef.current) {
        const words = textContainerRef.current.querySelectorAll('.reveal-word');
        gsap.fromTo(
          words,
          { y: '30%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.01,
            scrollTrigger: {
              trigger: textContainerRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }

      const focusSection = document.querySelector('.make-it-matter-section');
      const focusItems = gsap.utils.toArray<HTMLElement>('.focus-item');
      const focusTitles = gsap.utils.toArray<HTMLElement>('.focus-title');
      const revealers = gsap.utils.toArray<HTMLElement>('.focus-title-revealer');
      const overlay = document.querySelector('.focus-out-overlay');
      const focusContent = document.querySelector('.focus-areas-container');
      if (!focusSection || !focusItems.length || !focusTitles.length || !focusContent || !overlay) return;

      const titleSplits = focusTitles.map((title) => new SplitText(title, { type: 'chars' }));
      localSplits.push(...titleSplits);
      titleSplits.forEach((split) => {
        gsap.set(split.chars, { yPercent: 120, opacity: 0, willChange: 'transform, opacity' });
      });
      gsap.set(focusItems, { opacity: 0.32 });
      gsap.set(overlay, { opacity: 0 });
      gsap.set(revealers, { scaleX: 0, transformOrigin: 'left center' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: focusSection,
          start: 'top top',
          end: '+=3600',
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      focusItems.forEach((item, index) => {
        const split = titleSplits[index];
        const chars = split?.chars ?? [];
        const revealer = revealers[index];

        tl.call(() => setActiveTopicIndex(index));
        tl.to(item, { opacity: 1, duration: 0.18, ease: 'power2.out' });
        tl.to(revealer, { scaleX: 1, duration: 0.2, ease: 'power2.out' }, '<');
        tl.to(chars, { yPercent: 0, opacity: 1, stagger: 0.012, duration: 0.5, ease: 'power3.out' }, '<');
        tl.set(revealer, { transformOrigin: 'right center' });
        tl.to(revealer, { scaleX: 0, duration: 0.24, ease: 'power2.inOut' });
        if (index > 0) {
          tl.to(focusItems[index - 1], { opacity: 0.38, duration: 0.2, ease: 'power2.out' }, '<');
        }
        tl.to({}, { duration: 0.36 });
      });

      tl.to({}, { duration: 0.85 });
      tl.to(focusContent, { y: -80, opacity: 0, duration: 0.9, ease: 'power2.inOut' });
      tl.to(overlay, { opacity: 1, duration: 0.9, ease: 'power2.inOut' }, '<');
    });

    return () => {
      window.clearTimeout(minCoverTimer);
      window.clearTimeout(failSafeTimer);
      localSplits.forEach((split) => split.revert());
      ctx.revert();
    };
  }, [setActiveTopicIndex, setCanRevealEntry, setForceReveal, textContainerRef]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const profileImages = document.querySelectorAll('.profile-images .img');
      const nameElements = document.querySelectorAll('.profile-names .name');
      const nameHeadings = document.querySelectorAll('.profile-names .name h1');
      if (!nameHeadings.length) return;

      nameHeadings.forEach((heading) => {
        const split = new SplitText(heading, { type: 'chars' });
        split.chars.forEach((char) => char.classList.add('letter'));
      });

      nameHeadings.forEach((heading) => {
        const letters = heading.querySelectorAll('.letter');
        gsap.set(letters, { y: '100%' });
      });

      if (window.innerWidth < 900) return;

      const handlers: { img: Element; enter: () => void; leave: () => void }[] = [];
      profileImages.forEach((img, index) => {
        const correspondingName = nameElements[index];

        const onEnter = () => {
          const letters = correspondingName?.querySelectorAll('.letter');
          gsap.to(img, { width: 230, height: 230, duration: 0.5, ease: 'power4.out' });
          if (letters?.length) {
            gsap.to(letters, {
              y: '-100%',
              ease: 'power4.out',
              duration: 0.75,
              stagger: { each: 0.025, from: 'center' },
            });
          }
        };

        const onLeave = () => {
          const letters = correspondingName?.querySelectorAll('.letter');
          gsap.to(img, { width: 138, height: 138, duration: 0.5, ease: 'power4.out' });
          if (letters?.length) {
            gsap.to(letters, {
              y: '0%',
              ease: 'power4.out',
              duration: 0.75,
              stagger: { each: 0.025, from: 'center' },
            });
          }
        };

        img.addEventListener('mouseenter', onEnter);
        img.addEventListener('mouseleave', onLeave);
        handlers.push({ img, enter: onEnter, leave: onLeave });
      });

      return () => {
        handlers.forEach(({ img, enter, leave }) => {
          img.removeEventListener('mouseenter', enter);
          img.removeEventListener('mouseleave', leave);
        });
      };
    }, 100);

    return () => clearTimeout(timer);
  }, []);
}
