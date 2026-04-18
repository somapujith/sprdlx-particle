import { useEffect } from 'react';
import * as THREE from 'three';
import MacbookModel from './MacbookModel';

interface DisposableMacbookModelProps {
  texture: THREE.Texture;
  position: [number, number, number];
  scale: number;
}

export function DisposableMacbookModel({
  texture,
  position,
  scale,
}: DisposableMacbookModelProps) {
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      texture.dispose();
    };
  }, [texture]);

  return <MacbookModel texture={texture} position={position} scale={scale} />;
}
