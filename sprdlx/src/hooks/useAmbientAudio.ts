import { useState, useCallback } from 'react';

export function useAmbientAudio() {
  const [audioRef] = useState<{ context?: AudioContext; oscillators?: OscillatorNode[] }>({});

  const start = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = 0.1;

    const oscillators: OscillatorNode[] = [];
    const frequencies = [55, 110, 220];

    frequencies.forEach((freq) => {
      const osc = audioContext.createOscillator();
      osc.frequency.value = freq;
      osc.type = 'sine';

      const lfo = audioContext.createOscillator();
      lfo.frequency.value = 0.05 + Math.random() * 0.04;
      const lfoGain = audioContext.createGain();
      lfoGain.gain.value = 5;

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(gainNode);
      osc.start();
      lfo.start();

      oscillators.push(osc);
    });

    audioRef.context = audioContext;
    audioRef.oscillators = oscillators;
  }, [audioRef]);

  const stop = useCallback(() => {
    if (audioRef.context && audioRef.oscillators) {
      audioRef.oscillators.forEach((osc) => osc.stop());
      audioRef.context.close();
    }
  }, [audioRef]);

  return { start, stop };
}
