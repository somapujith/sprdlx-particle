import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

function MenuOverlay() {
  const menuOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const menuOverlay = menuOverlayRef.current;
    if (!menuOverlay) return;

    let container = document.querySelector('.container') as HTMLElement;
    // Fallback for Projects page
    if (!container) {
      const canvasDiv = document.querySelector('[style*="cursor: grab"]') as HTMLElement;
      if (canvasDiv) {
        container = canvasDiv;
      }
    }

    const navToggle = document.querySelector('.nav-toggle') as HTMLElement;
    const navClose = document.querySelector('.nav-close') as HTMLElement;
    const menuContent = menuOverlay.querySelector('.menu-content');
    const menuImage = menuOverlay.querySelector('.menu-img');
    const menuLinksWrapper = menuOverlay.querySelector('.menu-links-wrapper');
    const linkHighlighter = menuOverlay.querySelector('.link-highlighter');

    if (!navToggle || !navClose || !menuContent || !menuImage || !menuLinksWrapper || !linkHighlighter) {
      return;
    }

    let currentX = 0;
    let targetX = 0;
    const lerpFactor = 0.05;

    let currentHighlighterX = 0;
    let targetHighlighterX = 0;
    let currentHighlighterWidth = 0;
    let targetHighlighterWidth = 0;

    let isMenuOpen = false;
    let isMenuAnimating = false;

    const menuLinks = menuOverlay.querySelectorAll('.menu-link a');
    menuLinks.forEach((link) => {
      const spans = link.querySelectorAll('span');
      spans.forEach((span, charIndex) => {
        const split = new SplitText(span, { type: 'chars' });
        split.chars.forEach((char) => {
          char.classList.add('char');
        });
        if (charIndex === 1) {
          gsap.set(split.chars, { y: '110%' });
        }
      });
    });

    gsap.set(menuContent, { y: '50%', opacity: 0.25 });
    gsap.set(menuImage, { scale: 0.5, opacity: 0.25 });
    gsap.set('.menu-link', { y: '150%' });
    gsap.set(linkHighlighter, { y: '150%' });

    const defaultLinkText = menuOverlay.querySelector('.menu-link:first-child a span');
    if (defaultLinkText) {
      const linkWidth = defaultLinkText.clientWidth;
      (linkHighlighter as HTMLElement).style.width = linkWidth + 'px';
      currentHighlighterWidth = linkWidth;
      targetHighlighterWidth = linkWidth;

      const defaultLinkTextElement = menuOverlay.querySelector('.menu-link:first-child');
      if (defaultLinkTextElement) {
        const linkRect = defaultLinkTextElement.getBoundingClientRect();
        const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();
        const initialX = linkRect.left - menuWrapperRect.left;
        currentHighlighterX = initialX;
        targetHighlighterX = initialX;
      }
    }

    function toggleMenu() {
      if (isMenuAnimating) return;
      isMenuAnimating = true;

      if (!isMenuOpen) {
        document.body.style.overflow = 'hidden';
        if (container) container.style.pointerEvents = 'none';
        gsap.to(container, {
          y: '-40%',
          opacity: 0.25,
          duration: 1.25,
          ease: 'expo.out',
        });

        gsap.to(menuOverlay, {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
          duration: 1.25,
          ease: 'expo.out',
          onComplete: () => {
            gsap.set(container, { y: '40%' });
            gsap.set('.menu-link', { overflow: 'visible' });
            gsap.set(navToggle, { display: 'none' });
            gsap.set(navClose, { display: 'block' });
            menuOverlay.style.pointerEvents = 'auto';

            isMenuOpen = true;
            isMenuAnimating = false;
          },
        });

        gsap.to(menuContent, {
          y: '0%',
          opacity: 1,
          duration: 1.5,
          ease: 'expo.out',
        });

        gsap.to(menuImage, {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'expo.out',
        });

        gsap.to('.menu-link', {
          y: '0%',
          duration: 1.25,
          stagger: 0.1,
          delay: 0.25,
          ease: 'expo.out',
        });

        gsap.to(linkHighlighter, {
          y: '0%',
          duration: 1,
          delay: 1,
          ease: 'expo.out',
        });
      } else {
        gsap.to(container, {
          y: '0%',
          opacity: 1,
          duration: 1.25,
          ease: 'expo.out',
        });

        gsap.to('.menu-link', {
          y: '-200%',
          duration: 1.25,
          ease: 'expo.out',
        });

        gsap.to(menuContent, {
          y: '-100%',
          opacity: 0.25,
          duration: 1.25,
          ease: 'expo.out',
        });

        gsap.to(menuImage, {
          y: '-100%',
          opacity: 0.5,
          duration: 1.25,
          ease: 'expo.out',
        });

        gsap.to(menuOverlay, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          duration: 1.25,
          ease: 'expo.out',
          onComplete: () => {
            document.body.style.overflow = 'auto';
            if (container) container.style.pointerEvents = 'auto';
            menuOverlay.style.pointerEvents = 'none';
            gsap.set(menuOverlay, {
              clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            });
            gsap.set('.menu-link', { y: '150%', overflow: 'hidden' });
            gsap.set(linkHighlighter, { y: '150%' });
            gsap.set(menuContent, { y: '50%', opacity: 0.25 });
            gsap.set(menuImage, { y: '0%', scale: 0.5, opacity: 0.25 });
            gsap.set(menuLinksWrapper, { x: 0 });
            gsap.set(navToggle, { display: 'block' });
            gsap.set(navClose, { display: 'none' });
            currentX = 0;
            targetX = 0;

            isMenuOpen = false;
            isMenuAnimating = false;
          },
        });
      }
    }

    navToggle.addEventListener('click', toggleMenu);
    navClose.addEventListener('click', toggleMenu);

    const menuLinkContainers = menuOverlay.querySelectorAll('.menu-link');
    menuLinkContainers.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        if (window.innerWidth < 1000) return;

        const linkCopy = link.querySelectorAll('a span');
        const visibleCopy = linkCopy[0];
        const animatedCopy = linkCopy[1];

        const visibleChars = visibleCopy.querySelectorAll('.char');
        gsap.to(visibleChars, {
          y: '-110%',
          stagger: 0.03,
          duration: 0.5,
          ease: 'expo.inOut',
        });

        const animatedChars = animatedCopy.querySelectorAll('.char');
        gsap.to(animatedChars, {
          y: '0%',
          stagger: 0.03,
          duration: 0.5,
          ease: 'expo.inOut',
        });
      });

      link.addEventListener('mouseleave', () => {
        if (window.innerWidth < 1000) return;

        const linkCopy = link.querySelectorAll('a span');
        const visibleCopy = linkCopy[0];
        const animatedCopy = linkCopy[1];

        const animatedChars = animatedCopy.querySelectorAll('.char');
        gsap.to(animatedChars, {
          y: '110%',
          stagger: 0.03,
          duration: 0.5,
          ease: 'expo.inOut',
        });

        const visibleChars = visibleCopy.querySelectorAll('.char');
        gsap.to(visibleChars, {
          y: '0%',
          stagger: 0.03,
          duration: 0.5,
          ease: 'expo.inOut',
        });
      });
    });

    menuOverlay.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 1000) return;

      const mouseX = (e as MouseEvent).clientX;
      const viewportWidth = window.innerWidth;
      const menuLinksWrapperWidth = menuLinksWrapper.clientWidth;

      const maxMoveLeft = 0;
      const maxMoveRight = viewportWidth - menuLinksWrapperWidth;

      const sensitivityRange = viewportWidth * 0.5;
      const startX = (viewportWidth - sensitivityRange) / 2;
      const endX = startX + sensitivityRange;

      let mousePercentage;
      if (mouseX <= startX) {
        mousePercentage = 0;
      } else if (mouseX >= endX) {
        mousePercentage = 1;
      } else {
        mousePercentage = (mouseX - startX) / sensitivityRange;
      }

      targetX = maxMoveLeft + mousePercentage * (maxMoveRight - maxMoveLeft);
    });

    menuLinkContainers.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        if (window.innerWidth < 1000) return;

        const linkRect = link.getBoundingClientRect();
        const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();

        targetHighlighterX = linkRect.left - menuWrapperRect.left;

        const linkCopyElement = link.querySelector('a span');
        targetHighlighterWidth = linkCopyElement ? linkCopyElement.clientWidth : link.clientWidth;
      });
    });

    menuLinksWrapper.addEventListener('mouseleave', () => {
      const defaultLinkText = menuOverlay.querySelector('.menu-link:first-child');
      const defaultLinkTextSpan = defaultLinkText?.querySelector('a span');

      if (defaultLinkText && defaultLinkTextSpan) {
        const linkRect = defaultLinkText.getBoundingClientRect();
        const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();

        targetHighlighterX = linkRect.left - menuWrapperRect.left;
        targetHighlighterWidth = defaultLinkTextSpan.clientWidth;
      }
    });

    function animate() {
      currentX += (targetX - currentX) * lerpFactor;
      currentHighlighterX += (targetHighlighterX - currentHighlighterX) * lerpFactor;
      currentHighlighterWidth += (targetHighlighterWidth - currentHighlighterWidth) * lerpFactor;

      gsap.to(menuLinksWrapper, {
        x: currentX,
        duration: 0.3,
        ease: 'power4.out',
      });

      gsap.to(linkHighlighter, {
        x: currentHighlighterX,
        width: currentHighlighterWidth,
        duration: 0.3,
        ease: 'power4.out',
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      navToggle.removeEventListener('click', toggleMenu);
    };
  }, []);

  return (
    <>
      <nav>
        <div className="nav-toggle">
          <p>Menu</p>
        </div>
        <div className="nav-close" style={{ display: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      </nav>

      <div ref={menuOverlayRef} className="menu-overlay">
        <div className="menu-content">
          <div className="menu-col">
            <p>SPRDLX</p>
            <p>AI Venture Agency</p>
            <p>Hyderabad</p>
            <br />
            <p>Edition</p>
            <p>Vol. 01</p>
            <br />
            <p>Contact</p>
            <p>hello@sprdlx.com</p>
          </div>
          <div className="menu-col">
            <p>Instagram</p>
            <p>LinkedIn</p>
            <p>GitHub</p>
          </div>
        </div>

        <div className="menu-img-section">
          <div className="menu-img">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 873 774" width="200" height="178">
              <path fill="white" d="M578 587.2c-19.3-19-42.1-41-64.2-63.7-4-4-7-11-7-16.8-.7-32-.4-64-.4-97.3 5-.2 9.1-.5 13.2-.5 27.9-.1 55.8.3 83.6-.3 8.6-.1 14.1 3 20.1 8.7 22 21.2 44.6 41.6 68 63.3l33.5-32.4c13.4-12.9 24.7-30.8 40.6-37.2 16.4-6.6 37.3-2 56.2-2.1 16.2-.2 32.4 0 50 0v55c-.2 17.4 4 36.6-2.2 51.5-6 14.6-22.3 25-34.5 37-12.6 12.4-25.6 24.4-37.8 36.1 22.2 22.9 42.3 44.2 63.3 64.7 8 7.9 11.8 15.7 11.5 27.2-.8 30.5-.3 61-.3 92.5-3.3.4-6.2 1-9.1 1-29.7 0-59.4.3-89.1-.3a25.7 25.7 0 0 1-15.7-7c-19.7-19.2-39-38.7-57.8-58.8-7.8-8.4-12.6-9.4-20.8-.2a1453.3 1453.3 0 0 1-57 59.6 23.5 23.5 0 0 1-14.7 6.4c-30 .5-60.1-.1-90.2.4-9 .1-11-3-11-11.4.5-29.8 0-59.6.5-89.3.1-5 3-11 6.5-14.9 20.7-23.4 42-46.4 64.7-71.2Zm-1.4-204.4V.8c4.5-.3 8.2-.7 12-.7 72 0 144-.2 215.9.3 6.1 0 13.5 3.1 18 7.3A844.6 844.6 0 0 1 866 51.2a21 21 0 0 1 5.4 13c.4 37.4.4 75 0 112.5 0 4.7-2.8 10.3-6 14-12.4 14.8-25.5 29-39.2 44.5 13 14.8 26.2 28.8 38.2 43.8 3.9 4.8 6.8 12 7 18.2.6 28.2.2 56.4.2 86.6-13.4 0-26.6-1.8-39.3.3-32.1 5.3-54.9-6.9-73.7-32.4-11.8-15.9-26.8-29.4-42.6-46.5v77.6H576.7Zm140-273.1v55.1h12.8c0-16-.3-31.4.2-46.7.3-10-4.4-11-13-8.4ZM272.4 1v134.1h-92.2c3.5 4.4 5.2 7 7.4 9.3 26.2 26.3 52.7 52.3 78.5 79a25.8 25.8 0 0 1 6.5 15.9c.7 25.5.5 51 .1 76.5 0 4.2-1.5 9.3-4.1 12.4a1554.2 1554.2 0 0 1-45.4 49.7 18 18 0 0 1-11.6 5.6c-68.5.4-137 .3-205.5.2-1.5 0-3-.4-5-.8V247.3h81.7c-4.2-4.8-6.4-7.7-9-10.2-21.8-22-43.4-44-65.6-65.6a24.2 24.2 0 0 1-7.8-19.4C.7 122.7.3 93.3.8 64c0-4.7 2.5-10.5 5.8-14 14.3-15.1 29-29.8 44.2-44.3 3-2.9 7.9-5.3 12-5.3 67.6-.4 135.3-.4 203-.4 1.9 0 3.7.5 6.5 1ZM.9 408.8H68c43.3 0 86.7-.2 130 .3a26 26 0 0 1 16 6.6c15.4 14.5 35.8 27.5 43.4 45.7 7.7 18.1 2.4 41.8 2.5 63 .1 61.9.2 123.8-.3 185.6 0 6.1-3.2 13.4-7.4 18a582.3 582.3 0 0 1-39.6 39 26 26 0 0 1-16 6.6c-31 0-61.8-1.3-92.7-1.3s-62.6.8-94 1.7c-7.4.2-10-2.2-10-9.9.2-116 .1-232 .2-348 0-2 .3-3.8.7-7.3Zm123.6 260.4c7.5 2.5 11.3 1.3 11.2-7.4-.2-47.2-.2-94.4 0-141.6.1-9.3-3.8-10.2-11.2-7.6v156.6Zm164.9-286.3V.9c3.7-.2 7.4-.8 11-.8C366 0 431.3-.1 496.7.3a27 27 0 0 1 17 7 770.1 770.1 0 0 1 41.6 42c3.3 3.5 5.8 9.3 5.8 14 .4 49.5.4 99 0 148.5a21 21 0 0 1-5.4 13 986.8 986.8 0 0 1-43.4 43.4 23.1 23.1 0 0 1-14.2 5.6c-23.5.5-47.1.2-72 .2v109H289.5ZM425.6 164l3.8 2.8c2.2-2.4 6.1-4.8 6.2-7.2.6-15 .5-30 0-45.1 0-2-3.2-4-5-6-1.6 2-4.7 4-4.8 6-.4 16.5-.2 33-.2 49.5Zm66.5 608.9H275.8V409.7H404v243.4h88v119.8Z"/>
            </svg>
          </div>
          <div className="menu-quote">
            <p>Built by <span>Humans</span></p>
            <p>Powered by <span>AI</span></p>
            <p>Driven by <span>obsession</span></p>
          </div>
        </div>

        <div className="menu-links-wrapper">
          <div className="menu-link">
            <a href="/">
              <span>Home</span>
              <span>Home</span>
            </a>
          </div>
          <div className="menu-link">
            <a href="/projects">
              <span>Projects</span>
              <span>Projects</span>
            </a>
          </div>
          <div className="menu-link">
            <a href="/about">
              <span>About</span>
              <span>About</span>
            </a>
          </div>
          <div className="menu-link">
            <a href="/contact">
              <span>Contact</span>
              <span>Contact</span>
            </a>
          </div>

          <div className="link-highlighter"></div>
        </div>
      </div>

      <div className="container">
        <div className="scroll-indicator">
          <div className="scroll-icon">
            <svg width="20" height="32" viewBox="0 0 20 32" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="16" height="24" rx="8" />
              <circle cx="10" cy="10" r="1" fill="currentColor" />
            </svg>
          </div>
          <p>Scroll</p>
        </div>
      </div>
    </>
  );
}

export default MenuOverlay;
