import { useEffect, useState } from 'react';

export function useHardwareAcceleration() {
  const [isAccelerationAvailable, setIsAccelerationAvailable] = useState(true);

  useEffect(() => {
    const checkHardwareAcceleration = () => {
      try {
        const canvas = document.createElement('canvas');
        const webglContext =
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl') ||
          canvas.getContext('webgl2');

        if (!webglContext) {
          setIsAccelerationAvailable(false);
        }
      } catch {
        setIsAccelerationAvailable(false);
      }
    };

    checkHardwareAcceleration();
  }, []);

  return isAccelerationAvailable;
}
