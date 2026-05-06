import { useSEO } from '../hooks/useSEO';
import MenuOverlay from '../components/Canvas/MenuOverlay';

export default function Teams() {
  useSEO({
    title: 'Teams — SPRDLX',
    description: 'Crftd scroll animation experience.',
    canonical: '/teams',
  });

  return (
    <main className="fixed inset-0 h-screen w-screen overflow-hidden bg-black">
      <MenuOverlay />
      <iframe
        title="Teams"
        src="/teams-parallax/index.html"
        className="h-full w-full border-0"
        loading="eager"
      />
    </main>
  );
}

