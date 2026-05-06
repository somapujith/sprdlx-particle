import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useSEO } from '../hooks/useSEO';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import MenuOverlay from '../components/Canvas/MenuOverlay';
import FocusAreaFluid from '../components/Canvas/FocusAreaFluid';
import Copy from '../components/Common/Copy';

const WaterRipple = lazy(() => import('../components/Canvas/WaterRipple'));
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
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const textContainerRef = useRef<HTMLHeadingElement>(null);

  const images = [
    '/team/Goutham.png',
    '/team/Rakesh.png',
    '/team/Pujith.png',
    '/team/Dhruv.png',
    '/team/Nithin.PNG',
    '/team/Udit.png',
  ];

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

      // Focus areas animation
      const focusItems = document.querySelectorAll('.focus-item');
      const focusItemsList = document.querySelector('.focus-items-list');

      if (focusItemsList) {
        focusItems.forEach((item, index) => {
          gsap.to(item, {
            scrollTrigger: {
              trigger: focusItemsList,
              start: 'top center',
              end: 'bottom center',
              onUpdate: (self) => {
                const scrollProgress = self.progress;
                const itemProgress = (scrollProgress * focusItems.length) - index;
                const isActive = itemProgress > -0.5 && itemProgress < 0.5;

                if (isActive) {
                  setActiveTopicIndex(index);
                  gsap.to(item.querySelector('h3'), {
                    color: '#ffffff',
                    fontSize: '2.25rem',
                    duration: 0.3,
                  });
                } else {
                  gsap.to(item.querySelector('h3'), {
                    color: '#6b7280',
                    fontSize: '1.875rem',
                    duration: 0.3,
                  });
                }
              },
            },
          });
        });
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
      const handlers: { img: Element, enter: () => void, leave: () => void }[] = [];

      profileImages.forEach((img, index) => {
        const correspondingName = nameElements[index];

        const onEnter = () => {
          const letters = correspondingName?.querySelectorAll('.letter');

          gsap.to(img, {
            width: 230,
            height: 230,
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
        };

        const onLeave = () => {
          const letters = correspondingName?.querySelectorAll('.letter');

          gsap.to(img, {
            width: 138,
            height: 138,
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
        };

        img.addEventListener('mouseenter', onEnter);
        img.addEventListener('mouseleave', onLeave);
        handlers.push({ img, enter: onEnter, leave: onLeave });
      });

      return () => {
        handlers.forEach(({ img, enter, leave }) => {
          img.removeEventListener('mouseenter', enter);
          img.removeEventListener('mouseleave', leave);
        });
      };
    }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const isEntryBlocking = !forceReveal && !canRevealEntry;

  const teamMembers = [
    { name: 'Goutham', image: '/team/Goutham.png', alt: 'Goutham' },
    { name: 'Rakesh', image: '/team/Rakesh.png', alt: 'Rakesh' },
    { name: 'Pujith', image: '/team/Pujith.png', alt: 'Pujith' },
    { name: 'Dhruv', image: '/team/Dhruv.png', alt: 'Dhruv' },
    { name: 'Nithin', image: '/team/Nithin.PNG', alt: 'Nithin' },
    { name: 'Udit', image: '/team/Udit.png', alt: 'Udit' },
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
        <Suspense fallback={null}>
          <WaterRipple />
        </Suspense>
      </section>

      <section
        id="about-data"
        aria-label="About"
        className="relative z-10 bg-black px-8 py-20 md:px-12 md:py-32 flex justify-center mb-[100px]"
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

      <section className="make-it-matter-section relative z-10 bg-black px-8 pt-20 pb-20 md:px-12 flex justify-center">
        <div className="w-full max-w-6xl">
          <Copy blockColor="#ffffff" delay={0.1}>
            <h2 className="text-5xl md:text-7xl font-bold text-white text-center mb-16">Make it Matter.</h2>
          </Copy>

          <div className="focus-areas-container grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
            <div className="left-images sticky top-1/3 h-96 hidden md:flex items-center justify-center">
              <FocusAreaFluid
                currentImageUrl={images[activeTopicIndex]}
                nextImageUrl={images[(activeTopicIndex + 1) % images.length]}
              />
            </div>

            <div className="right-content">
              <div className="focus-items-list space-y-8">
                {[
                  { title: 'Strategy' },
                  { title: 'Branding' },
                  { title: 'Art Direction' },
                  { title: 'Visual Design' },
                  { title: 'Graphic Design' },
                  { title: 'Interactive Design' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="focus-item transition-all duration-500"
                  >
                    <p className="text-xs text-gray-600 mb-2 uppercase tracking-wider">Areas of focus</p>
                    <Copy blockColor="#6b7280" delay={index * 0.1} stagger={0.05}>
                      <h3 className="text-4xl md:text-6xl font-bold text-gray-500 transition-all duration-500">{item.title}</h3>
                    </Copy>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="team">
        <div className="profile-images">
          {teamMembers.map((member, index) => (
            <div key={index} className="img">
              <img
                src={member.image}
                alt={member.alt}
                width={138}
                height={138}
                loading="lazy"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
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
