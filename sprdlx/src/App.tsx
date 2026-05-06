import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Home from './pages/Home';
import LoadingScreen from './components/Common/LoadingScreen';
import ScrollToTop from './components/Common/ScrollToTop';
import { PageTransition } from './components/Common/PageTransition';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { AppBootstrapProvider } from './context/AppBootstrapContext';

const AboutCgKin = lazy(() =>
  import(/* webpackChunkName: "about-kin" */ './pages/aboutCgKin/AboutCgKin'),
);
const InfiniteParallax = lazy(() =>
  import(/* webpackChunkName: "infinite-parallax" */ './pages/InfiniteParallax'),
);
const Projects = lazy(() => import(/* webpackChunkName: "projects" */ './pages/Projects'));
const Teams = lazy(() => import(/* webpackChunkName: "teams" */ './pages/Teams'));
const ProjectDetail = lazy(() => import(/* webpackChunkName: "project-detail" */ './pages/ProjectDetail'));
const Contact = lazy(() => import(/* webpackChunkName: "contact" */ './pages/Contact'));

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
      <AppBootstrapProvider isBootLoaderComplete={!isLoading}>
        <Router>
          <ScrollToTop />
          <PageTransition />
          <ErrorBoundary>
            <Suspense fallback={<div className="fixed inset-0 bg-black z-50" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutCgKin />} />
                <Route path="/about/kin" element={<Navigate to="/about" replace />} />
                <Route path="/projects/parallax" element={<InfiniteParallax />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Router>
      </AppBootstrapProvider>
    </>
  );
}
