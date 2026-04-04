import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { SPRDLX_SVG } from './LogoSVG';
import gsap from 'gsap';

function Decorations({ fromAbout }: { fromAbout: boolean }) {
  const [opacity, setOpacity] = useState(fromAbout ? 0 : 0.4);
  const [floorOpacity, setFloorOpacity] = useState(fromAbout ? 0 : 0.3);

  useEffect(() => {
    if (fromAbout) {
      gsap.to({ val: 0 }, {
        val: 1,
        duration: 1.5,
        delay: 2.0, // Wait for the galaxy to assemble before showing shadows
        onUpdate: function() {
          setOpacity(this.targets()[0].val * 0.4);
          setFloorOpacity(this.targets()[0].val * 0.3);
        }
      });
    }
  }, [fromAbout]);

  return (
    <>
      <group position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Outer Ring */}
        <mesh>
          <ringGeometry args={[4.8, 5, 64]} />
          <meshBasicMaterial color="#a0a0a0" transparent opacity={floorOpacity} side={THREE.DoubleSide} />
        </mesh>
        {/* Inner Ring */}
        <mesh>
          <ringGeometry args={[3.8, 3.9, 64]} />
          <meshBasicMaterial color="#a0a0a0" transparent opacity={floorOpacity * 0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <ContactShadows 
        position={[0, -3.49, 0]} 
        opacity={opacity} 
        scale={20} 
        blur={2} 
        far={4} 
      />
    </>
  );
}

