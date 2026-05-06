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
    <div className="contact-container relative w-full min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center py-16 sm:py-24 md:py-32">
      <MenuOverlay />

      {/* Contact Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-2xl px-4 sm:px-6 w-full">
        <p className="text-xs sm:text-sm md:text-base font-light uppercase tracking-widest text-white/60 mb-4 sm:mb-6">
          Get In Touch
        </p>
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-6 sm:mb-8 md:mb-10 leading-tight">
          Let's Create<br />Something Amazing
        </h1>

        {/* Contact Details */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 mt-8 sm:mt-12 mb-10 sm:mb-14 md:mb-16 w-full">
          {/* Email */}
          <div className="flex flex-col items-center w-full">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-2 sm:mb-3">
              Email
            </p>
            <MagneticLink
              href="mailto:hello@sprdlx.com"
              className="text-base sm:text-lg md:text-xl text-white hover:text-white/70 transition-opacity duration-200 break-all sm:break-normal"
            >
              hello@sprdlx.com
            </MagneticLink>
          </div>

          {/* Location */}
          <div className="flex flex-col items-center w-full">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-2 sm:mb-3">
              Location
            </p>
            <p className="text-base sm:text-lg md:text-xl text-white">
              Hyderabad
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleSendMessage}
          className="px-6 sm:px-8 py-3 sm:py-4 border border-white text-xs sm:text-sm md:text-base text-white uppercase tracking-widest font-medium hover:bg-white hover:text-black transition-all duration-300 whitespace-nowrap"
        >
          Send Message
        </button>
      </div>

    </div>
  );
}

export default Contact;
