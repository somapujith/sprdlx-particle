import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Effects } from '@react-three/drei';
import { UnrealBloomPass } from 'three-stdlib';
import * as THREE from 'three';
import gsap from 'gsap';

extend({ UnrealBloomPass });

const BODY = 26000;
const STARS = 3200;

/** Surface of ellipsoid — one shell, avoids stacking thousands on the same ray (additive blow-out). */
function fillEllipsoidSurface(
  out: Float32Array,
  start: number,
  count: number,
  cx: number,
  cy: number,
  cz: number,
  rx: number,
  ry: number,
  rz: number
) {
  for (let i = 0; i < count; i++) {
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;
    let z = Math.random() * 2 - 1;
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    x /= len;
    y /= len;
    z /= len;
    const j = (start + i) * 3;
    out[j] = cx + x * rx;
    out[j + 1] = cy + y * ry;
    out[j + 2] = cz + z * rz;
  }
}

/** Fibonacci sphere — evenly distributed points on sphere surface. */
function fillSphere(out: Float32Array, start: number, count: number, cx: number, cy: number, cz: number, r: number) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1 || 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const j = (start + i) * 3;
    out[j] = cx + r * Math.cos(theta) * rad;
    out[j + 1] = cy + r * y;
    out[j + 2] = cz + r * Math.sin(theta) * rad;
  }
}

function buildHumanoid(): { positions: Float32Array; randoms: Float32Array } {
  const positions = new Float32Array(BODY * 3);
  const randoms = new Float32Array(BODY);
  for (let i = 0; i < BODY; i++) randoms[i] = Math.random();

  let offset = 0;
  const headN = 8000;
  fillSphere(positions, offset, headN, 0, 1.45, 0, 0.52);
  offset += headN;

  const torsoN = 15000;
  fillEllipsoidSurface(positions, offset, torsoN, 0, -0.25, 0, 0.82, 1.12, 0.4);
  offset += torsoN;

  const armN = 1500;
  fillEllipsoidSurface(positions, offset, armN, -0.78, 0.12, 0, 0.28, 0.48, 0.2);
  offset += armN;
  fillEllipsoidSurface(positions, offset, armN, 0.78, 0.12, 0, 0.28, 0.48, 0.2);

  return { positions, randoms };
}

function buildStars(): { positions: Float32Array; twinkle: Float32Array } {
  const positions = new Float32Array(STARS * 3);
  const twinkle = new Float32Array(STARS);
  for (let i = 0; i < STARS; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    const rad = 55 + Math.random() * 75;
    const j = i * 3;
    positions[j] = rad * Math.sin(phi) * Math.cos(theta);
    positions[j + 1] = rad * Math.sin(phi) * Math.sin(theta);
    positions[j + 2] = rad * Math.cos(phi);
    twinkle[i] = Math.random();
  }
  return { positions, twinkle };
}