function Particles({ isSolid, isBlasting, fromAbout }: { isSolid: boolean, isBlasting: boolean, fromAbout: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const solidMeshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [particleData, setParticleData] = useState<{ positions: Float32Array, normals: Float32Array, randoms: Float32Array } | null>(null);

  useEffect(() => {
    const loader = new SVGLoader();
    const svgData = loader.parse(SPRDLX_SVG);
    
    const geometries: THREE.BufferGeometry[] = [];
    
    svgData.paths.forEach((path) => {
      const shapes = SVGLoader.createShapes(path);
      shapes.forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 20,
          bevelEnabled: true,
          bevelThickness: 2,
          bevelSize: 1,
          bevelSegments: 3
        });
        geometries.push(geometry);
      });
    });

    const mergedGeo = BufferGeometryUtils.mergeGeometries(geometries);
    
    // Center the geometry
    mergedGeo.computeBoundingBox();
    const center = new THREE.Vector3();
    mergedGeo.boundingBox!.getCenter(center);
    mergedGeo.translate(-center.x, -center.y, -center.z);
    
    // Scale and flip Y (SVG Y is down, Three.js Y is up)
    mergedGeo.scale(0.02, -0.02, 0.02);
    
    // Compute normals
    mergedGeo.computeVertexNormals();

    setGeometry(mergedGeo);

    // Sample points
      const tempMesh = new THREE.Mesh(mergedGeo, new THREE.MeshBasicMaterial());
      const sampler = new MeshSurfaceSampler(tempMesh).build();
      
      const particleCount = 80000;
      const positions = new Float32Array(particleCount * 3);
      const normals = new Float32Array(particleCount * 3);
      const randoms = new Float32Array(particleCount);
      const tempPosition = new THREE.Vector3();
      const tempNormal = new THREE.Vector3();

      for (let i = 0; i < particleCount; i++) {
        sampler.sample(tempPosition, tempNormal);
        positions[i * 3] = tempPosition.x;
        positions[i * 3 + 1] = tempPosition.y;
        positions[i * 3 + 2] = tempPosition.z;
        normals[i * 3] = tempNormal.x;
        normals[i * 3 + 1] = tempNormal.y;
        normals[i * 3 + 2] = tempNormal.z;
        randoms[i] = Math.random();
      }

      setParticleData({ positions, normals, randoms });
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#1a1a1a') },
    uIsSolid: { value: isSolid ? 1 : 0 },
    uProgress: { value: fromAbout ? 1 : 0 },
    uMouse: { value: new THREE.Vector3(9999, 9999, 9999) },
    uBlast: { value: 0 },
    uImplode: { value: fromAbout ? 1 : 0 }
  }), [isSolid, fromAbout]);

  useEffect(() => {
    if (geometry && particleData) {
      if (fromAbout) {
        gsap.to(uniforms.uImplode, {
          value: 0,
          duration: 3.0,
          ease: "power3.out"
        });
      } else {
        gsap.to(uniforms.uProgress, {
          value: 1,
          duration: 2.5,
          ease: "power3.out"
        });
      }
    }
  }, [geometry, particleData, uniforms, fromAbout]);

  useEffect(() => {
    if (isBlasting) {
      gsap.to(uniforms.uBlast, {
        value: 1,
        duration: 1.5,
        ease: "power2.in"
      });
    } else {
      uniforms.uBlast.value = 0;
    }
  }, [isBlasting, uniforms]);

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  useFrame((state) => {
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Mouse interaction
      const targetMouse = new THREE.Vector3(9999, 9999, 9999);
      if (state.pointer.x !== 0 || state.pointer.y !== 0) {
        raycaster.setFromCamera(state.pointer, state.camera);
        const intersect = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(plane, intersect)) {
          targetMouse.copy(intersect);
        }
      }
      material.uniforms.uMouse.value.lerp(targetMouse, 0.1);

      // Gentle rotation
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      pointsRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.05;
    }
    if (solidMeshRef.current) {
      solidMeshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      solidMeshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  if (!geometry || !particleData) return null;

  return (
    <group>
      {!isSolid && (
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleData.positions.length / 3}
              array={particleData.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-normal"
              count={particleData.normals.length / 3}
              array={particleData.normals}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-aRandom"
              count={particleData.randoms.length}
              array={particleData.randoms}
              itemSize={1}
            />
          </bufferGeometry>
          <shaderMaterial
            transparent
            depthWrite={false}
            uniforms={uniforms}
            vertexShader={`
              uniform float uTime;
              uniform float uProgress;
              uniform vec3 uMouse;
              uniform float uBlast;
              uniform float uImplode;
              attribute float aRandom;
              varying float vAlpha;
              
              void main() {
                vec3 pos = position;
                
                // Entrance animation
                if (uImplode == 0.0) {
                  float yOffset = (1.0 - uProgress) * 10.0 * aRandom;
                  pos.y += yOffset;
                }
                
                // Implode Entrance (From About)
                if (uImplode > 0.0) {
                  float ease = pow(uImplode, 2.0); // Non-linear ease
                  
                  // Create a sweeping galaxy formation
                  float radius = aRandom * 30.0 * ease;
                  float angle = aRandom * 6.28318 + uTime * 2.0 + (1.0 - ease) * 10.0;
                  float zOffset = (aRandom - 0.5) * 100.0 * ease;
                  
                  vec3 galaxyPos = vec3(
                    cos(angle) * radius,
                    sin(angle) * radius,
                    pos.z + zOffset
                  );
                  
                  // Add a twist based on distance from center
                  float dist = length(galaxyPos.xy);
                  float twistAngle = dist * 0.1 * ease;
                  float s = sin(twistAngle);
                  float c = cos(twistAngle);
                  vec3 twistedPos = galaxyPos;
                  galaxyPos.x = twistedPos.x * c - twistedPos.y * s;
                  galaxyPos.y = twistedPos.x * s + twistedPos.y * c;
                  
                  pos = mix(pos, galaxyPos, ease);
                }
                
                // Scatter effect
                float mouseDist = distance(pos, uMouse);
                float maxDist = 1.0;
                if (mouseDist < maxDist && uBlast == 0.0) {
                  vec3 dir = normalize(pos - uMouse);
                  dir += vec3(sin(aRandom * 10.0), cos(aRandom * 10.0), sin(aRandom * 20.0)) * 0.5;
                  dir = normalize(dir);
                  float force = smoothstep(maxDist, 0.0, mouseDist);
                  pos += dir * force * 1.2;
                }
                
                // Blast off effect
                if (uBlast > 0.0) {
                  vec3 blastDir = normalize(pos) + vec3(sin(aRandom * 100.0), cos(aRandom * 100.0), sin(aRandom * 200.0));
                  blastDir = normalize(blastDir);
                  pos += blastDir * (uBlast * uBlast * 30.0 * aRandom);
                }
                
                // Add some noise/turbulence
                float noise = sin(pos.x * 2.0 + uTime) * cos(pos.y * 2.0 + uTime) * 0.1;
                pos += normal * noise * aRandom;
                
                // Disperse effect based on random value and time
                float disperse = sin(uTime * 0.5 + aRandom * 10.0) * 0.05;
                pos.x += disperse;
                pos.y += disperse;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                
                // Size attenuation
                float baseSize = (1.0 * aRandom + 0.5);
                float energySize = baseSize + (uImplode * 5.0 * aRandom);
                gl_PointSize = energySize * (15.0 / -mvPosition.z) * max(uProgress, 1.0 - uImplode);
                
                float currentAlpha = uImplode > 0.0 ? (1.0 - uImplode * 0.5) : uProgress;
                vAlpha = (0.3 + aRandom * 0.5) * currentAlpha * (1.0 - uBlast);
              }
            `}
            fragmentShader={`
              uniform vec3 uColor;
              varying float vAlpha;
              
              void main() {
                // Circular particle
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;
                
                // Soft edge
                float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
                
                gl_FragColor = vec4(uColor, alpha * 0.8);
              }
            `}
          />
        </points>
      )}

      {isSolid && (
        <mesh ref={solidMeshRef} geometry={geometry}>
          <meshStandardMaterial 
            color="#1a1a1a" 
            roughness={0.2} 
            metalness={0.8} 
            envMapIntensity={1}
          />
        </mesh>
      )}
    </group>
  );
}

