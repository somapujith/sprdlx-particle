import { useRef, useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { useNavigate } from 'react-router-dom';
import MenuOverlay from '../components/Canvas/MenuOverlay';
import { MagneticLink } from '../components/ui/MagneticLink';
import AboutHeroSection from './about/AboutHeroSection';
import AboutIntroSection from './about/AboutIntroSection';
import AboutFocusSection from './about/AboutFocusSection';
import AboutTeamShowcase from './about/AboutTeamShowcase';
import { useAboutPageAnimations } from './about/useAboutPageAnimations';
import './about/team-styles.css';

function About() {
  useSEO({
    title: 'About SPRDLX — Creative Studio from Hyderabad',
    description: 'Meet the team behind SPRDLX. We are a creative digital studio from Hyderabad building immersive web experiences, design systems, and intelligent products for ambitious startups.',
    canonical: '/about',
  });
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
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
      className="about-container relative min-h-screen bg-black text-white font-sans overflow-x-hidden"
      style={{
        backgroundColor: '#000000',
      }}
    >
      <MenuOverlay />
      <AboutHeroSection />
      <AboutIntroSection textContainerRef={textContainerRef} />
      <AboutFocusSection activeTopicIndex={activeTopicIndex} />
      <div style={{ marginTop: '1360px' }}>
        <AboutTeamShowcase />
      </div>


      <div
        className="pointer-events-none fixed inset-0 z-40 bg-black transition-opacity duration-1200 ease-in-out"
        style={{ opacity: isExiting || isEntryBlocking ? 1 : 0 }}
        aria-hidden
      />
    </div>
  );
}

export default About;
