import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import MenuOverlay from '../components/Canvas/MenuOverlay';
import './infinite-parallax.css';

type Project = {
  title: string;
  image: string;
  category: string;
  year: string;
  projectId: string;
  isAvailable?: boolean;
  objectPosition?: string;
};

const projectData: Project[] = [
  { title: 'Anthill', image: '/projects/assets/anthill4.png', category: 'AI VC Venture', year: '2025', projectId: 'anthill' },
  {
    title: 'Pulp',
    image: '/projects/pulp/hero.png',
    category: 'Skin Care Brand',
    year: '2025',
    projectId: 'pulp',
    objectPosition: '50% 25%',
  },
  {
    title: 'Esthetic Insights',
    image: '/projects/esthetic-insights/gallery-2.png',
    category: 'Designed for Visionaries',
    year: '2024',
    projectId: 'esthetic-insights',
  },
  { title: 'Volery', image: '/projects/Upcoming.png', category: 'Upcoming', year: '2024', projectId: 'volery', isAvailable: false },
  { title: 'Jay', image: '/projects/Upcoming.png', category: 'Upcoming', year: '2024', projectId: 'jay', isAvailable: false },
];

const config = {
  SCROLL_SPEED: 0.75,
  LERP_FACTOR: 0.05,
  BUFFER_SIZE: 5,
  MAX_VELOCITY: 150,
  SNAP_DURATION: 500,
};

const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

