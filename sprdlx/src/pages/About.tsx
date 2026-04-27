import { useEffect, useRef, useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import WaterRipple from '../components/Canvas/WaterRipple';
import MenuOverlay from '../components/Canvas/MenuOverlay';
import { MagneticLink } from '../components/ui/MagneticLink';
import './about/team-styles.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      const profileImagesContainer = document.querySelector('.profile-images');
      const profileImages = document.querySelectorAll('.profile-images .img');
      const nameElements = document.querySelectorAll('.profile-names .name');
      const nameHeadings = document.querySelectorAll('.profile-names .name h1');

      if (!nameHeadings.length) return;

    nameHeadings.forEach((heading) => {
      const split = new SplitText(heading, { type: 'chars' });
      split.chars.forEach((char) => {
        char.classList.add('letter');
      });
    });

    // Set all names to hidden initially
    nameHeadings.forEach((heading) => {
      const letters = heading.querySelectorAll('.letter');
      gsap.set(letters, { y: '100%' });
    });

    if (window.innerWidth >= 900) {
      profileImages.forEach((img, index) => {
        const correspondingName = nameElements[index];

        img.addEventListener('mouseenter', () => {
          const letters = correspondingName?.querySelectorAll('.letter');

          gsap.to(img, {
            width: 200,
            height: 200,
            duration: 0.5,
            ease: 'power4.out',
          });

          if (letters && letters.length) {
            gsap.to(letters, {
              y: '-100%',
              ease: 'power4.out',
              duration: 0.75,
              stagger: {
                each: 0.025,
                from: 'center',
              },
            });
          }
        });

        img.addEventListener('mouseleave', () => {
          const letters = correspondingName?.querySelectorAll('.letter');

          gsap.to(img, {
            width: 120,
            height: 120,
            duration: 0.5,
            ease: 'power4.out',
          });

          if (letters && letters.length) {
            gsap.to(letters, {
              y: '0%',
              ease: 'power4.out',
              duration: 0.75,
              stagger: {
                each: 0.025,
                from: 'center',
              },
            });
          }
        });
      });
    }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const isEntryBlocking = !forceReveal && !canRevealEntry;

  const teamMembers = [
    { name: 'Goutham', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' },
    { name: 'Rakesh', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop' },
    { name: 'Pujith', image: '/team/Pujith.png' },
    { name: 'Dhruv', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop' },
    { name: 'Ajith', image: '/team/Ajith.png' },
    { name: 'Nithin', image: '/team/Nithin.PNG' },
    { name: 'Udit', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop' },
  ];

  return (
    <div
      className="about-container relative min-h-screen bg-black text-white font-sans overflow-x-hidden"
      style={{
        backgroundColor: '#000000',
      }}
    >
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
        className="relative z-10 bg-black px-8 py-20 md:px-12 md:py-32 flex justify-center"
      >
        <div className="w-full max-w-5xl flex flex-col justify-center items-center">
          <div className="font-sans text-center">
            <h2 ref={textContainerRef} className="text-2xl font-light leading-snug tracking-tight text-white md:text-3xl md:leading-relaxed lg:text-4xl lg:leading-snug">
              {"At SPRDLX, we are dedicated to delivering cutting-edge digital solutions that seamlessly blend creativity, technology, and precision. As a modern and forward-driven company, we specialize in transforming ideas into powerful digital experiences, ranging from high-performance websites to scalable applications and intelligent systems. Our journey is built on a strong foundation of innovation, collaboration, and attention to detail, allowing us to work closely with clients and designers to translate creative concepts into functional, user-centric realities. We believe in crafting solutions that are not only visually compelling but also efficient, reliable, and future-ready. With a deep commitment to quality and continuous growth, SPRDLX constantly evolves alongside the digital landscape, ensuring that every project we deliver meets the highest standards of excellence and impact."
                .split(' ')
                .map((word, index) => (
                  <span key={index} className="reveal-word inline opacity-0">
                    {word}{' '}
                  </span>
                ))}
            </h2>
            <p className="mt-10 text-lg font-light text-white/50 md:mt-12 md:text-2xl hover:text-white/80 transition-colors cursor-default">
              SPRDLX — Where Ideas Evolve into Intelligent Digital Realities.
            </p>
          </div>
        </div>
      </section>

      <section className="team">
        <div className="profile-images">
          {teamMembers.map((member, index) => (
            <div key={index} className="img">
              <img src={member.image} alt={member.name} />
            </div>
          ))}
        </div>

        <div className="profile-names">
          {teamMembers.map((member, index) => (
            <div key={index} className="name"><h1>{member.name}</h1></div>
          ))}
        </div>
      </section>


      <div
        className="pointer-events-none fixed inset-0 z-40 bg-black transition-opacity duration-[1200ms] ease-in-out"
        style={{ opacity: isExiting || isEntryBlocking ? 1 : 0 }}
        aria-hidden
      />
    </div>
  );
}

export default About;
