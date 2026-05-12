import { TEAM_MEMBERS } from '../aboutData';

export default function AboutTeamShowcase() {
  return (
    <section className="team">
      <div className="profile-images">
        {TEAM_MEMBERS.map((member, index) => (
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
        {TEAM_MEMBERS.map((member, index) => (
          <div key={index} className="name">
            <h1>{member.name}</h1>
          </div>
        ))}
      </div>
    </section>
  );
}
