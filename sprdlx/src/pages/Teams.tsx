import { useSEO } from '../hooks/useSEO';
import MenuOverlay from '../components/Canvas/MenuOverlay';
import TeamsParallax from './teams/TeamsParallax';
import InteractiveTeamSection from './teams/InteractiveTeamSection';

export default function Teams() {
  useSEO({
    title: 'Teams — SPRDLX',
    description: 'Crftd scroll animation experience.',
    canonical: '/teams',
  });

  return (
    <main className="w-full bg-black overflow-x-hidden">
      <MenuOverlay />
      
      <section className="h-screen w-full">
        <TeamsParallax />
      </section>

      <section className="h-screen w-full">
        <InteractiveTeamSection />
      </section>
    </main>
  );
}

