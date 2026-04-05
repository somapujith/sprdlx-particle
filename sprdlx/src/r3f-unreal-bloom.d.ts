import type * as THREE from 'three';

declare module '@react-three/fiber' {
  interface ThreeElements {
    unrealBloomPass: {
      args?: [THREE.Vector2, number, number, number];
      attach?: string;
    };
  }
}
