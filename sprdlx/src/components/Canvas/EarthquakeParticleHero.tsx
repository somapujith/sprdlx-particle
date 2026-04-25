import React, { useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function RotatingGlobe() {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshPhongMaterial
        color="#0066ff"
        emissive="#001a4d"
        shininess={100}
      />
    </mesh>
  );
}

function VolumetricAtmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[3.8, 32, 32]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          void main() {
            float fresnel = pow(1.0 - abs(dot(vNormal, normalize(vec3(0, 0, 1)))), 2.0);
            vec3 glow = vec3(0.2, 0.8, 1.0) * fresnel * 0.3;
            gl_FragColor = vec4(glow, fresnel * 0.2);
          }
        `}
      />
    </mesh>
  );
}

function EarthquakeScene({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <VolumetricAtmosphere />
      <RotatingGlobe />
    </>
  );
}

export default function EarthquakeParticleHero({ onReady }: { onReady?: () => void }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 1);
      }}
      style={{ background: '#000000' }}
    >
      <Suspense fallback={null}>
        <EarthquakeScene onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
