import { useState, useCallback } from 'react';

export function useAudioReactive() {
  const [amplitude, setAmplitude] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      microphone.connect(analyser);
      analyser.fftSize = 256;

      setIsActive(true);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const animate = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b) / dataArray.length / 255;
        setAmplitude(Math.min(1, avg * 2));
        requestAnimationFrame(animate);
      };
      animate();
    } catch (err) {
      console.error('Audio access denied:', err);
    }
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
    setAmplitude(0);
  }, []);

  return { amplitude, isActive, start, stop };
}
