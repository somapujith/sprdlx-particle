import React, { useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useGLTF, Effects, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three-stdlib';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

extend({ UnrealBloomPass });

function EarthquakeParticles() {
  // Load the GLB file
  const glbUrl = `${import.meta.env.BASE_URL}earthquakes_-_2000_to_2019.optimized.glb`;
  const { scene } = useGLTF(glbUrl);
  
  const particleData = useMemo(() => {
    // Ensure world matrices are computed before we read/apply them.
    scene.updateMatrixWorld(true);

    const normalizedScalar = (value: number, array: ArrayLike<number>): number => {
      // Map integer vertex attribute values into float ranges when the source accessor is normalized.
      // See: glTF accessor.normalized and KHR_mesh_quantization.
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
      // Convert normalized integer attributes (e.g. i16_norm/u8_norm) into Float32 attributes.
      // This is required because we do CPU-side merging, centering, and sampling.
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
    
    // Center & Auto-Scale
    merged.computeBoundingSphere();
    const center = merged.boundingSphere?.center || new THREE.Vector3();
    const radius = merged.boundingSphere?.radius || 1;
    merged.translate(-center.x, -center.y, -center.z);
    
    const scaleFactor = 3.5 / radius;
    merged.scale(scaleFactor, scaleFactor, scaleFactor);
    merged.computeVertexNormals();
    
    const posAttribute = merged.getAttribute('position');
    const colorAttr = merged.getAttribute('color');

    // Hard cap to keep first-render work predictable (prevents main-thread stalls).
    const MAX_POINTS = 150000;
    
    const points: number[] = [];
    const colors: number[] = [];
    const normals: number[] = [];
    
    // If it's a dense point cloud, we use it directly. If it's a solid mesh with few vertices, we sample it.
    if (posAttribute.count < 50000 && geometries.some(g => g.index)) {
        try {
            const tempMesh = new THREE.Mesh(merged, new THREE.MeshBasicMaterial());
            const sampler = new MeshSurfaceSampler(tempMesh).build();
        const count = MAX_POINTS;
            const pos = new THREE.Vector3();
            const nor = new THREE.Vector3();
            const col = new THREE.Color();
            
            for(let i=0; i<count; i++) {
                sampler.sample(pos, nor, col);
                points.push(pos.x, pos.y, pos.z);
                normals.push(nor.x, nor.y, nor.z);
                // Assign a default cyan/blue if no colors are in the model, or use the model's color
                const hasColor = colorAttr && (col.r > 0 || col.g > 0 || col.b > 0);
                if (hasColor) {
                    colors.push(col.r, col.g, col.b);
                } else {
                    colors.push(0.05, 0.4, 0.9); // Tech blue
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
      for(let i=0; i<posAttribute.count; i+=step) {
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
    
    for(let i=0; i<randoms.length; i++) {
        randoms[i] = Math.random();
        
        // Analyze color to determine if this is an "earthquake" (hot color like red/yellow)
        // Usually hot colors have high red, low blue.
        const r = colorsArray[i*3];
        const g = colorsArray[i*3 + 1];
        const b = colorsArray[i*3 + 2];
        const isHot = (r > 0.5 && b < 0.3) ? 1.0 : 0.0;
        
        // Make non-hot points (the continents/ocean) look like an ethereal holographic grid
        if (isHot === 0.0) {
            // slightly dim the base globe
            colorsArray[i*3] = 0.02;
            colorsArray[i*3+1] = 0.08 + randoms[i]*0.1;
            colorsArray[i*3+2] = 0.25 + randoms[i]*0.2;
        } else {
            // Emphasize the earthquake points
            colorsArray[i*3] = Math.min(r * 0.8, 1.0);
            colorsArray[i*3+1] = Math.min(g * 0.6, 1.0);
            sizes[i] = 1.2; // Moderated size
        }
    }
    
    return { positions, colorsArray, normalsArray, randoms, sizes };
  }, [scene]);

  const pointsRef = useRef<THREE.Points>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(9999, 9999, 9999) }
  }), []);

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const targetMouse = useMemo(() => new THREE.Vector3(9999, 9999, 9999), []);

  useFrame((state) => {
    if (pointsRef.current) {
        const t = state.clock.elapsedTime;
        pointsRef.current.rotation.y = t * 0.08;
        pointsRef.current.rotation.z = Math.sin(t * 0.05) * 0.1;
        pointsRef.current.rotation.x = 0.2 + Math.sin(t * 0.08) * 0.1;
        
        const mat = pointsRef.current.material as THREE.ShaderMaterial;
        if (mat.uniforms) mat.uniforms.uTime.value = t;

        // Interaction
        targetMouse.set(9999, 9999, 9999);
        if (state.pointer.x !== 0 || state.pointer.y !== 0) {
            raycaster.setFromCamera(state.pointer, state.camera);
            const hit = new THREE.Vector3();
            if (raycaster.ray.intersectPlane(plane, hit)) {
                targetMouse.copy(hit);
            }
        }
        mat.uniforms.uMouse.value.lerp(targetMouse, 0.05);
    }
  });

  if (!particleData) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particleData.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[particleData.colorsArray, 3]} />
        <bufferAttribute attach="attributes-normal" args={[particleData.normalsArray, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[particleData.randoms, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[particleData.sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform vec3 uMouse;
          attribute vec3 color;
          attribute float aRandom;
          attribute float aSize;
          varying vec3 vColor;
          varying float vAlpha;
          
          // Simplex noise function placeholder
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
             
             // Detect "hot" spots (high red)
             float isHot = step(0.6, color.r) * step(color.b, 0.4);
             
             // Fluid surface noise
             float noise = snoise(vec2(pos.x * 2.0 + uTime * 0.2, pos.y * 2.0 + uTime * 0.2));
             
             float pulse = sin(uTime * 3.0 + aRandom * 20.0) * 0.5 + 0.5;
             
             // The hot spots erupt with data energy
             if (isHot > 0.0) {
                 float erupt = pow(pulse, 3.0) * 0.3 * aRandom;
                 pos += normalize(pos) * erupt;
                 // Eruption color gets brighter
                 vColor += vec3(0.5, 0.2, 0.0) * pulse;
             } else {
                 // Background globe floating motion
                 pos += normal * noise * 0.05;
             }
             
             // Mouse interaction repel
             float d = distance(pos, uMouse);
             if (d < 2.0) {
                 vec3 dir = normalize(pos - uMouse);
                 float force = smoothstep(2.0, 0.0, d);
                 pos += dir * force * 0.8;
                 vColor = mix(vColor, vec3(1.0, 1.0, 1.0), force * 0.5); // Add white flash
             }
             
             vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
             gl_Position = projectionMatrix * mvPosition;
             
             float baseSize = mix(0.4, 1.2, aRandom);
             float hotSizeMultiplier = 1.0 + (isHot * 1.5 * pulse);
             gl_PointSize = baseSize * hotSizeMultiplier * (5.0 / -mvPosition.z);
             
             vAlpha = mix(0.05 + aRandom * 0.1, 0.3 + pulse * 0.3, isHot);
             if (d < 2.0) vAlpha += smoothstep(2.0, 0.0, d) * 0.5;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
             float d = length(gl_PointCoord - 0.5);
             if (d > 0.5) discard;
             // Star-like soft fade
             float soft = smoothstep(0.5, 0.05, d);
             float core = smoothstep(0.2, 0.0, d);
             gl_FragColor = vec4(vColor * (soft + core * 0.5), soft * vAlpha);
          }
        `}
      />
    </points>
  );
}

export default function EarthquakeParticleHero() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        <EarthquakeParticles />
      </Suspense>
      <Effects disableGamma>
        <unrealBloomPass args={[new THREE.Vector2(256, 256), 0.5, 0.8, 0.3]} />
      </Effects>
    </Canvas>
  );
}
