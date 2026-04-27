import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import './menu-overlay.css';

gsap.registerPlugin(SplitText);

function MenuOverlay() {
  const navToggleRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBgRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const navToggle = navToggleRef.current;
    const menu = menuRef.current;
    const menuBg = menuBgRef.current;

    if (!navToggle || !menu || !menuBg) return;

    const navToggleMenu = navToggle.querySelector('.nav-toggle-menu') as HTMLElement;
    const navToggleClose = navToggle.querySelector('.nav-toggle-close') as HTMLElement;
    const menuLogo = menu.querySelector('.menu-logo') as HTMLElement;
    const menuLinks = menu.querySelectorAll('.menu-col-links a');
    const menuInfoItems = menu.querySelectorAll('.menu-col-info p, .menu-col-info h3, .menu-col-info h6');
    const menuBgSvg = menu.querySelector('.menu-bg-svg') as SVGSVGElement;

    const svgWidth = menuBgSvg.viewBox.baseVal.width;
    const svgHeight = menuBgSvg.viewBox.baseVal.height;
    const svgCenterX = svgWidth / 2;

    const OPEN_HIDDEN = `M${svgWidth},0 Q${svgCenterX},0 0,0 L0,0 L${svgWidth},0 Z`;
    const OPEN_BULGE = `M${svgWidth},345 Q${svgCenterX},620 0,345 L0,0 L${svgWidth},0 Z`;
    const OPEN_FULL = `M${svgWidth},${svgHeight} Q${svgCenterX},${svgHeight} 0,${svgHeight} L0,0 L${svgWidth},0 Z`;
    const CLOSE_START = `M${svgWidth},0 Q${svgCenterX},0 0,0 L0,${svgHeight} L${svgWidth},${svgHeight} Z`;
    const CLOSE_BULGE = `M${svgWidth},350 Q${svgCenterX},130 0,350 L0,${svgHeight} L${svgWidth},${svgHeight} Z`;
    const CLOSE_HIDDEN = `M${svgWidth},${svgHeight} Q${svgCenterX},${svgHeight} 0,${svgHeight} L0,${svgHeight} L${svgWidth},${svgHeight} Z`;

    gsap.set(menuBg, { attr: { d: OPEN_HIDDEN } });

    const splits: any[] = [];
    menuLinks.forEach((link) => {
      const split = new SplitText(link, { type: 'chars', charsClass: 'char' });
      splits.push(split);
      gsap.set(split.chars, { opacity: 0, x: '750%' });
    });

    gsap.set(menuInfoItems, { opacity: 0, y: 100 });

    let isOpen = false;
    let isAnimating = false;

    const openMenu = () => {
      if (isAnimating) return;
      isAnimating = true;
      menu.classList.add('is-open');

      gsap.to(navToggleMenu, { duration: 0.25, opacity: 0, ease: 'none' });
      gsap.to(navToggleClose, { duration: 0.25, opacity: 1, ease: 'none', delay: 0.25 });

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating = false;
        },
      });

      tl.to(menuBg, { duration: 0.5, attr: { d: OPEN_BULGE }, ease: 'power4.in' })
        .to(menuBg, { duration: 0.5, attr: { d: OPEN_FULL }, ease: 'power4.out' });

      tl.to(menuLogo, { duration: 0.1, opacity: 1, ease: 'none' }, '-=0.75');

      tl.to(
        menuInfoItems,
        {
          duration: 0.75,
          opacity: 1,
          y: 0,
          ease: 'power3.out',
          stagger: 0.075,
        },
        '-=0.35'
      );

      const menuLinksChars = splits.flatMap((s) => s.chars);

      tl.to(
        menuLinksChars,
        {
          duration: 1.5,
          x: '0%',
          ease: 'elastic.out(1, 0.25)',
          stagger: 0.01,
        },
        0.45
      );

      tl.to(
        menuLinksChars,
        {
          duration: 0.75,
          opacity: 1,
          ease: 'power2.out',
          stagger: 0.01,
        },
        0.45
      );
    };

    const closeMenu = () => {
      if (isAnimating) return;
      isAnimating = true;
      gsap.set(menuBg, { attr: { d: CLOSE_START } });

      gsap.to(navToggleClose, { duration: 0.3, opacity: 0, ease: 'none' });
      gsap.to(navToggleMenu, { duration: 0.3, opacity: 1, ease: 'none', delay: 0.25 });

      const tl = gsap.timeline({
        onComplete: () => {
          menu.classList.remove('is-open');
          gsap.set(menuBg, { attr: { d: OPEN_HIDDEN } });
          splits.forEach((split) => {
            gsap.set(split.chars, { opacity: 0, x: '750%' });
          });
          gsap.set(menuLinks, { opacity: 1 });
          gsap.set(menuInfoItems, { opacity: 0, y: 100 });
          isAnimating = false;
        },
      });

      tl.to(menuLogo, { duration: 0.3, opacity: 0 })
        .to(menuLinks, { duration: 0.3, opacity: 0 }, '<')
        .to(menuInfoItems, { duration: 0.3, opacity: 0 }, '<');

      tl.to(menuBg, { duration: 0.5, attr: { d: CLOSE_BULGE }, ease: 'power3.in' }, '<').to(
        menuBg,
        { duration: 0.5, attr: { d: CLOSE_HIDDEN }, ease: 'power3.out' }
      );
    };

    const toggleMenu = () => {
      isOpen ? closeMenu() : openMenu();
      isOpen = !isOpen;
    };

    navToggle.addEventListener('click', toggleMenu);

    return () => {
      navToggle.removeEventListener('click', toggleMenu);
    };
  }, []);

  return (
    <div ref={navToggleRef} className="nav-toggle">
      <p className="nav-toggle-menu">MENU</p>
      <p className="nav-toggle-close">CLOSE</p>

      <div ref={menuRef} className="menu">
        <svg
          className="menu-bg-svg"
          viewBox="0 0 1131 861"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref={menuBgRef}
            id="menu-path"
            fill="#f0f0f0"
            d="M1131,0 Q565.5,0 0,0 L0,0 L1131,0 Z"
          />
        </svg>

        <div className="menu-logo">
          <img src="/favicon.svg" alt="SPRDLX" />
        </div>

        <div className="menu-col menu-col-info">
          <p>Get in touch</p>
          <h3>hello@sprdlx.com</h3>
          <br />
          <h6>Hyderabad, India</h6>
        </div>

        <div className="menu-col menu-col-links">
          <a href="/">HOME</a>
          <a href="/projects">PROJECTS</a>
          <a href="/about">ABOUT</a>
          <a href="/contact">CONTACT</a>
        </div>
      </div>
    </div>
  );
}

export default MenuOverlay;