function CameraAnimation({ setControlsEnabled, fromAbout }: { setControlsEnabled: (v: boolean) => void, fromAbout: boolean }) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (fromAbout) {
      // Cinematic sweeping drone shot: Start back-right, swoop to front
      camera.position.set(20, 5, -15);
      camera.lookAt(0, 0, 0);

      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 10,
        duration: 3.5,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
        },
        onComplete: () => {
          setControlsEnabled(true);
        }
      });
    } else {
      // Initial position (Top view)
      camera.position.set(0, 10, 0.1);
      camera.lookAt(0, 0, 0);

      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 10,
        duration: 3.5,
        ease: "power3.inOut",
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
        },
        onComplete: () => {
          setControlsEnabled(true);
        }
      });
    }
  }, [camera, setControlsEnabled, fromAbout]);

  return null;
}

export default function ParticleLogo({ isSolid, isBlasting = false, fromAbout = false }: { isSolid: boolean, isBlasting?: boolean, fromAbout?: boolean }) {
  const [controlsEnabled, setControlsEnabled] = useState(false);

  return (
    <Canvas camera={{ position: [0, 10, 0.1], fov: 45 }} dpr={[1, 2]}>
      <CameraAnimation setControlsEnabled={setControlsEnabled} fromAbout={fromAbout} />
      <color attach="background" args={['#dcdcdc']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="city" />
      
      <Particles isSolid={isSolid} isBlasting={isBlasting} fromAbout={fromAbout} />
      <Decorations fromAbout={fromAbout} />
      
      <OrbitControls 
        enabled={controlsEnabled}
        enablePan={false} 
        enableZoom={false} 
        minPolarAngle={Math.PI / 2.5} 
        maxPolarAngle={Math.PI / 1.5} 
        autoRotate={controlsEnabled}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
