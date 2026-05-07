import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scene, PerspectiveCamera, WebGLRenderer, CatmullRomCurve3, BufferGeometry, Line, LineBasicMaterial, Vector3 } from 'three';
import './projects.css';
import { useSEO } from '../../hooks/useSEO';
import { useMotif } from '../../hooks/useMotif';
import { projects } from './projects-data';
import { HardwareAccelerationWarning } from '../../components/HardwareAccelerationWarning';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'SPRDLX Projects — Portfolio',
  description: 'Explore SPRDLX portfolio: immersive web experiences, design systems, and digital products built for Y Combinator, Sequoia, and Techstars-backed startups.',
  url: 'https://sprdlx.com/projects',
  hasPart: projects.map((p) => ({
    '@type': 'CreativeWork',
    name: p.title,
    description: p.desc,
    url: `https://sprdlx.com/projects/${p.id}`,
    image: `https://sprdlx.com${p.image}`,
    genre: p.industry,
    dateCreated: String(p.year),
  })),
};

export default function Projects() {
  useMotif('chrome');
  useSEO({
    title: 'Projects — SPRDLX Portfolio | Immersive Digital Experiences',
    description: 'Explore SPRDLX portfolio: immersive web experiences, design systems, and digital products built for Y Combinator, Sequoia, and Techstars-backed startups.',
    canonical: '/projects',
    schema: PROJECTS_SCHEMA,
  });
  const workRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    (window as any).lenisInstance?.start();

    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch {
        return false;
      }
    };

    if (!checkWebGLSupport()) {
      setHasWebGL(false);
      return;
    }

    const initAnimation = () => {
      const workSection = workRef.current;
      const cardsContainer = cardsRef.current;
      const moveDistance = window.innerWidth * 5;
      let currentXPosition = 0;

      const lerp = (start: number, end: number, t: number) => start + (end - start) * t;


      const lettersScene = new Scene();
      const lettersCamera = new PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      lettersCamera.position.z = 20;

      const lettersRenderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      lettersRenderer.setSize(window.innerWidth, window.innerHeight);
      lettersRenderer.setClearColor(0x000000, 0);
      lettersRenderer.setPixelRatio(window.devicePixelRatio);
      lettersRenderer.domElement.id = "letters-canvas";
      workSection?.appendChild(lettersRenderer.domElement);

      const createTextAnimationPath = (yPos: number, amplitude: number) => {
        const points = [];
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          points.push(
            new Vector3(
              -25 + 50 * t,
              yPos + Math.sin(t * Math.PI) * -amplitude,
              (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5
            )
          );
        }
        const curve = new CatmullRomCurve3(points);
        const line = new Line(
          new BufferGeometry().setFromPoints(curve.getPoints(100)),
          new LineBasicMaterial({ color: 0xa8acb8, linewidth: 1 })
        );
        (line as any).curve = curve;
        return line;
      };

      const path = [
        createTextAnimationPath(10, 2),
        createTextAnimationPath(3.5, 1),
        createTextAnimationPath(-3.5, -1),
        createTextAnimationPath(-10, -2),
      ];
      path.forEach((line) => lettersScene.add(line));

      const textContainer = textContainerRef.current;
      const letterPositions = new Map();
      path.forEach((line, i) => {
        (line as any).letterElements = Array.from({ length: 15 }, () => {
          const el = document.createElement("div");
          el.className = "letter";
          el.textContent = ["W", "O", "R", "K"][i];
          textContainer?.appendChild(el);
          letterPositions.set(el, {
            current: { x: 0, y: 0 },
            target: { x: 0, y: 0 },
          });
          return el;
        });
      });

      const lineSpeedMultipliers = [0.8, 1, 0.7, 0.9];
      const updateTargetPositions = (scrollProgress = 0) => {
        path.forEach((line, lineIndex) => {
          (line as any).letterElements.forEach((element: HTMLElement, i: number) => {
            const point = (line as any).curve.getPoint(
              (i / 14 + scrollProgress * lineSpeedMultipliers[lineIndex]) % 1
            );
            const vector = point.clone().project(lettersCamera);
            const positions = letterPositions.get(element);
            positions.target = {
              x: (-vector.x * 0.5 + 0.5) * window.innerWidth,
              y: (-vector.y * 0.5 + 0.5) * window.innerHeight,
            };
          });
        });
      };

      const updateLetterPositions = () => {
        letterPositions.forEach((positions, element: HTMLElement) => {
          const distX = positions.target.x - positions.current.x;
          if (Math.abs(distX) > window.innerWidth * 0.7) {
            positions.current.x = positions.target.x;
            positions.current.y = positions.target.y;
          } else {
            positions.current.x = lerp(
              positions.current.x,
              positions.target.x,
              0.07
            );
            positions.current.y = lerp(
              positions.current.y,
              positions.target.y,
              0.07
            );
          }
          element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0px)`;
        });
      };

      const updateCardsPosition = () => {
        const triggers = ScrollTrigger.getAll();
        const mainTrigger = triggers.find(t => t.trigger === workRef.current);
        const targetX = -moveDistance * (mainTrigger?.progress || 0);
        currentXPosition = lerp(currentXPosition, targetX, 0.07);
        gsap.set(cardsContainer, {
          x: currentXPosition,
        });
      };

      let animationFrameId: number;
      let shouldRender = false;
      const animate = () => {
        updateLetterPositions();
        updateCardsPosition();
        if (shouldRender) {
          lettersRenderer.render(lettersScene, lettersCamera);
        }
        animationFrameId = requestAnimationFrame(animate);
      };

      const scrollTrigger = ScrollTrigger.create({
        trigger: workRef.current ?? ".work",
        start: "top top",
        end: "+=700%",
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          updateTargetPositions(self.progress);
          shouldRender = true;
        },
      });

      animate();
      updateTargetPositions(0);

      let resizeTimeout: ReturnType<typeof setTimeout>;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          const triggers = ScrollTrigger.getAll();
          const mainTrigger = triggers.find(t => t.trigger === workRef.current);
          lettersCamera.aspect = window.innerWidth / window.innerHeight;
          lettersCamera.updateProjectionMatrix();
          lettersRenderer.setSize(window.innerWidth, window.innerHeight);
          updateTargetPositions(mainTrigger?.progress || 0);
        }, 150);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(resizeTimeout);
        scrollTrigger?.kill();
        cancelAnimationFrame(animationFrameId);
        lettersScene.children.slice().forEach((child) => {
          const line = child as Line;
          if (line.geometry) line.geometry.dispose();
          if (line.material) {
            if (Array.isArray(line.material)) {
              line.material.forEach((m) => m.dispose());
            } else {
              (line.material as LineBasicMaterial).dispose();
            }
          }
        });
        lettersScene.clear();
        lettersRenderer.dispose();
        if (textContainerRef.current) {
          textContainerRef.current.innerHTML = '';
        }
      };
    };

    const timeout = setTimeout(initAnimation, 0);
    return () => clearTimeout(timeout);
  }, []);

  if (!hasWebGL) {
    return <HardwareAccelerationWarning />;
  }

  return (
    <div className="projects-container">
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-pulse">
        <div className="text-[color:var(--color-text)] text-sm font-mono uppercase tracking-widest text-center opacity-80">
          Scroll to explore
        </div>
      </div>
      <section className="work" ref={workRef}>
        <div className="text-container" ref={textContainerRef}></div>
        <div className="cards" ref={cardsRef}>
          <div className="card" onClick={() => navigate('/projects/pulp')} style={{ cursor: 'pointer' }}>
            <div className="card-img"><img src="/projects/pulp/hero.png" alt="Pulp project" width={300} height={300} loading="lazy" /></div>
            <div className="card-copy">
              <p>Pulp</p>
              <p>2024</p>
            </div>
          </div>
          <div className="card" onClick={() => navigate('/projects/esthetic-insights')} style={{ cursor: 'pointer' }}>
            <div className="card-img"><img src="/projects/assets/img2.jpg" alt="Esthetic Insights project" width={300} height={300} loading="lazy" /></div>
            <div className="card-copy">
              <p>Esthetic Insights</p>
              <p>2025</p>
            </div>
          </div>
          <div className="card" onClick={() => navigate('/projects/anthill')} style={{ cursor: 'pointer' }}>
            <div className="card-img"><img src="/projects/assets/img3.jpg" alt="Anthill project" width={300} height={300} loading="lazy" /></div>
            <div className="card-copy">
              <p>Anthill</p>
              <p>2026</p>
            </div>
          </div>
          <div className="card" style={{ cursor: 'default' }}>
            <div className="card-img"><img src="/projects/Upcoming.png" alt="Volery project upcoming" width={300} height={300} loading="lazy" /></div>
            <div className="card-copy">
              <p>Volery</p>
              <p>2024</p>
            </div>
          </div>
          <div className="card" onClick={() => navigate('/projects/alpha')} style={{ cursor: 'pointer' }}>
            <div className="card-img"><img src="/projects/assets/img5.jpg" alt="Alpha project" width={300} height={300} loading="lazy" /></div>
            <div className="card-copy">
              <p>Alpha</p>
              <p>2025</p>
            </div>
          </div>
          <div className="card" style={{ cursor: 'default' }}>
            <div className="card-img"><img src="/projects/Upcoming.png" alt="Jay project upcoming" width={300} height={300} loading="lazy" /></div>
            <div className="card-copy">
              <p>Jay</p>
              <p>2026</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
