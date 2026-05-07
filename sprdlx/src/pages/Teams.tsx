import { useSEO } from '../hooks/useSEO';
import MenuOverlay from '../components/Canvas/MenuOverlay';
import TeamsParallax from './teams/TeamsParallax';

export default function Teams() {
  useSEO({
    title: 'Teams — SPRDLX',
    description: 'Crftd scroll animation experience.',
    canonical: '/teams',
  });

  return (
    <main className="w-screen bg-black overflow-x-hidden">
      <MenuOverlay />
      
      <section className="h-screen w-full">
        <TeamsParallax />
      </section>

      <section className="flex h-screen w-full items-center justify-center bg-black text-white">
        <h1 className="text-8xl font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-sf), ui-sans-serif, system-ui, sans-serif' }}>
          hello
        </h1>
      </section>
    </main>
  );
}

