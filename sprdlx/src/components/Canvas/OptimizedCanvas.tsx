import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useDevicePerformance } from '../../hooks/useDevicePerformance';

interface OptimizedCanvasProps {
  children: React.ReactNode;
  onCreated?: (state: any) => void;
}

export function OptimizedCanvas({ children, onCreated }: OptimizedCanvasProps) {
  const { isLowEnd, maxFPS } = useDevicePerformance();
  const [isTabActive, setIsTabActive] = useState(true);
  const frameRef = useRef(0);
  const lastFrameTime = useRef(0);

  useEffect(() => {
    const handleVisibility = () => {
      setIsTabActive(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      dpr={isLowEnd ? 1 : [1, 1.5]}
      frameloop={isTabActive ? 'always' : 'demand'}
      gl={{
        alpha: true,
        antialias: !isLowEnd,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
        precision: isLowEnd ? 'lowp' : 'mediump',
      }}
      onCreated={(state) => {
        state.gl.setClearColor(0x000000, 0);
        if (onCreated) onCreated(state);

        // Frame rate limiter
        const originalSetAnimationLoop = state.gl.setAnimationLoop.bind(state.gl);
        state.gl.setAnimationLoop = (callback: FrameRequestCallback) => {
          const fps = Math.min(maxFPS, 60);
          const frameTime = 1000 / fps;

          return originalSetAnimationLoop((now: number) => {
            if (now - lastFrameTime.current >= frameTime) {
              callback(now);
              lastFrameTime.current = now;
            }
          });
        };
      }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      {children}
    </Canvas>
  );
}
