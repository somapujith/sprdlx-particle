import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

function RoseParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 25000; // High particle count for the dense rose look

  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const colorObj = new THREE.Color();

    const scale = 12;
    const petals = 5;
    const depth = 8.0;

    for (let i = 0; i < count; i++) {
      const p = i / count;
      // Golden angle for organic spiral distribution
      const angle = i * 2.399963229728653;
      const radius = Math.sqrt(p) * scale;

      // Petal shaping
      const petalShape = Math.pow(Math.abs(Math.sin(angle * petals * 0.5)), 0.8);
      const r = radius * (0.4 + 0.6 * petalShape);

      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      // Cup shape + noise
      const z = Math.sin(p * Math.PI) * depth - radius * 0.8;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Fiery colors: center is bright yellow/orange, edges are deep red
      const hue = 0.02 + p * 0.08; // 0.02 (red) to 0.1 (orange/yellow)
      const sat = 0.8 + p * 0.2;
      const light = 0.7 - p * 0.5;
      colorObj.setHSL(hue, sat, light);

      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;

      randoms[i] = Math.random();
    }

    return { positions, colors, randoms };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uMouse: { value: new THREE.Vector3(9999, 9999, 9999) }
  }), []);

  useEffect(() => {
    gsap.to(uniforms.uProgress, {
      value: 1,
      duration: 4,
      ease: "power2.out"
    });
  }, [uniforms]);

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  useFrame((state) => {
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Gentle rotation of the entire rose
      pointsRef.current.rotation.z = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      pointsRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
      
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
    }
  });

  return (
    <points ref={pointsRef} rotation={[-Math.PI / 6, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleData.positions.length / 3}
          array={particleData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleData.colors.length / 3}
          array={particleData.colors}
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
            
            // Entrance animation (blooming from center)
            float bloomOffset = length(pos) * 0.1;
            float p = clamp((uProgress - bloomOffset) * 2.0, 0.0, 1.0);
            
            // Swirl effect
            float angle = (1.0 - p) * 5.0 * aRandom;
            float s = sin(angle);
            float c = cos(angle);
            vec3 tempPos = pos;
            pos.x = tempPos.x * c - tempPos.y * s;
            pos.y = tempPos.x * s + tempPos.y * c;
            
            pos *= p;
            pos.z -= (1.0 - p) * 20.0;
            
            // Organic breathing animation
            float breath = sin(length(pos) * 0.5 - uTime * 2.0) * 0.2;
            pos.z += breath;
            
            // Scatter effect on mouse hover
            float mouseDist = distance(pos, uMouse);
            float maxDist = 3.0;
            if (mouseDist < maxDist) {
              vec3 dir = normalize(pos - uMouse);
              float force = smoothstep(maxDist, 0.0, mouseDist);
              pos += dir * force * 2.0;
            }
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // Size attenuation
            gl_PointSize = (2.0 * aRandom + 1.5) * (25.0 / -mvPosition.z) * p;
            
            vAlpha = (0.3 + aRandom * 0.7) * p;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            // Soft circular particle
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
            
            // Add a bright core to each particle
            vec3 core = vec3(1.0) * smoothstep(0.2, 0.0, dist) * 0.5;
            vec3 finalColor = vColor + core;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `}
      />
    </points>
  );
}

export default function ParticleHands() {
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#000000']} />
      <RoseParticles />
      <OrbitControls 
        enablePan={false} 
        enableZoom={false} 
        minPolarAngle={Math.PI / 3} 
        maxPolarAngle={Math.PI / 1.5} 
      />
    </Canvas>
  );
}
