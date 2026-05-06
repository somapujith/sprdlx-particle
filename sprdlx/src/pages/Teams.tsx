import { useSEO } from '../hooks/useSEO';

export default function Teams() {
  useSEO({
    title: 'Teams — SPRDLX',
    description: 'Crftd scroll animation experience.',
    canonical: '/teams',
  });

  return (
    <main className="fixed inset-0 h-screen w-screen overflow-hidden bg-black">
      <iframe
        title="Crftd Teams"
        src="/cg-crftd/index.html"
        className="h-full w-full border-0"
        loading="eager"
      />
    </main>
  );
}

