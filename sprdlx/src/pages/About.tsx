import { useRef, useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { useMotif } from '../hooks/useMotif';
import MenuOverlay from '../components/Canvas/MenuOverlay';
import AboutHeroSection from './about/AboutHeroSection';
import AboutIntroSection from './about/AboutIntroSection';
import AboutFocusSection from './about/AboutFocusSection';
import AboutTeamShowcase from './about/AboutTeamShowcase';
import { SectionDivider } from '../components/ui/SectionDivider';
import { useAboutPageAnimations } from './about/useAboutPageAnimations';
import './about/team-styles.css';

function About() {
  useMotif('chrome');
  useSEO({
    title: 'About SPRDLX — Creative Studio from Hyderabad',
    description:
      'Meet the team behind SPRDLX. We are a creative digital studio from Hyderabad building immersive web experiences, design systems, and intelligent products for ambitious startups.',
    canonical: '/about',
  });
  const [canRevealEntry, setCanRevealEntry] = useState(false);
  const [forceReveal, setForceReveal] = useState(false);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const textContainerRef = useRef<HTMLHeadingElement>(null);

  useAboutPageAnimations({
    textContainerRef,
    setCanRevealEntry,
    setForceReveal,
    setActiveTopicIndex,
  });

  const isEntryBlocking = !forceReveal && !canRevealEntry;

  return (
    <div
      className="about-container relative min-h-screen overflow-x-hidden bg-[color:var(--color-bg)] text-[color:var(--color-text)]"
      style={{ fontFamily: 'var(--font-sf), ui-sans-serif, system-ui, sans-serif' }}
    >
      <MenuOverlay />
      <AboutHeroSection />
      <AboutIntroSection textContainerRef={textContainerRef} />
      <AboutFocusSection activeTopicIndex={activeTopicIndex} />
      <div className="flex flex-col items-center gap-12 pb-24" style={{ marginTop: '1360px' }}>
        <SectionDivider className="shrink-0" />
        <AboutTeamShowcase />
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-1200 ease-in-out bg-[color:var(--color-bg)]"
        style={{ opacity: isEntryBlocking ? 1 : 0 }}
        aria-hidden
      />
    </div>
  );
}

export default About;
