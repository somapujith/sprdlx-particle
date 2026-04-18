import { Suspense, lazy } from 'react';
import { useLazyLoad3D } from '../../hooks/useLazyLoad3D';

const SplineHero = lazy(() => import('./SplineHero'));

interface LazySplineHeroProps {
  sceneUrl: string;
}

export function LazySplineHero({ sceneUrl }: LazySplineHeroProps) {
  const { ref, isVisible } = useLazyLoad3D({
    threshold: 0.1,
    rootMargin: '50px',
  });

  return (
    <div ref={ref} className="absolute inset-0 w-full h-full bg-black">
      {isVisible ? (
        <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
          <SplineHero sceneUrl={sceneUrl} />
        </Suspense>
      ) : (
        <div className="absolute inset-0 bg-black" />
      )}
    </div>
  );
}
