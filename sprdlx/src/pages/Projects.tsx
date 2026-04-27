import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import './projects/styles.css';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
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
      workSection?.appendChild(gridCanvas);
      const gridCtx = gridCanvas.getContext("2d");

      const resizeGridCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        gridCanvas.width = window.innerWidth * dpr;
        gridCanvas.height = window.innerHeight * dpr;
        gridCanvas.style.width = `${window.innerWidth}px`;
        gridCanvas.style.height = `${window.innerHeight}px`;
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

      const lettersScene = new THREE.Scene();
      const lettersCamera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      lettersCamera.position.z = 20;

      const lettersRenderer = new THREE.WebGLRenderer({
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
            new THREE.Vector3(
              -25 + 50 * t,
              yPos + Math.sin(t * Math.PI) * -amplitude,
              (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5
            )
          );
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)),
          new THREE.LineBasicMaterial({ color: 0x000, linewidth: 1 })
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
      const animate = () => {
        updateLetterPositions();
        updateCardsPosition();
        lettersRenderer.render(lettersScene, lettersCamera);
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
        },
      });

      drawGrid(0);
      animate();
      updateTargetPositions(0);

      const handleResize = () => {
        resizeGridCanvas();
        const triggers = ScrollTrigger.getAll();
        const mainTrigger = triggers.find(t => t.trigger === document.querySelector('.work'));
        
        drawGrid(mainTrigger?.progress || 0);
        lettersCamera.aspect = window.innerWidth / window.innerHeight;
        lettersCamera.updateProjectionMatrix();
        lettersRenderer.setSize(window.innerWidth, window.innerHeight);
        updateTargetPositions(mainTrigger?.progress || 0);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
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
      <section className="work" ref={workRef}>
        <div className="text-container"></div>
        <div className="cards">
          <div className="card" onClick={() => navigate('/project/pulp')} style={{ cursor: 'pointer' }}>
            <div className="card-img"><img src="/projects/assets/img1.jpg" alt="" /></div>
            <div className="card-copy">
              <p>Pulp</p>
              <p>2024</p>
            </div>
          </div>
          <div className="card" onClick={() => navigate('/project/esthetic-insights')} style={{ cursor: 'pointer' }}>
            <div className="card-img"><img src="/projects/assets/img2.jpg" alt="" /></div>
            <div className="card-copy">
              <p>Esthetic Insights</p>
              <p>2025</p>
            </div>
          </div>
          <div className="card" onClick={() => navigate('/project/anthill')} style={{ cursor: 'pointer' }}>
            <div className="card-img"><img src="/projects/assets/img3.jpg" alt="" /></div>
            <div className="card-copy">
              <p>Anthill</p>
              <p>2026</p>
            </div>
          </div>
          <div className="card" onClick={() => navigate('/project/volery')} style={{ cursor: 'pointer' }}>
            <div className="card-img"><img src="/projects/assets/img4.jpg" alt="" /></div>
            <div className="card-copy">
              <p>Volery</p>
              <p>2024</p>
            </div>
          </div>
          <div className="card" onClick={() => navigate('/project/alpha')} style={{ cursor: 'pointer' }}>
            <div className="card-img"><img src="/projects/assets/img5.jpg" alt="" /></div>
            <div className="card-copy">
              <p>Alpha</p>
              <p>2025</p>
            </div>
          </div>
          <div className="card" onClick={() => navigate('/project/jay')} style={{ cursor: 'pointer' }}>
            <div className="card-img"><img src="/projects/assets/img6.jpg" alt="" /></div>
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
