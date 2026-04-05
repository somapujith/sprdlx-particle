import React, { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
const GLB_URL = '/earthquakes_-_2000_to_2019.glb';
/** Final cap after merge; data GLBs can have millions of verts — sampling avoids freezing the tab. */
const MAX_POINTS = 120_000;
/** Max samples taken per geometry chunk before global merge (prevents multi‑minute main-thread stalls). */
const MAX_SAMPLES_PER_GEOMETRY = 45_000;

/** Merge vertex positions from meshes, point clouds, and lines (world space). */
function buildParticleGeometry(root: THREE.Object3D): THREE.BufferGeometry {
  const tmp: number[] = [];
  const v = new THREE.Vector3();
  root.updateMatrixWorld(true);
  root.traverse((child) => {
    const isGeomObject =
      child instanceof THREE.Mesh ||
      child instanceof THREE.Points ||
      child instanceof THREE.Line ||
      child instanceof THREE.LineSegments ||
      child instanceof THREE.LineLoop;
    if (!isGeomObject) return;
    const geom = child.geometry;
    const pos = geom.attributes.position as THREE.BufferAttribute | undefined;
    if (!pos) return;
    child.updateWorldMatrix(true, false);
    const stride =
      pos.count > MAX_SAMPLES_PER_GEOMETRY
        ? Math.ceil(pos.count / MAX_SAMPLES_PER_GEOMETRY)
        : 1;
    for (let i = 0; i < pos.count; i += stride) {
      v.fromBufferAttribute(pos, i).applyMatrix4(child.matrixWorld);
      tmp.push(v.x, v.y, v.z);
    }
  });

  const n = tmp.length / 3;
  if (n === 0) {
    console.warn(
      '[EarthquakeParticleHero] No vertices found in GLB (no meshes/points/lines). Using fallback sphere.',
    );
    const g = new THREE.IcosahedronGeometry(2.2, 5);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      tmp.push(pos.getX(i), pos.getY(i), pos.getZ(i));
    }
    g.dispose();
  }

  const n2 = tmp.length / 3;
  let stride = 1;
  if (n2 > MAX_POINTS) stride = Math.ceil(n2 / MAX_POINTS);

  const out: number[] = [];
  for (let i = 0; i < n2; i += stride) {
    out.push(tmp[i * 3], tmp[i * 3 + 1], tmp[i * 3 + 2]);
  }

  const geo = new THREE.BufferGeometry();
  const posArr = new Float32Array(out);
  geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));

  const seeds = new Float32Array(out.length / 3);
  for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

  return geo;
}

function centerAndScale(root: THREE.Object3D): { scale: number; center: THREE.Vector3 } {
  const box = new THREE.Box3().setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 1e-6);
  const scale = 4.2 / maxDim;
  return { scale, center };
}

const particleUniforms = {
  uTime: { value: 0 },
};

function EarthquakeParticlesInner() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(GLB_URL);

  const geometry = useMemo(() => {
    try {
      const clone = scene.clone(true);
      const { scale: s, center: c } = centerAndScale(clone);
      clone.position.sub(c);
      clone.scale.setScalar(s);
      clone.updateMatrixWorld(true);
      const geo = buildParticleGeometry(clone);
      geo.computeBoundingSphere();
      return geo;
    } catch (e) {
      console.error('[EarthquakeParticleHero] Geometry build failed', e);
      const g = new THREE.IcosahedronGeometry(2.2, 4);
      const pos = g.attributes.position as THREE.BufferAttribute;
      const seeds = new Float32Array(pos.count);
      for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
      g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
      g.computeBoundingSphere();
      return g;
    }
  }, [scene]);

  useLayoutEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  useFrame((state, delta) => {
    particleUniforms.uTime.value += delta;
    const g = groupRef.current;
    if (!g) return;

    g.rotation.y += delta * 0.11;

    const px = state.pointer.x;
    const py = state.pointer.y;
    const tx = py * 0.22;
    const ty = -px * 0.18;
    g.rotation.x += (tx - g.rotation.x) * 0.04;
    g.rotation.z += (ty - g.rotation.z) * 0.035;

    const mx = px * 0.35;
    const my = py * 0.22;
    g.position.x += (mx - g.position.x) * 0.035;
    g.position.y += (my - g.position.y) * 0.035;
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          transparent
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          uniforms={particleUniforms}
          vertexShader={`
            uniform float uTime;
            attribute float aSeed;
            varying vec3 vColor;
            varying float vAlpha;
            void main() {
              vec3 p = position;
              float h = atan(p.x, p.z) / 6.2831853 + 0.5;
              float lat = asin(clamp(p.y / max(length(p), 0.001), -1.0, 1.0));
              float gold = step(0.94, fract(aSeed * 43758.5453123)) * 0.42;
              vec3 cerulean = vec3(0.06, 0.28, 0.58);
              vec3 cyan = vec3(0.15, 0.82, 0.95);
              vec3 goldRgb = vec3(0.95, 0.78, 0.38);
              vec3 base = mix(cerulean, cyan, 0.38 + 0.32 * sin(h * 6.2831853 + uTime * 0.15));
              base = mix(base, vec3(0.12, 0.45, 0.72), 0.15 + 0.1 * sin(lat * 4.0 + uTime * 0.25));
              vColor = mix(base, goldRgb, gold);
              float flicker = 0.88 + 0.12 * sin(uTime * 2.4 + aSeed * 38.0);
              vAlpha = flicker;
              vec4 mv = modelViewMatrix * vec4(p, 1.0);
              gl_Position = projectionMatrix * mv;
              float ps = (1.4 + aSeed * 1.8) * (320.0 / max(-mv.z, 0.85));
              gl_PointSize = clamp(ps, 1.2, 14.0);
            }
          `}
          fragmentShader={`
            varying vec3 vColor;
            varying float vAlpha;
            void main() {
              float d = length(gl_PointCoord - 0.5);
              if (d > 0.5) discard;
              float s = smoothstep(0.5, 0.04, d);
              vec3 c = vColor * vAlpha * 1.35;
              gl_FragColor = vec4(c, s * 0.62);
            }
          `}
        />
      </points>
    </group>
  );
}

export default function EarthquakeParticleHero() {
  return (
    <Canvas
      className="h-full min-h-dvh w-full touch-none"
      camera={{ position: [0, 0.4, 9.5], fov: 42 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.25;
      }}
    >
      <color attach="background" args={['#020308']} />
      <ambientLight intensity={0.08} />
      <Suspense fallback={null}>
        <EarthquakeParticlesInner />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(GLB_URL);

