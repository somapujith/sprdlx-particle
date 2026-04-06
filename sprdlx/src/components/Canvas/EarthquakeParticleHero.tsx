import React, { useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useGLTF, Effects, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three-stdlib';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

extend({ UnrealBloomPass });

// ============================================================================
// ENHANCEMENT 1: VOLUMETRIC ATMOSPHERE - Rayleigh Scattering Halo
// ============================================================================
function VolumetricAtmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[3.8, 64, 64]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
        }}
        side={THREE.BackSide}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vViewDirection;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vViewDirection = normalize(cameraPosition - worldPos.xyz);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vViewDirection;
          
          void main() {
            // Rayleigh scattering: edge shimmer based on view angle
            float fresnel = pow(1.0 - abs(dot(vNormal, vViewDirection)), 3.0);
            
            // Multi-layer atmospheric density with time-based pulsing
            float atmosphereStrength = 0.15;
            float pulse = sin(uTime * 0.5) * 0.5 + 0.5;
            float fogDensity = (0.12 + pulse * 0.08) * fresnel;
            
            // Aurora-like color gradient: cyan to blue to aurora green
            vec3 color1 = vec3(0.1, 0.8, 1.0);  // Cyan
            vec3 color2 = vec3(0.4, 0.2, 0.8);  // Purple-blue
            vec3 color3 = vec3(0.2, 0.6, 0.4);  // Aurora green
            
            vec3 finalColor = mix(color1, color2, fresnel * 0.5);
            finalColor = mix(finalColor, color3, abs(sin(uTime * 0.3)) * 0.3);
            
            // Soft edge fade with layered depth
            float edgeFade = smoothstep(1.0, 0.3, fresnel);
            float alpha = fogDensity * edgeFade * atmosphereStrength;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `}
      />
    </mesh>
  );
}

// ============================================================================
// ENHANCEMENT 2: DYNAMIC PARTICLE LINKING - GPU-based Hot Spot Network
// ============================================================================
interface LinkingNetworkProps {
  positions: Float32Array;
  hots: Float32Array;
}

function ParticleLinkingNetwork({ positions, hots }: LinkingNetworkProps) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const linkUniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

  useEffect(() => {
    if (!linesRef.current || !positions) return;

    // Extract hot particle positions (reduce to ~500-1000 hot spots for perf)
    const hotIndices: number[] = [];
    for (let i = 0; i < hots.length; i++) {
      if (hots[i] > 0.5) hotIndices.push(i);
    }

    // Sample hot spots if too many
    const sampledHots: number[] = [];
    const step = Math.max(1, Math.floor(hotIndices.length / 600));
    for (let i = 0; i < hotIndices.length; i += step) {
      sampledHots.push(hotIndices[i]);
    }

    // Build line segments connecting nearby hot spots
    const linePositions: number[] = [];
    const maxDist = 2.0;
    const maxLinksPerPoint = 3;

    for (let i = 0; i < sampledHots.length; i++) {
      const idx1 = sampledHots[i];
      const p1x = positions[idx1 * 3];
      const p1y = positions[idx1 * 3 + 1];
      const p1z = positions[idx1 * 3 + 2];

      let linkCount = 0;
      for (let j = i + 1; j < sampledHots.length && linkCount < maxLinksPerPoint; j++) {
        const idx2 = sampledHots[j];
        const p2x = positions[idx2 * 3];
        const p2y = positions[idx2 * 3 + 1];
        const p2z = positions[idx2 * 3 + 2];

        const dx = p2x - p1x;
        const dy = p2y - p1y;
        const dz = p2z - p1z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist > 0.1 && dist < maxDist) {
          linePositions.push(p1x, p1y, p1z);
          linePositions.push(p2x, p2y, p2z);
          linkCount++;
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));

    linesRef.current.geometry = geometry;
  }, [positions, hots]);

  useFrame((state) => {
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.uTime.value = state.clock.elapsedTime;
      }
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={linkUniforms}
        vertexShader={`
          uniform float uTime;
          varying float vDist;
          
          void main() {
            vDist = mod(float(gl_VertexID), 2.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying float vDist;
          
          void main() {
            // Pulsing glow along lines
            float pulse = sin(uTime * 4.0 + vDist * 10.0) * 0.5 + 0.5;
            
            // Neon orange-red gradient
            vec3 colorStart = vec3(1.0, 0.4, 0.1);
            vec3 colorEnd = vec3(1.0, 0.1, 0.0);
            vec3 lineColor = mix(colorStart, colorEnd, pulse);
            
            float alpha = 0.4 * pulse;
            gl_FragColor = vec4(lineColor, alpha);
          }
        `}
      />
    </lineSegments>
  );
}

// ============================================================================
// MAIN COMPONENT: ENHANCED EARTHQUAKE PARTICLES
// ============================================================================
function EarthquakeParticles() {
  const glbUrl = `${import.meta.env.BASE_URL}earthquakes_-_2000_to_2019.optimized.glb`;
  const { scene } = useGLTF(glbUrl);

  const particleData = useMemo(() => {
    scene.updateMatrixWorld(true);

    const normalizedScalar = (value: number, array: ArrayLike<number>): number => {
      if (array instanceof Int8Array) return Math.max(value / 127, -1);
      if (array instanceof Uint8Array) return value / 255;
      if (array instanceof Int16Array) return Math.max(value / 32767, -1);
      if (array instanceof Uint16Array) return value / 65535;
      if (array instanceof Int32Array) return Math.max(value / 2147483647, -1);
      if (array instanceof Uint32Array) return value / 4294967295;
      return value;
    };

    const toFloat32Attribute = (attr: THREE.BufferAttribute): THREE.BufferAttribute => {
      const src = attr.array;
      const out = new Float32Array(attr.count * attr.itemSize);

      if (attr.normalized && !(src instanceof Float32Array)) {
        for (let i = 0; i < attr.count; i++) {
          const base = i * attr.itemSize;
          out[base] = normalizedScalar(attr.getX(i), src);
          if (attr.itemSize > 1) out[base + 1] = normalizedScalar(attr.getY(i), src);
          if (attr.itemSize > 2) out[base + 2] = normalizedScalar(attr.getZ(i), src);
          if (attr.itemSize > 3) out[base + 3] = normalizedScalar(attr.getW(i), src);
        }
      } else {
        for (let i = 0; i < attr.count; i++) {
          const base = i * attr.itemSize;
          out[base] = attr.getX(i);
          if (attr.itemSize > 1) out[base + 1] = attr.getY(i);
          if (attr.itemSize > 2) out[base + 2] = attr.getZ(i);
          if (attr.itemSize > 3) out[base + 3] = attr.getW(i);
        }
      }

      return new THREE.BufferAttribute(out, attr.itemSize, false);
    };

    const dequantizeGeometry = (geometry: THREE.BufferGeometry): THREE.BufferGeometry => {
      const position = geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
      if (position && (position.normalized || !(position.array instanceof Float32Array))) {
        geometry.setAttribute('position', toFloat32Attribute(position));
      }

      const color = geometry.getAttribute('color') as THREE.BufferAttribute | undefined;
      if (color && (color.normalized || !(color.array instanceof Float32Array))) {
        geometry.setAttribute('color', toFloat32Attribute(color));
      }

      const normal = geometry.getAttribute('normal') as THREE.BufferAttribute | undefined;
      if (normal && (normal.normalized || !(normal.array instanceof Float32Array))) {
        geometry.setAttribute('normal', toFloat32Attribute(normal));
      }

      return geometry;
    };

    const geometries: THREE.BufferGeometry[] = [];

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const geom = dequantizeGeometry(mesh.geometry.clone());
        geom.applyMatrix4(mesh.matrixWorld);
        geometries.push(geom);
      } else if ((child as THREE.Points).isPoints) {
        const pt = child as THREE.Points;
        const geom = dequantizeGeometry(pt.geometry.clone());
        geom.applyMatrix4(pt.matrixWorld);
        geometries.push(geom);
      }
    });

    if (geometries.length === 0) return null;

    const merged = BufferGeometryUtils.mergeGeometries(geometries);

    merged.computeBoundingSphere();
    const center = merged.boundingSphere?.center || new THREE.Vector3();
    const radius = merged.boundingSphere?.radius || 1;
    merged.translate(-center.x, -center.y, -center.z);

    const scaleFactor = 3.5 / radius;
    merged.scale(scaleFactor, scaleFactor, scaleFactor);
    merged.computeVertexNormals();

    const posAttribute = merged.getAttribute('position');
    const colorAttr = merged.getAttribute('color');

    // Optimization: Reduced to 20k since points are now much larger and highly visible
    const MAX_POINTS = 20000;

    const points: number[] = [];
    const colors: number[] = [];
    const normals: number[] = [];

    if (posAttribute.count < 50000 && geometries.some(g => g.index)) {
      try {
        const tempMesh = new THREE.Mesh(merged, new THREE.MeshBasicMaterial());
        const sampler = new MeshSurfaceSampler(tempMesh).build();
        const count = MAX_POINTS;
        const pos = new THREE.Vector3();
        const nor = new THREE.Vector3();
        const col = new THREE.Color();

        for (let i = 0; i < count; i++) {
          sampler.sample(pos, nor, col);
          points.push(pos.x, pos.y, pos.z);
          normals.push(nor.x, nor.y, nor.z);
          const hasColor = colorAttr && (col.r > 0 || col.g > 0 || col.b > 0);
          if (hasColor) {
            colors.push(col.r, col.g, col.b);
          } else {
            colors.push(0.05, 0.4, 0.9);
          }
        }
      } catch (e) {
        console.warn("Sampler failed, falling back to vertices", e);
        fallbackToVertices();
      }
    } else {
      fallbackToVertices();
    }

    function fallbackToVertices() {
      const normAttr = merged.getAttribute('normal');
      const step = posAttribute.count > MAX_POINTS ? Math.ceil(posAttribute.count / MAX_POINTS) : 1;
      for (let i = 0; i < posAttribute.count; i += step) {
        points.push(posAttribute.getX(i), posAttribute.getY(i), posAttribute.getZ(i));
        if (normAttr) {
          normals.push(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));
        } else {
          normals.push(0, 1, 0);
        }
        if (colorAttr) {
          colors.push(colorAttr.getX(i), colorAttr.getY(i), colorAttr.getZ(i));
        } else {
          colors.push(0.05, 0.4, 0.9);
        }
      }
    }

    const positions = new Float32Array(points);
    const colorsArray = new Float32Array(colors);
    const normalsArray = new Float32Array(normals);
    const randoms = new Float32Array(positions.length / 3);
    const sizes = new Float32Array(positions.length / 3);
    const hots = new Float32Array(positions.length / 3);

    const tmpColor = new THREE.Color();

    for (let i = 0; i < randoms.length; i++) {
      randoms[i] = Math.random();

      const r = colorsArray[i * 3];
      const g = colorsArray[i * 3 + 1];
      const b = colorsArray[i * 3 + 2];
      const isHot = (r > 0.5 && b < 0.3) ? 1.0 : 0.0;
      hots[i] = isHot;

      const px = positions[i * 3];
      const py = positions[i * 3 + 1];
      const pz = positions[i * 3 + 2];
      const len = Math.max(1e-6, Math.sqrt(px * px + py * py + pz * pz));
      const lon = Math.atan2(pz, px);
      const lon01 = (lon / (Math.PI * 2) + 1) % 1;
      const lat = Math.asin(Math.max(-1, Math.min(1, py / len)));
      const lat01 = lat / Math.PI + 0.5;

      if (isHot === 0.0) {
        const hue = (0.55 + lon01 * 0.55 + lat01 * 0.12 + randoms[i] * 0.03) % 1;
        const sat = 0.92;
        const light = Math.min(0.62, 0.18 + 0.28 * Math.sin(lat01 * Math.PI) + randoms[i] * 0.08);
        tmpColor.setHSL(hue, sat, Math.max(0.12, light));
        colorsArray[i * 3] = tmpColor.r;
        colorsArray[i * 3 + 1] = tmpColor.g;
        colorsArray[i * 3 + 2] = tmpColor.b;
        sizes[i] = 0.8 + randoms[i] * 0.6;
      } else {
        const hue = 0.03 + randoms[i] * 0.04;
        tmpColor.setHSL(hue, 1.0, 0.62);
        colorsArray[i * 3] = tmpColor.r;
        colorsArray[i * 3 + 1] = tmpColor.g;
        colorsArray[i * 3 + 2] = tmpColor.b;
        sizes[i] = 1.35;
      }
    }

    return { positions, colorsArray, normalsArray, randoms, sizes, hots };
  }, [scene]);

  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const scrollTarget = useRef(0);
  const scrollSmoothed = useRef(0);

  useEffect(() => {
    const readScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      if (max > 0) {
          scrollTarget.current = Math.min(1, Math.max(0, window.scrollY / max));
      }
    };

    readScroll();
    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', readScroll);
    return () => {
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', readScroll);
    };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(9999, 9999, 9999) },
    uChromaticAberration: { value: 0 },
    uHoverState: { value: 0 },
  }), []);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const targetMouse = useMemo(() => new THREE.Vector3(9999, 9999, 9999), []);
  const invWorldMatrix = useMemo(() => new THREE.Matrix4(), []);
  const localRay = useMemo(() => new THREE.Ray(), []);
  const localHit = useMemo(() => new THREE.Vector3(), []);
  const localSphere = useMemo(() => new THREE.Sphere(new THREE.Vector3(0, 0, 0), 3.5), []);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      scrollSmoothed.current += (scrollTarget.current - scrollSmoothed.current) * 0.08;
      const s = scrollSmoothed.current;

      groupRef.current.rotation.y = t * 0.08 + s * 0.35;
      groupRef.current.rotation.z = Math.sin(t * 0.05) * 0.1 + s * 0.05;
      groupRef.current.rotation.x = 0.2 + Math.sin(t * 0.08) * 0.1 - s * 0.18;
      groupRef.current.position.y = -s * 0.25;
      
      // Crucial: Update the matrix world immediately after changing transforms
      // so the raycaster inverse matrix is perfectly aligned with the current frame's visual state.
      groupRef.current.updateMatrixWorld();

      if (pointsRef.current) {
          const mat = pointsRef.current.material as THREE.ShaderMaterial;
          if (mat.uniforms) {
            mat.uniforms.uTime.value = t;
          }
    
          targetMouse.set(9999, 9999, 9999);
          raycaster.setFromCamera(state.pointer, state.camera);
    
          invWorldMatrix.copy(groupRef.current.matrixWorld).invert();
          localRay.copy(raycaster.ray).applyMatrix4(invWorldMatrix);
          
          let isHit = false;
          if (localRay.intersectSphere(localSphere, localHit)) {
            targetMouse.copy(localHit);
            isHit = true;
          }
    
          if (isHit) {
            // Smoothly move mouse target when inside
            mat.uniforms.uMouse.value.lerp(targetMouse, 0.1);
            mat.uniforms.uHoverState.value += (1.0 - mat.uniforms.uHoverState.value) * 0.1;
          } else {
            // Fade out the hover effect, don't sweep the mouse wildly
            mat.uniforms.uHoverState.value += (0.0 - mat.uniforms.uHoverState.value) * 0.1;
          }
    
          // Dynamic chromatic aberration based on mouse proximity
          const mouseDistToCenter = isHit ? targetMouse.length() : 3.5;
          const abeIntensity = Math.max(0, 1 - mouseDistToCenter / 3.5) * 0.8;
          mat.uniforms.uChromaticAberration.value += (abeIntensity - mat.uniforms.uChromaticAberration.value) * 0.1;
      }

      // Update atmosphere
      if (atmosphereRef.current) {
        const atmoMat = atmosphereRef.current.material as THREE.ShaderMaterial;
        if (atmoMat.uniforms) {
          atmoMat.uniforms.uTime.value = t;
        }
      }
    }
  });

  if (!particleData) return null;

  return (
    <group ref={groupRef}>
      {/* ENHANCEMENT 1: Atmospheric halo */}
      <mesh ref={atmosphereRef}>
        <VolumetricAtmosphere />
      </mesh>

      {/* Main particles with enhanced shaders */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particleData.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[particleData.colorsArray, 3]} />
          <bufferAttribute attach="attributes-normal" args={[particleData.normalsArray, 3]} />
          <bufferAttribute attach="attributes-aRandom" args={[particleData.randoms, 1]} />
          <bufferAttribute attach="attributes-aSize" args={[particleData.sizes, 1]} />
          <bufferAttribute attach="attributes-aHot" args={[particleData.hots, 1]} />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={`
            uniform float uTime;
            uniform vec3 uMouse;
            uniform float uChromaticAberration;
            uniform float uHoverState;
            attribute vec3 color;
            attribute float aRandom;
            attribute float aSize;
            attribute float aHot;
            varying vec3 vColor;
            varying float vAlpha;
            varying float vChromaticShift;
            
            vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
            float snoise(vec2 v){
              const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
              vec2 i  = floor(v + dot(v, C.yy) );
              vec2 x0 = v -   i + dot(i, C.xx);
              vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
              vec4 x12 = x0.xyxy + C.xxzz;
              x12.xy -= i1;
              i = mod(i, 289.0);
              vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                    + i.x + vec3(0.0, i1.x, 1.0 ));
              vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
              m = m*m;
              m = m*m;
              vec3 x = 2.0 * fract(p * C.www) - 1.0;
              vec3 h = abs(x) - 0.5;
              vec3 ox = floor(x + 0.5);
              vec3 a0 = x - ox;
              m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
              vec3 g;
              g.x  = a0.x  * x0.x  + h.x  * x0.y;
              g.yz = a0.yz * x12.xz + h.yz * x12.yw;
              return 130.0 * dot(m, g);
            }

            void main() {
              vColor = color;
              vec3 pos = position;
              float isHot = aHot;
              
              float noise = snoise(vec2(pos.x * 2.0 + uTime * 0.2, pos.y * 2.0 + uTime * 0.2));
              float pulse = sin(uTime * 3.0 + aRandom * 20.0) * 0.5 + 0.5;
              
              if (isHot > 0.0) {
                float erupt = pow(pulse, 3.0) * 0.3 * aRandom;
                pos += normalize(pos) * erupt;
                vColor += vec3(0.5, 0.2, 0.0) * pulse;
              } else {
                pos += normal * noise * 0.05;
              }
              
              float d = distance(pos, uMouse);
              if (d < 2.0 && uHoverState > 0.01) {
                vec3 dir = normalize(pos - uMouse);
                float force = smoothstep(2.0, 0.0, d) * uHoverState;
                pos += dir * force * 0.8;
                vColor = mix(vColor, vec3(1.0, 1.0, 1.0), force * 0.5);
              }
              
              // ENHANCEMENT 3: Depth-based expansion for parallax effect
              float depthParallax = (1.0 - aRandom) * 0.15;
              pos *= (1.0 + depthParallax * uChromaticAberration);
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_Position = projectionMatrix * mvPosition;
              
              // Chromatic shift varies by depth and randomness
              vChromaticShift = (depthParallax + aRandom * 0.3) * uChromaticAberration;
              
              float baseSize = mix(1.0, 3.0, aRandom);
              float hotSizeMultiplier = 1.0 + (isHot * 2.0 * pulse);
              gl_PointSize = baseSize * hotSizeMultiplier * (15.0 / -mvPosition.z);
              
              vAlpha = mix(0.3 + aRandom * 0.4, 0.7 + pulse * 0.3, isHot);
              if (d < 2.0 && uHoverState > 0.01) {
                 float force = smoothstep(2.0, 0.0, d) * uHoverState;
                 vAlpha += force * 0.5;
              }
            }
          `}
          fragmentShader={`
            varying vec3 vColor;
            varying float vAlpha;
            varying float vChromaticShift;
            
            void main() {
              float d = length(gl_PointCoord - 0.5);
              if (d > 0.5) discard;
              
              float soft = smoothstep(0.5, 0.05, d);
              float core = smoothstep(0.2, 0.0, d);
              
              // ENHANCEMENT 3: Chromatic aberration - RGB channel splitting
              vec3 aberratedColor = vColor;
              
              if (vChromaticShift > 0.01) {
                float offset = vChromaticShift * 0.03;
                vec2 coord = gl_PointCoord - 0.5;
                
                // Sample RGB channels at slightly offset positions
                float r = vColor.r * smoothstep(0.5, 0.05, length(coord + vec2(offset, 0.0)));
                float g = vColor.g * (soft + core * 0.5);
                float b = vColor.b * smoothstep(0.5, 0.05, length(coord - vec2(offset, 0.0)));
                
                aberratedColor = vec3(r, g, b);
              }
              
              gl_FragColor = vec4(aberratedColor * 1.5, soft * vAlpha * 1.5);
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
      camera={{ position: [0, 0, 7.5], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        <EarthquakeParticles />
      </Suspense>
    </Canvas>
  );
}