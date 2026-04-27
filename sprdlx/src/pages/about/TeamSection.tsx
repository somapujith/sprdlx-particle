import './team-styles.css';

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
  return (
    <section className="team">
      {members.map((member) => (
        <div key={member.initial} className="team-member">
          <div className="team-member-card">
            <div className="team-member-img">
              <img src={member.image} alt={`${member.name} ${member.surname}`} />
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
