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

    function initTeamAnimations() {
      if (window.innerWidth < 768) {
        teamMembers.forEach((member) => {
          gsap.set(member, { clearProps: 'all' });
          const initial = member.querySelector('.team-member-name-initial h1');
          gsap.set(initial, { clearProps: 'all' });
        });
        return;
      }

      ScrollTrigger.create({
        trigger: teamSection,
        start: 'top center',
        end: 'center center',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          teamMembers.forEach((member, index) => {
            const stagger = 0.08;
            const start = index * stagger;
            const end = start + 0.6;

            if (progress >= start && progress <= end) {
              const memberProgress = (progress - start) / (end - start);
              const y = 100 - memberProgress * 100;
              gsap.set(member, { y: `${y}px`, opacity: memberProgress });

              const initial = member.querySelector('.team-member-name-initial h1');
              gsap.set(initial, { scale: memberProgress });
            } else if (progress > end) {
              gsap.set(member, { y: 0, opacity: 1 });
              const initial = member.querySelector('.team-member-name-initial h1');
              gsap.set(initial, { scale: 1 });
            }
          });
        },
      });
    }

    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        initTeamAnimations();
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener('resize', handleResize);
    initTeamAnimations();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={teamSectionRef} className="team">
      {members.map((member) => (
        <div key={member.initial} className="team-member">
          <div className="team-member-name-initial">
            <h1>{member.initial}</h1>
          </div>
          <div className="team-member-card">
            <div className="team-member-img">
              <img src={member.image} alt={member.name} />
            </div>
            <div className="team-member-info">
              <p>( {member.role} )</p>
              <h1>
                {member.name} {member.surname && <span>{member.surname}</span>}
              </h1>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