/** Cosmic / tech humanoid: flow-field trails, white–blue–orange palette, starfield. */
function CosmicHuman() {
  const bodyRef = useRef<THREE.Points>(null);
  const starsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  const bodyData = useMemo(() => buildHumanoid(), []);
  const starData = useMemo(() => buildStars(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uMouse: { value: new THREE.Vector3(9999, 9999, 9999) },
    }),
    []
  );

  const starUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useEffect(() => {
    gsap.to(uniforms.uProgress, {
      value: 1,
      duration: 3.8,
      ease: 'power2.out',
    });
  }, [uniforms]);

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const targetMouse = useMemo(() => new THREE.Vector3(9999, 9999, 9999), []);
  const rayHit = useMemo(() => new THREE.Vector3(), []);

  const bodyGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(bodyData.positions, 3));
    g.setAttribute('aRandom', new THREE.BufferAttribute(bodyData.randoms, 1));
    return g;
  }, [bodyData]);

  const starGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(starData.positions, 3));
    g.setAttribute('aTwinkle', new THREE.BufferAttribute(starData.twinkle, 1));
    return g;
  }, [starData]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.07) * 0.18 + t * 0.04;
      groupRef.current.rotation.x = -0.08 + Math.sin(t * 0.05) * 0.04;
    }
    if (bodyRef.current) {
      const m = bodyRef.current.material as THREE.ShaderMaterial;
      m.uniforms.uTime.value = t;
      targetMouse.set(9999, 9999, 9999);
      if (state.pointer.x !== 0 || state.pointer.y !== 0) {
        raycaster.setFromCamera(state.pointer, state.camera);
        if (raycaster.ray.intersectPlane(plane, rayHit)) targetMouse.copy(rayHit);
      }
      m.uniforms.uMouse.value.lerp(targetMouse, 0.07);
    }
    if (starsRef.current) {
      (starsRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
      starsRef.current.rotation.y = t * 0.012;
    }
  });

  return (
    <group ref={groupRef} rotation={[-0.1, 0.2, 0]}>
      <points ref={starsRef} geometry={starGeom}>
        <shaderMaterial
          transparent
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          uniforms={starUniforms}
          vertexShader={`
            uniform float uTime;
            attribute float aTwinkle;
            varying float vA;
            void main() {
              vA = 0.12 + aTwinkle * 0.35 + 0.08 * sin(uTime * 2.0 + aTwinkle * 40.0);
              vec4 mv = modelViewMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * mv;
              gl_PointSize = (1.2 + aTwinkle * 2.0) * (18.0 / max(-mv.z, 0.25));
            }
          `}
          fragmentShader={`
            varying float vA;
            void main() {
              float d = length(gl_PointCoord - 0.5);
              if (d > 0.5) discard;
              float s = smoothstep(0.5, 0.1, d);
              gl_FragColor = vec4(vec3(0.85, 0.9, 1.0), s * vA);
            }
          `}
        />
      </points>

      <points ref={bodyRef} geometry={bodyGeom} renderOrder={1}>
        <shaderMaterial
          transparent
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={`
          uniform float uTime;
          uniform float uProgress;
          uniform vec3 uMouse;
          attribute float aRandom;
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            vec3 base = position;
            float t = uTime;
            float trail = smoothstep(1.1, -2.6, base.y);
            
            vec3 flow = vec3(
              sin(base.y * 2.4 + t * 1.15) * cos(base.z * 1.9 + t * 0.3),
              cos(base.x * 2.1 - t * 0.88) * sin(base.y * 1.65 + t * 0.4),
              sin(base.x * 1.75 + base.y * 1.45 + t * 1.02)
            );
            vec3 pos = base + flow * (0.22 + trail * 0.85);
            pos.x += trail * sin(base.y * 5.8 + t * 1.25) * 0.28;
            pos.z += trail * cos(base.x * 4.8 + t * 0.95) * 0.22;
            pos.y -= trail * 0.2 * sin(base.x * 3.0 + t);
            
            float pr = smoothstep(0.0, 1.0, uProgress);
            pos *= mix(0.04, 1.0, pr);
            
            float md = distance(pos, uMouse);
            float mx = 3.8;
            if (md < mx) {
              vec3 dir = normalize(pos - uMouse);
              pos += dir * smoothstep(mx, 0.0, md) * 1.85;
            }
            
            float headGlow = smoothstep(0.15, 2.0, base.y);
            float core = smoothstep(0.8, 2.0, base.y) * (1.0 - trail);
            vec3 c = mix(vec3(0.18, 0.42, 0.95), vec3(0.72, 0.78, 0.95), headGlow);
            c = mix(c, vec3(0.95, 0.42, 0.18), trail * (0.45 + 0.35 * aRandom));
            c = mix(c, vec3(0.55, 0.22, 0.85), (1.0 - headGlow) * 0.12 * sin(aRandom * 6.2831853 + base.y * 2.0));
            c *= 0.55 + 0.25 * core + 0.2 * headGlow;
            c = min(c, vec3(0.92));
            
            vColor = c;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            float sizeAtten = (0.65 + aRandom * 1.15) * (11.0 / max(-mvPosition.z, 0.35)) * pr;
            gl_PointSize = max(1.5, sizeAtten);
            vAlpha = (0.09 + aRandom * 0.2) * pr;
          }
        `}
          fragmentShader={`
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float soft = smoothstep(0.5, 0.12, d);
            float alpha = soft * vAlpha;
            vec3 core = vColor * smoothstep(0.35, 0.0, d) * 0.35;
            vec3 rim = vec3(0.35, 0.55, 1.0) * smoothstep(0.5, 0.22, d) * 0.18;
            vec3 finalColor = vColor * soft + core + rim;
            gl_FragColor = vec4(min(finalColor, vec3(1.0)), alpha);
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
      camera={{ position: [0, 0.2, 17.5], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#000000']} />
      <CosmicHuman />
      <Effects disableGamma>
        <unrealBloomPass args={[bloomResolution, 0.42, 0.35, 0.22]} />
      </Effects>
    </Canvas>
  );
}
