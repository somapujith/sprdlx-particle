import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './team-styles.css';

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
  initial: string;
  image: string;
  role: string;
  name: string;
  surname: string;
}

interface TeamSectionProps {
  members: TeamMember[];
}

export default function TeamSection({ members }: TeamSectionProps) {
  const teamSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const teamSection = teamSectionRef.current;
    if (!teamSection) return;

    const teamMembers = gsap.utils.toArray('.team-member') as HTMLElement[];
    const teamMemberCards = gsap.utils.toArray('.team-member-card') as HTMLElement[];

    let cardPlaceholderEntrance: any = null;
    let cardSlideInAnimation: any = null;

    function initTeamAnimations() {
      if (window.innerWidth < 1000) {
        if (cardPlaceholderEntrance) cardPlaceholderEntrance.kill();
        if (cardSlideInAnimation) cardSlideInAnimation.kill();

        teamMembers.forEach((member) => {
          gsap.set(member, { clearProps: 'all' });
          const teamMemberInitial = member.querySelector('.team-member-name-initial h1');
          gsap.set(teamMemberInitial, { clearProps: 'all' });
        });

        teamMemberCards.forEach((card) => {
          gsap.set(card, { clearProps: 'all' });
        });

        return;
      }

      if (cardPlaceholderEntrance) cardPlaceholderEntrance.kill();
      if (cardSlideInAnimation) cardSlideInAnimation.kill();

      cardPlaceholderEntrance = ScrollTrigger.create({
        trigger: teamSection,
        start: 'top bottom',
        end: 'top top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          teamMembers.forEach((member, index) => {
            const entranceDelay = 0.15;
            const entranceDuration = 0.7;
            const entranceStart = index * entranceDelay;
            const entranceEnd = entranceStart + entranceDuration;

            if (progress >= entranceStart && progress <= entranceEnd) {
              const memberEntranceProgress = (progress - entranceStart) / entranceDuration;

              const entranceY = 125 - memberEntranceProgress * 125;
              gsap.set(member, { y: `${entranceY}%` });

              const teamMemberInitial = member.querySelector('.team-member-name-initial h1');
              const initialLetterScaleDelay = 0.4;
              const initialLetterScaleProgress = Math.max(
                0,
                (memberEntranceProgress - initialLetterScaleDelay) / (1 - initialLetterScaleDelay)
              );
              gsap.set(teamMemberInitial, { scale: initialLetterScaleProgress });
            } else if (progress > entranceEnd) {
              gsap.set(member, { y: '0%' });
              const teamMemberInitial = member.querySelector('.team-member-name-initial h1');
              gsap.set(teamMemberInitial, { scale: 1 });
            }
          });
        },
      });

      cardSlideInAnimation = ScrollTrigger.create({
        trigger: teamSection,
        start: 'top top',
        end: `+=${window.innerHeight * 3}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          teamMemberCards.forEach((card, index) => {
            const slideInStagger = 0.075;
            const xRotationDuration = 0.4;
            const xRotationStart = index * slideInStagger;
            const xRotationEnd = xRotationStart + xRotationDuration;

            if (progress >= xRotationStart && progress <= xRotationEnd) {
              const cardProgress = (progress - xRotationStart) / xRotationDuration;

              const cardInitialX = 300 - index * 100;
              const cardTargetX = -50;
              const cardSlideInX = cardInitialX + cardProgress * (cardTargetX - cardInitialX);

              const cardSlideInRotation = 20 - cardProgress * 20;

              gsap.set(card, {
                x: `${cardSlideInX}%`,
                rotation: cardSlideInRotation,
              });
            } else if (progress > xRotationEnd) {
              gsap.set(card, {
                x: '-50%',
                rotation: 0,
              });
            }

            const cardScaleStagger = 0.12;
            const cardScaleStart = 0.4 + index * cardScaleStagger;
            const cardScaleEnd = 1;

            if (progress >= cardScaleStart && progress <= cardScaleEnd) {
              const scaleProgress = (progress - cardScaleStart) / (cardScaleEnd - cardScaleStart);
              const scaleValue = 0.75 + scaleProgress * 0.25;

              gsap.set(card, {
                scale: scaleValue,
              });
            } else if (progress > cardScaleEnd) {
              gsap.set(card, {
                scale: 1,
              });
            }
          });
        },
      });
    }

    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initTeamAnimations();
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener('resize', handleResize);
    initTeamAnimations();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      if (cardPlaceholderEntrance) cardPlaceholderEntrance.kill();
      if (cardSlideInAnimation) cardSlideInAnimation.kill();
    };
  }, []);

  return (
    <section
      ref={teamSectionRef}
      className="team relative w-full min-h-screen bg-black py-20"
    >
      {members.map((member) => (
        <div key={member.initial} className="team-member relative">
          <div className="team-member-name-initial absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-[20rem] font-bold leading-none text-[#fc694c] will-change-transform">
              {member.initial}
            </h1>
          </div>
          <div className="team-member-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+4px)] h-[calc(100%+4px)] p-8 flex flex-col items-center gap-8 bg-[#f2f5ea] rounded-3xl will-change-transform">
            <div className="team-member-img aspect-square rounded-2xl overflow-hidden w-full">
              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
            </div>
            <div className="team-member-info flex flex-col items-center text-center gap-4">
              <p className="text-sm font-medium uppercase tracking-wider text-[#171717]">
                ( {member.role} )
              </p>
              <h1 className="text-6xl font-bold leading-none text-[#fc694c]">
                {member.name} {member.surname && <span className="text-[#171717]">{member.surname}</span>}
              </h1>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
