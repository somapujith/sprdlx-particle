import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagneticLink } from '../components/ui/MagneticLink';
import MenuOverlay from '../components/Canvas/MenuOverlay';
import { useSEO } from '../hooks/useSEO';

const CONTACT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact SPRDLX',
  description: 'Get in touch with SPRDLX to discuss your next immersive web project, design system, or digital product.',
  url: 'https://sprdlx.com/contact',
  mainEntity: {
    '@type': 'Organization',
    name: 'SPRDLX',
    email: 'hello@sprdlx.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      addressCountry: 'IN',
    },
  },
};

function Contact() {
  useSEO({
    title: 'Contact SPRDLX — Let\'s Build Something Amazing',
    description: 'Ready to create an immersive digital experience? Contact SPRDLX at hello@sprdlx.com. Based in Hyderabad, we work with ambitious startups worldwide.',
    canonical: '/contact',
    schema: CONTACT_SCHEMA,
  });
  const navigate = useNavigate();

  useEffect(() => {
    (window as any).lenisInstance?.stop();
  }, []);

  const handleSendMessage = () => {
    window.location.href = 'mailto:hello@sprdlx.com';
  };

  return (
    <div className="contact-container relative w-full h-screen bg-black text-white font-sans overflow-hidden flex flex-col items-center justify-center">
      <MenuOverlay />

      {/* Contact Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-2xl px-6">
        <p className="text-sm md:text-base font-light uppercase tracking-widest text-white/60 mb-6">
          Get In Touch
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-8 leading-tight">
          Let's Create<br />Something Amazing
        </h1>

        {/* Contact Details */}
        <div className="flex flex-col items-center gap-4 mt-12 mb-12">
          {/* Email */}
          <div className="flex flex-col items-center">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-2">
              Email
            </p>
            <MagneticLink
              href="mailto:hello@sprdlx.com"
              className="text-lg md:text-xl text-white hover:opacity-70 transition-opacity"
            >
              hello@sprdlx.com
            </MagneticLink>
          </div>

          {/* Location */}
          <div className="flex flex-col items-center">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-2">
              Location
            </p>
            <p className="text-lg md:text-xl text-white">
              Hyderabad
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleSendMessage}
          className="px-8 py-4 border border-white text-white uppercase tracking-widest font-medium hover:bg-white hover:text-black transition-all duration-300"
        >
          Send Message
        </button>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full z-20 flex justify-center gap-6 text-xs font-medium uppercase tracking-widest py-8 px-6 border-t border-white/10 bg-black/50 backdrop-blur">
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
          href="/about"
          onClick={(e) => {
            e.preventDefault();
            (window as any).lenisInstance?.stop();
            setTimeout(() => navigate('/about'), 600);
          }}
          className="text-[#888888] hover:opacity-80"
        >
          ABOUT
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
      </footer>
    </div>
  );
}

export default Contact;