export default function InfiniteParallax() {
  const listRef = useRef<HTMLUListElement>(null);
  const minimapPreviewRef = useRef<HTMLDivElement>(null);
  const minimapInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = window as unknown as { lenisInstance?: { stop: () => void; start: () => void } };
    w.lenisInstance?.stop();
    return () => w.lenisInstance?.start();
  }, []);

  useEffect(() => {
    const listEl = listRef.current;
    const minimapPreviewEl = minimapPreviewRef.current;
    const minimapInfoEl = minimapInfoRef.current;
    if (!listEl || !minimapPreviewEl || !minimapInfoEl) return;

    const state = {
      currentY: 0,
      targetY: 0,
      isDragging: false,
      projects: new Map<number, { el: HTMLDivElement; parallax: { update: (scroll: number, index: number) => void } }>(),
      minimap: new Map<number, { el: HTMLDivElement; parallax: { update: (scroll: number, index: number) => void } }>(),
      minimapInfo: new Map<number, { el: HTMLDivElement }>(),
      projectHeight: window.innerHeight,
      minimapHeight: 250,
      isSnapping: false,
      snapStart: { time: 0, y: 0, target: 0 },
      lastScrollTime: Date.now(),
      dragStart: { y: 0, scrollY: 0 },
      rafId: 0,
    };

    const createParallax = (img: HTMLImageElement, height: number) => {
      let current = 0;
      return {
        update: (scroll: number, index: number) => {
          const target = (-scroll - index * height) * 0.2;
          current = lerp(current, target, 0.1);
          if (Math.abs(current - target) > 0.01) {
            img.style.transform = `translateY(${current}px) scale(1.5)`;
          }
        },
      };
    };

    const getProjectData = (index: number) => {
      const i = ((Math.abs(index) % projectData.length) + projectData.length) % projectData.length;
      return projectData[i];
    };

    const createElement = (index: number, type: 'main' | 'minimap' | 'info') => {
      const maps = {
        main: state.projects,
        minimap: state.minimap,
        info: state.minimapInfo,
      };
      if (maps[type].has(index)) return;

      const data = getProjectData(index);
      const num = ((((Math.abs(index) % projectData.length) + projectData.length) % projectData.length) + 1)
        .toString()
        .padStart(2, '0');

      if (type === 'main') {
        const el = document.createElement('div');
        el.className = 'parallax-project';
        el.innerHTML = `<img src="${data.image}" alt="${data.title}" />`;
        if (data.isAvailable !== false) {
          el.style.cursor = 'pointer';
          el.addEventListener('click', () => {
            window.location.assign(`/project/${data.projectId}`);
          });
        } else {
          el.style.cursor = 'default';
        }
        const mainImg = el.querySelector('img') as HTMLImageElement;
        if (data.objectPosition) mainImg.style.objectPosition = data.objectPosition;
        listEl.appendChild(el);
        state.projects.set(index, {
          el,
          parallax: createParallax(mainImg, state.projectHeight),
        });
      } else if (type === 'minimap') {
        const el = document.createElement('div');
        el.className = 'minimap-img-item';
        el.innerHTML = `<img src="${data.image}" alt="${data.title}" />`;
        const miniImg = el.querySelector('img') as HTMLImageElement;
        if (data.objectPosition) miniImg.style.objectPosition = data.objectPosition;
        minimapPreviewEl.appendChild(el);
        state.minimap.set(index, {
          el,
          parallax: createParallax(miniImg, state.minimapHeight),
        });
      } else {
        const el = document.createElement('div');
        el.className = 'minimap-item-info';
        el.innerHTML = `
          <div class="minimap-item-info-row">
            <p>${num}</p>
            <p>${data.title}</p>
          </div>
          <div class="minimap-item-info-row">
            <p>${data.category}</p>
            <p>${data.year}</p>
          </div>
        `;
        minimapInfoEl.appendChild(el);
        state.minimapInfo.set(index, { el });
      }
    };

    for (let i = -config.BUFFER_SIZE; i <= config.BUFFER_SIZE; i++) {
      createElement(i, 'main');
      createElement(i, 'minimap');
      createElement(i, 'info');
    }

    const syncElements = () => {
      const current = Math.round(-state.targetY / state.projectHeight);
      const min = current - config.BUFFER_SIZE;
      const max = current + config.BUFFER_SIZE;

      for (let i = min; i <= max; i++) {
        createElement(i, 'main');
        createElement(i, 'minimap');
        createElement(i, 'info');
      }

      [state.projects, state.minimap, state.minimapInfo].forEach((map) => {
        map.forEach((item, index) => {
          if (index < min || index > max) {
            item.el.remove();
            map.delete(index);
          }
        });
      });
    };

    const snapToProject = () => {
      state.isSnapping = true;
      state.snapStart.time = Date.now();
      state.snapStart.y = state.targetY;
      state.snapStart.target = -Math.round(-state.targetY / state.projectHeight) * state.projectHeight;
    };

    const updateSnap = () => {
      const progress = Math.min((Date.now() - state.snapStart.time) / config.SNAP_DURATION, 1);
      const eased = 1 - (1 - progress) ** 3;
      state.targetY = state.snapStart.y + (state.snapStart.target - state.snapStart.y) * eased;
      if (progress >= 1) state.isSnapping = false;
    };

    const updatePositions = () => {
      const minimapY = (state.currentY * state.minimapHeight) / state.projectHeight;

      state.projects.forEach((item, index) => {
        const y = index * state.projectHeight + state.currentY;
        item.el.style.transform = `translateY(${y}px)`;
        item.parallax.update(state.currentY, index);
      });

      state.minimap.forEach((item, index) => {
        const y = index * state.minimapHeight + minimapY;
        item.el.style.transform = `translateY(${y}px)`;
        item.parallax.update(minimapY, index);
      });

      state.minimapInfo.forEach((item, index) => {
        item.el.style.transform = `translateY(${index * state.minimapHeight + minimapY}px)`;
      });
    };

    const animate = () => {
      const now = Date.now();
      if (!state.isSnapping && !state.isDragging && now - state.lastScrollTime > 100) {
        const snapPoint = -Math.round(-state.targetY / state.projectHeight) * state.projectHeight;
        if (Math.abs(state.targetY - snapPoint) > 1) snapToProject();
      }

      if (state.isSnapping) updateSnap();
      if (!state.isDragging) state.currentY += (state.targetY - state.currentY) * config.LERP_FACTOR;

      syncElements();
      updatePositions();
      state.rafId = window.requestAnimationFrame(animate);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      state.isSnapping = false;
      state.lastScrollTime = Date.now();
      const delta = Math.max(Math.min(e.deltaY * config.SCROLL_SPEED, config.MAX_VELOCITY), -config.MAX_VELOCITY);
      state.targetY -= delta;
    };

    const onTouchStart = (e: TouchEvent) => {
      state.isDragging = true;
      state.isSnapping = false;
      state.dragStart = { y: e.touches[0].clientY, scrollY: state.targetY };
      state.lastScrollTime = Date.now();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!state.isDragging) return;
      state.targetY = state.dragStart.scrollY + (e.touches[0].clientY - state.dragStart.y) * 1.5;
      state.lastScrollTime = Date.now();
    };

    const onTouchEnd = () => {
      state.isDragging = false;
    };

    const onResize = () => {
      state.projectHeight = window.innerHeight;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('resize', onResize);
    animate();

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      window.cancelAnimationFrame(state.rafId);
      listEl.innerHTML = '';
      minimapPreviewEl.innerHTML = '';
      minimapInfoEl.innerHTML = '';
    };
  }, []);

  return (
    <div className="parallax-container">
      <MenuOverlay />
      <Link to="/" className="parallax-logo-link" aria-label="Go to home">
        <img src="/favicon.svg" alt="SPRDLX" className="parallax-logo" />
      </Link>
      <ul className="project-list" ref={listRef} />
      <div className="minimap">
        <div className="minimap-wrapper">
          <div className="minimap-img-preview" ref={minimapPreviewRef} />
          <div className="minimap-info-list" ref={minimapInfoRef} />
        </div>
      </div>
    </div>
  );
}

