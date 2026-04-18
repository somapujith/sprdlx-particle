import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  useTexture,
  Float,
  PresentationControls,
} from '@react-three/drei';
import * as THREE from 'three';
import { SRGBColorSpace } from 'three';
import { useDevicePerformance } from '../../hooks/useDevicePerformance';
import MacbookModel from './MacbookModel';

interface FloatingInteractiveMacbookProps {
  textureUrl: string;
  scale: number;
  position: [number, number, number];
}

function FloatingInteractiveMacbook({
  textureUrl,
  scale,
  position,
}: FloatingInteractiveMacbookProps) {
  const texture = useTexture(textureUrl) as THREE.Texture;
  const { isLowEnd } = useDevicePerformance();

  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;

    return () => {
      texture.dispose();
    };
  }, [texture]);

  return (
    <PresentationControls
      global={false}
      cursor={true}
      snap={true}
      speed={1.5}
      zoom={1}
      rotation={[0.1, 0.2, 0]}
      polar={[-Math.PI / 5, Math.PI / 5]}
      azimuth={[-Math.PI / 3, Math.PI / 3]}
    >
      <Float
        rotationIntensity={isLowEnd ? 0.2 : 0.6}
        floatIntensity={isLowEnd ? 0.5 : 1.5}
        speed={isLowEnd ? 1.5 : 2.5}
      >
        <MacbookModel texture={texture} position={position} scale={scale} />
      </Float>
    </PresentationControls>
  );
}

interface OptimizedMacbookSceneProps {
  textureUrl: string;
  position?: [number, number, number];
  scale?: number;
}

export function OptimizedMacbookScene({
  textureUrl,
  position = [0, -0.7, 0],
  scale = 0.19,
}: OptimizedMacbookSceneProps) {
  const { isLowEnd } = useDevicePerformance();

  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      dpr={isLowEnd ? 1 : [1, 1.5]}
      gl={{
        alpha: true,
        antialias: !isLowEnd,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <ambientLight intensity={isLowEnd ? 0.5 : 0.7} />
      <Environment preset={isLowEnd ? 'apartment' : 'city'} />

      <Suspense fallback={null}>
        <FloatingInteractiveMacbook
          textureUrl={textureUrl}
          position={position}
          scale={scale}
        />
      </Suspense>

      {!isLowEnd && (
        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.6}
          scale={28}
          blur={2.4}
          far={5}
          resolution={256}
        />
      )}
    </Canvas>
  );
}
