import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scene, PerspectiveCamera, WebGLRenderer, CatmullRomCurve3, BufferGeometry, Line, LineBasicMaterial, Vector3 } from 'three';
import './projects/styles.css';
import { useSEO } from '../hooks/useSEO';
import { projects } from './projects/data';

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
    url: `https://sprdlx.com/project/${p.id}`,
    image: `https://sprdlx.com${p.image}`,
    genre: p.industry,
    dateCreated: String(p.year),
  })),
};

export default function Projects() {
  useSEO({
    title: 'Projects — SPRDLX Portfolio | Immersive Digital Experiences',
    description: 'Explore SPRDLX portfolio: immersive web experiences, design systems, and digital products built for Y Combinator, Sequoia, and Techstars-backed startups.',
    canonical: '/projects',
    schema: PROJECTS_SCHEMA,
  });
  const workRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (window as any).lenisInstance?.start();

    const initAnimation = () => {
      const workSection = document.querySelector(".work");
      const cardsContainer = document.querySelector(".cards");
      const moveDistance = window.innerWidth * 5;
      let currentXPosition = 0;

      const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

      const gridCanvas = document.createElement("canvas");
      gridCanvas.id = "grid-canvas";
      gridCanvas.style.position = "absolute";
      gridCanvas.style.top = "0";
      gridCanvas.style.left = "0";
      gridCanvas.style.zIndex = "-1";
      gridCanvas.style.pointerEvents = "none";
      workSection?.appendChild(gridCanvas);
      const gridCtx = gridCanvas.getContext("2d");

      const resizeGridCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        gridCanvas.width = width * dpr;
        gridCanvas.height = height * dpr;
        gridCanvas.style.width = `${width}px`;
        gridCanvas.style.height = `${height}px`;
        gridCtx?.scale(dpr, dpr);
      };
      resizeGridCanvas();

      const drawGrid = (scrollProgress = 0) => {
        if (!gridCtx) return;
        gridCtx.fillStyle = "black";
        gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
        gridCtx.fillStyle = "#ffffff";
        const dotSize = 1;
        const spacing = 30;
        const rows = Math.ceil(gridCanvas.height / spacing);
        const cols = Math.ceil(gridCanvas.width / spacing) + 15;
        const offset = (scrollProgress * spacing * 10) % spacing;

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            gridCtx.beginPath();
            gridCtx.arc(x * spacing - offset, y * spacing, dotSize, 0, Math.PI * 2);
            gridCtx.fill();
          }
        }
      };

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
          new LineBasicMaterial({ color: 0x000, linewidth: 1 })
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

      const textContainer = document.querySelector(".text-container");
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
        const mainTrigger = triggers.find(t => t.trigger === document.querySelector('.work'));
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
        trigger: ".work",
        start: "top top",
        end: "+=700%",
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          updateTargetPositions(self.progress);
          drawGrid(self.progress);
          shouldRender = true;
        },
      });

      drawGrid(0);
      animate();
      updateTargetPositions(0);

      let resizeTimeout: ReturnType<typeof setTimeout>;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          resizeGridCanvas();
          const triggers = ScrollTrigger.getAll();
          const mainTrigger = triggers.find(t => t.trigger === document.querySelector('.work'));

          drawGrid(mainTrigger?.progress || 0);
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
        lettersRenderer.dispose();
      };
    };

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(initAnimation, 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="projects-container">
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-pulse">
        <div className="text-white text-sm font-mono uppercase tracking-widest text-center">
          Scroll to explore
        </div>
      </div>
      <section className="work" ref={workRef}>
        <div className="text-container"></div>
        <div className="cards">
          <div className="card" onClick={() => navigate('/project/pulp')} style={{ cursor: 'pointer' }}>
            <div className="card-img"><img src="/projects/assets/img1.jpg" alt="Pulp project" width={300} height={300} loading="lazy" /></div>
            <div className="card-copy">
              <p>Pulp</p>
              <p>2024</p>
            </div>
          </div>
          <div className="card" onClick={() => navigate('/project/esthetic-insights')} style={{ cursor: 'pointer' }}>
            <div className="card-img"><img src="/projects/assets/img2.jpg" alt="Esthetic Insights project" width={300} height={300} loading="lazy" /></div>
            <div className="card-copy">
              <p>Esthetic Insights</p>
              <p>2025</p>
            </div>
          </div>
          <div className="card" onClick={() => navigate('/project/anthill')} style={{ cursor: 'pointer' }}>
            <div className="card-img"><img src="/projects/assets/img3.jpg" alt="Anthill project" width={300} height={300} loading="lazy" /></div>
            <div className="card-copy">
              <p>Anthill</p>
              <p>2026</p>
            </div>
          </div>
          <div className="card" onClick={() => navigate('/project/volery')} style={{ cursor: 'pointer' }}>
            <div className="card-img"><img src="/projects/assets/img4.jpg" alt="Volery project" width={300} height={300} loading="lazy" /></div>
            <div className="card-copy">
              <p>Volery</p>
              <p>2024</p>
            </div>
          </div>
          <div className="card" onClick={() => navigate('/project/alpha')} style={{ cursor: 'pointer' }}>
            <div className="card-img"><img src="/projects/assets/img5.jpg" alt="Alpha project" width={300} height={300} loading="lazy" /></div>
            <div className="card-copy">
              <p>Alpha</p>
              <p>2025</p>
            </div>
          </div>
          <div className="card" onClick={() => navigate('/project/jay')} style={{ cursor: 'pointer' }}>
            <div className="card-img"><img src="/projects/assets/img6.jpg" alt="Jay project" width={300} height={300} loading="lazy" /></div>
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
