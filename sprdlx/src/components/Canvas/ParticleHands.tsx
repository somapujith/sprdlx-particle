import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Effects } from '@react-three/drei';
import { UnrealBloomPass } from 'three-stdlib';
import * as THREE from 'three';
import gsap from 'gsap';

extend({ UnrealBloomPass });

const COUNT = 42000;

/** Lewis-style rose: dense spiral bloom, ember core → gold edges (reference look). */
function RoseParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  const particleData = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const randoms = new Float32Array(COUNT);
    const colorObj = new THREE.Color();

    const scale = 13.5;
    const petals = 6;
    const depth = 8.5;

    for (let i = 0; i < COUNT; i++) {
      const p = i / COUNT;
      const angle = i * 2.399963229728653;
      const radius = Math.sqrt(p) * scale;

      const petalShape = Math.pow(Math.abs(Math.sin(angle * petals * 0.5)), 0.75);
      const r = radius * (0.38 + 0.62 * petalShape);

      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      const z = Math.sin(p * Math.PI) * depth - radius * 0.75;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const distXY = Math.sqrt(x * x + y * y);
      const norm = Math.min(distXY / (scale * 1.05), 1);
      const coreBoost = Math.max(0, 1 - distXY / (scale * 0.22));

      // Ember core → warm gold rim (reference: red/orange center, amber edges)
      const hue = 0.02 + norm * 0.095;
      const sat = 0.92 - norm * 0.1;
      let light = 0.94 * Math.pow(1 - norm, 1.35) + 0.2 * norm + coreBoost * 0.22;
      light = Math.min(1, light);

      colorObj.setHSL(hue, sat, light);

      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;

      randoms[i] = Math.random();
    }

    return { positions, colors, randoms };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uMouse: { value: new THREE.Vector3(9999, 9999, 9999) },
    }),
    []
  );

  useEffect(() => {
    gsap.to(uniforms.uProgress, {
      value: 1,
      duration: 4.2,
      ease: 'power2.out',
    });
  }, [uniforms]);

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const targetMouse = useMemo(() => new THREE.Vector3(9999, 9999, 9999), []);
  const rayHit = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!pointsRef.current || !groupRef.current) return;
    const material = pointsRef.current.material as THREE.ShaderMaterial;
    const t = state.clock.elapsedTime;
    material.uniforms.uTime.value = t;

    // Cinematic hero: slow drift (reference: stable, not fast spin)
    groupRef.current.rotation.z = t * 0.042;
    groupRef.current.rotation.x = -0.28 + Math.sin(t * 0.11) * 0.04;
    groupRef.current.rotation.y = Math.sin(t * 0.09) * 0.05;

    targetMouse.set(9999, 9999, 9999);
    if (state.pointer.x !== 0 || state.pointer.y !== 0) {
      raycaster.setFromCamera(state.pointer, state.camera);
      if (raycaster.ray.intersectPlane(plane, rayHit)) targetMouse.copy(rayHit);
    }
    material.uniforms.uMouse.value.lerp(targetMouse, 0.08);
  });

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(particleData.colors, 3));
    g.setAttribute('aRandom', new THREE.BufferAttribute(particleData.randoms, 1));
    return g;
  }, [particleData]);

  return (
    <group ref={groupRef} rotation={[-Math.PI / 5.2, 0.1, 0]}>
        <points ref={pointsRef} renderOrder={0} geometry={geometry}>
        <shaderMaterial
          transparent
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          vertexColors
          uniforms={uniforms}
          vertexShader={`
          uniform float uTime;
          uniform float uProgress;
          uniform vec3 uMouse;
          attribute float aRandom;
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            vColor = color;
            vec3 pos = position;
            
            float bloomOffset = length(pos) * 0.085;
            float prog = clamp((uProgress - bloomOffset) * 2.0, 0.0, 1.0);
            
            float angle = (1.0 - prog) * 4.5 * aRandom;
            float s = sin(angle);
            float c = cos(angle);
            vec3 tempPos = pos;
            pos.x = tempPos.x * c - tempPos.y * s;
            pos.y = tempPos.x * s + tempPos.y * c;
            
            pos *= prog;
            pos.z -= (1.0 - prog) * 22.0;
            
            float breath = sin(length(pos) * 0.48 - uTime * 1.85) * 0.16;
            pos.z += breath;
            
            float mouseDist = distance(pos, uMouse);
            float maxDist = 3.2;
            if (mouseDist < maxDist) {
              vec3 dir = normalize(pos - uMouse);
              float force = smoothstep(maxDist, 0.0, mouseDist);
              pos += dir * force * 1.65;
            }
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            float sizeAtten = (1.1 + aRandom * 1.9) * (28.0 / -mvPosition.z) * prog;
            gl_PointSize = sizeAtten;
            
            vAlpha = (0.28 + aRandom * 0.72) * prog;
          }
        `}
          fragmentShader={`
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            
            float soft = smoothstep(0.5, 0.08, d);
            float alpha = soft * vAlpha;
            
            vec3 core = vec3(1.0) * smoothstep(0.22, 0.0, d) * 0.65;
            vec3 rim = vec3(1.0, 0.92, 0.75) * smoothstep(0.45, 0.2, d) * 0.35;
            vec3 finalColor = vColor + core + rim;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `}
        />
      </points>
    </group>
  );
}

const bloomResolution = new THREE.Vector2(256, 256);

export default function ParticleHands() {
  return (
    <Canvas
      camera={{ position: [0, 0.35, 19.5], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#000000']} />
      <RoseParticles />
      <Effects disableGamma>
        <unrealBloomPass args={[bloomResolution, 0.85, 0.5, 0]} />
      </Effects>
    </Canvas>
  );
}
