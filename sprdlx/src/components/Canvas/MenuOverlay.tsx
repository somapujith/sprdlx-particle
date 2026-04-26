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
  );
}


export default MenuOverlay;
