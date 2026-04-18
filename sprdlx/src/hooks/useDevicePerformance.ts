import { useEffect, useState } from 'react';

interface DevicePerformance {
  cores: number;
  memory: number;
  isMobile: boolean;
  isLowEnd: boolean;
  maxFPS: number;
}

export function useDevicePerformance(): DevicePerformance {
  const [perf, setPerf] = useState<DevicePerformance>({
    cores: 4,
    memory: 8,
    isMobile: false,
    isLowEnd: false,
    maxFPS: 60,
  });

  useEffect(() => {
    const nav = navigator as any;
    const cores = nav.hardwareConcurrency || 4;
    const memory = nav.deviceMemory || 8;
    const isMobile = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent);

    const isLowEnd = memory <= 4 || cores <= 2;
    const maxFPS = isMobile ? (isLowEnd ? 30 : 45) : 60;

    setPerf({
      cores,
      memory,
      isMobile,
      isLowEnd,
      maxFPS,
    });
  }, []);

  return perf;
}
