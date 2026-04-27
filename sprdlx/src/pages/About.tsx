import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WaterRipple from '../components/Canvas/WaterRipple';
import MenuOverlay from '../components/Canvas/MenuOverlay';
import { MagneticLink } from '../components/ui/MagneticLink';
import TeamSection from './about/TeamSection';

gsap.registerPlugin(ScrollTrigger);

function About() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [canRevealEntry, setCanRevealEntry] = useState(false);
  const [forceReveal, setForceReveal] = useState(false);
  const textContainerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    (window as any).lenisInstance?.start();

    const minCoverTimer = window.setTimeout(() => setCanRevealEntry(true), 300);
    const failSafeTimer = window.setTimeout(() => setForceReveal(true), 1500);

    const ctx = gsap.context(() => {
      if (textContainerRef.current) {
        const words = textContainerRef.current.querySelectorAll('.reveal-word');
        gsap.fromTo(
          words,
          { y: '30%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.01,
            scrollTrigger: {
              trigger: textContainerRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    return () => {
      window.clearTimeout(minCoverTimer);
      window.clearTimeout(failSafeTimer);
      ctx.revert();
    };
  }, []);

  const isEntryBlocking = !forceReveal && !canRevealEntry;

  const teamMembers = [
    {
      initial: 'G',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      role: 'Founder',
      name: 'Goutham',
      surname: 'Uppuluri',
    },
    {
      initial: 'R',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
      role: 'AI Engineer',
      name: 'Rakesh',
      surname: 'Thakkuri',
    },
    {
      initial: 'P',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop',
      role: 'Frontend Developer',
      name: 'Pujith',
      surname: 'Soma',
    },
    {
      initial: 'D',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
      role: 'Backend Developer',
      name: 'Dhruv',
      surname: '',
    },
    {
      initial: 'A',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      role: 'Frontend Developer',
      name: 'Ajith',
      surname: '',
    },
    {
      initial: 'N',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
      role: 'AI Engineer',
      name: 'Nithin',
      surname: '',
    },
    {
      initial: 'U',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop',
      role: 'Backend Developer',
      name: 'Udit',
      surname: '',
    },
  ];

  return (
    <div
      className="about-container relative min-h-screen bg-black text-white font-sans overflow-x-hidden"
      style={{
        backgroundColor: '#000000',
      }}
    >
      <nav className="fixed top-0 right-0 w-full z-50 flex justify-end items-center p-6 mix-blend-difference pointer-events-none">
        <p className="nav-toggle cursor-pointer pointer-events-auto text-sm md:text-base font-bold tracking-widest text-white uppercase hover:opacity-70 transition-opacity">MENU</p>
      </nav>
      <MenuOverlay />
      <section
        id="about-hero"
        aria-label="Hero"
        className="relative z-0 flex min-h-screen min-h-[100dvh] h-screen w-full flex-col justify-between overflow-hidden bg-black"
      >
        <WaterRipple />
      </section>

      <section
        id="about-data"
        aria-label="About"
        className="relative z-10 bg-black px-8 py-20 md:px-12 md:py-32"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-16 md:flex-row md:items-center md:gap-24">
          <div className="flex-1 font-sans">
            <h2 ref={textContainerRef} className="text-2xl font-light leading-snug tracking-tight text-white md:text-3xl md:leading-relaxed lg:text-4xl lg:leading-snug flex flex-wrap">
              {"At SPRDLX, we are dedicated to delivering cutting-edge digital solutions that seamlessly blend creativity, technology, and precision. As a modern and forward-driven company, we specialize in transforming ideas into powerful digital experiences, ranging from high-performance websites to scalable applications and intelligent systems. Our journey is built on a strong foundation of innovation, collaboration, and attention to detail, allowing us to work closely with clients and designers to translate creative concepts into functional, user-centric realities. We believe in crafting solutions that are not only visually compelling but also efficient, reliable, and future-ready. With a deep commitment to quality and continuous growth, SPRDLX constantly evolves alongside the digital landscape, ensuring that every project we deliver meets the highest standards of excellence and impact."
                .split(' ')
                .map((word, index) => (
                  <span key={index} className="inline-block overflow-hidden pb-2 -mb-2 mr-[0.25em] align-top">
                    <span className="reveal-word inline-block origin-top-left translate-y-[120%] opacity-0">
                      {word}
                    </span>
                  </span>
                ))}
            </h2>
            <p className="mt-10 text-lg font-light text-white/50 md:mt-12 md:text-2xl hover:text-white/80 transition-colors cursor-default">
              SPRDLX — Where Ideas Evolve into Intelligent Digital Realities.
            </p>
          </div>
          <div className="w-full md:w-2/5 lg:w-1/3">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-zinc-900 object-cover grayscale transition-all duration-700 hover:grayscale-0 ring-1 ring-white/10">
              <picture>
                <source
                  srcSet="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=640&auto=format&fit=crop&fm=webp 640w, https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1024&auto=format&fit=crop&fm=webp 1024w"
                  type="image/webp"
                />
                <source
                  srcSet="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=640&auto=format&fit=crop 640w, https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1024&auto=format&fit=crop 1024w"
                  type="image/jpeg"
                />
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
                  alt="SPRDLX Digital Solutions"
                  className="h-full w-full object-cover transition-transform duration-[2s] hover:scale-105"
                  loading="lazy"
                />
              </picture>
            </div>
          </div>
        </div>
      </section>

      <TeamSection members={teamMembers} />

      <footer className="relative z-20 flex flex-col items-center justify-center gap-8 border-t border-white/10 px-6 py-12 md:py-16">
        <nav className="pointer-events-auto flex justify-center gap-6 text-xs font-medium uppercase tracking-widest">
          <MagneticLink
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-[#f0f0f0] hover:opacity-80"
          >
            SPRDLX
          </MagneticLink>
          <span className="select-none opacity-40">•</span>
          <MagneticLink
            href="/"
            onClick={(e) => {
              e.preventDefault();
              (window as any).lenisInstance?.stop();
              setTimeout(() => navigate('/'), 600);
            }}
            className="text-[#888888] hover:opacity-80"
          >
            HOME
          </MagneticLink>
          <span className="select-none opacity-40">•</span>
          <MagneticLink
            href="/projects"
            onClick={(e) => {
              e.preventDefault();
              (window as any).lenisInstance?.stop();
              setTimeout(() => navigate('/projects'), 600);
            }}
            className="text-[#888888] hover:opacity-80"
          >
            PROJECTS
          </MagneticLink>
          <span className="select-none opacity-40">•</span>
          <MagneticLink
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-[#888888] opacity-70 hover:opacity-80"
          >
            CONTACT
          </MagneticLink>
        </nav>
      </footer>

      <div
        className="pointer-events-none fixed inset-0 z-40 bg-black transition-opacity duration-[1200ms] ease-in-out"
        style={{ opacity: isExiting || isEntryBlocking ? 1 : 0 }}
        aria-hidden
      />
    </div>
  );
}

export default About;
