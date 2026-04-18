import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Home from './pages/Home';
// Lazy load About route — reduce initial bundle by ~80KB
const About = lazy(() => import('./pages/About'));
import LoadingScreen from './components/LoadingScreen';
import { CustomCursor } from './components/ui/CustomCursor';
import ScrollToTop from './components/ScrollToTop';

declare global {
  interface Window {
    lenisInstance?: Lenis;
  }
}

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    window.lenisInstance = lenis;

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="app-loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      <Router>
        <ScrollToTop />
        <CustomCursor />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/about"
            element={
              <Suspense fallback={<div className="bg-black w-screen h-screen" />}>
                <About />
              </Suspense>
            }
          />
        </Routes>
      </Router>
    </>
  );
}
