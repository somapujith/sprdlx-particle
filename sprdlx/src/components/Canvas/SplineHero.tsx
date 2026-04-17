import Spline from '@splinetool/react-spline';

interface SplineHeroProps {
  sceneUrl: string;
}

export default function SplineHero({ sceneUrl }: SplineHeroProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Spline scene={sceneUrl} />
    </div>
  );
}
