import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

export default function NotFound() {
  const navigate = useNavigate();

  useSEO({
    title: '404 — Page Not Found | SPRDLX',
    description: 'The page you are looking for could not be found.',
    noIndex: true,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--color-bg)] text-[color:var(--color-text)] [font-family:var(--font-sf),ui-sans-serif,system-ui,sans-serif]">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-zinc-400 mb-8">Page not found</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex px-6 py-3 border border-white/30 hover:border-white/50 rounded-lg transition-colors text-sm font-semibold uppercase tracking-wide"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
