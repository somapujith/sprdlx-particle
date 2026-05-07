import Spline from '@splinetool/react-spline';

interface SplineHeroProps {
  sceneUrl: string;
}

export default function SplineHero({ sceneUrl }: SplineHeroProps) {
  return (
    <div className="absolute inset-0 w-full h-full cursor-auto">
      <Spline scene={sceneUrl} />
      <style>{`
        iframe {
          border: none !important;
          cursor: auto !important;
        }
        [class*="watermark"], [class*="branding"], [class*="logo"] {
          display: none !important;
        }
        canvas {
          cursor: auto !important;
        }
      `}</style>
    </div>
  );
}
