import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const teamMembers = [
  { name: 'Goutham', img: 'Goutham.png' },
  { name: 'Dhruv', img: 'Dhruv.png' },
  { name: 'Nithin', img: 'Nithin.PNG' },
  { name: 'Pujith', img: 'Pujith.png' },
  { name: 'Rakesh', img: 'Rakesh.png' },
  { name: 'Udit', img: 'Udit.png' },
];

export default function InteractiveTeamSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const profileImagesContainer = document.querySelector('.profile-images') as HTMLElement;
      const profileImages = document.querySelectorAll('.profile-images .img');
      const nameElements = document.querySelectorAll('.profile-names .name');
      const nameHeadings = document.querySelectorAll('.profile-names .name h1');

      nameHeadings.forEach((heading) => {
        const split = new SplitText(heading, { type: 'chars' });
        split.chars.forEach((char) => {
          char.classList.add('letter');
        });
      });

      const defaultLetters = nameElements[0].querySelectorAll('.letter');
      gsap.set(defaultLetters, { y: '100%' });

      if (window.innerWidth >= 900) {
        profileImages.forEach((imgElement, index) => {
          const img = imgElement as HTMLElement;
          const correspondingName = nameElements[index + 1];
          const letters = correspondingName.querySelectorAll('.letter');

          img.addEventListener('mouseenter', () => {
            gsap.to(img, {
              width: 300,
              height: 300,
              duration: 0.5,
              ease: 'power4.out',
            });

            gsap.to(letters, {
              y: '-100%',
              ease: 'power4.out',
              duration: 0.75,
              stagger: {
                each: 0.025,
                from: 'center',
              },
            });
          });

          img.addEventListener('mouseleave', () => {
            gsap.to(img, {
              width: 150,
              height: 150,
              duration: 0.5,
              ease: 'power4.out',
            });

            gsap.to(letters, {
              y: '0%',
              ease: 'power4.out',
              duration: 0.75,
              stagger: {
                each: 0.025,
                from: 'center',
              },
            });
          });
        });

        if (profileImagesContainer) {
          profileImagesContainer.addEventListener('mouseenter', () => {
            gsap.to(defaultLetters, {
              y: '0%',
              ease: 'power4.out',
              duration: 0.75,
              stagger: {
                each: 0.025,
                from: 'center',
              },
            });
          });

          profileImagesContainer.addEventListener('mouseleave', () => {
            gsap.to(defaultLetters, {
              y: '100%',
              ease: 'power4.out',
              duration: 0.75,
              stagger: {
                each: 0.025,
                from: 'center',
              },
            });
          });
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-full flex-col items-center justify-center gap-10 overflow-hidden bg-black text-[#e3e3db] max-lg:flex-col-reverse"
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url("https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
        .letter {
          position: relative;
          transform: translateY(0%);
          will-change: transform;
          display: inline-block;
        }
        `
      }} />

      <div className="profile-images flex w-max items-center justify-center max-lg:max-w-[90%] max-lg:flex-wrap z-10">
        {teamMembers.map((member, i) => (
          <div
            key={i}
            className="img relative h-[150px] w-[150px] cursor-pointer p-[10px] max-lg:h-[100px] max-lg:w-[100px] max-lg:p-[5px]"
            style={{ willChange: 'width, height' }}
          >
            <img
              src={`/codegrid-team/${member.img}`}
              alt={member.name}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
        ))}
      </div>

      <div
        className="profile-names relative h-[15rem] w-full overflow-hidden max-lg:h-[4rem]"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
      >
        <div className="name default absolute inset-0">
          <h1
            className="absolute w-full -translate-y-[100%] select-none text-center uppercase font-black leading-none tracking-[-0.2rem] text-[#e3e3db] max-lg:text-[4rem] max-lg:tracking-normal"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '15rem' }}
          >
            The Squad
          </h1>
        </div>
        {teamMembers.map((member, i) => (
          <div key={i} className="name absolute inset-0">
            <h1
              className="absolute w-full translate-y-[100%] select-none text-center uppercase font-black leading-none tracking-[-0.2rem] text-[#f3f7a8] max-lg:text-[4rem] max-lg:tracking-normal"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '15rem' }}
            >
              {member.name}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}
