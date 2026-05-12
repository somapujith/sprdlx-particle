import { RefObject } from 'react';
import { Link } from 'react-router-dom';
import { ABOUT_LONG_COPY } from '../aboutData';

type Props = {
  textContainerRef: RefObject<HTMLHeadingElement | null>;
};

export default function AboutIntroSection({ textContainerRef }: Props) {
  return (
    <section
      id="about-data"
      aria-label="About"
      className="relative z-10 bg-[color:var(--color-bg)] px-8 py-20 md:px-12 md:py-32 flex justify-center"
      style={{ marginBottom: '620px' }}
    >
      <div className="w-full max-w-5xl flex flex-col justify-center items-center">
        <div className="font-sans text-center [font-family:var(--font-sf),ui-sans-serif,system-ui,sans-serif]">
          <h2
            ref={textContainerRef}
            className="text-2xl font-light leading-snug tracking-tight text-[color:var(--color-text)] md:text-3xl md:leading-relaxed lg:text-4xl lg:leading-snug"
          >
            {ABOUT_LONG_COPY.split(' ').map((word, index) => (
              <span key={index} className="reveal-word inline opacity-0">
                {word}{' '}
              </span>
            ))}
          </h2>
          <p className="mt-10 text-lg font-light text-[color:var(--color-muted)] md:mt-12 md:text-2xl hover:opacity-90 transition-opacity cursor-default">
            SPRDLX — Where Ideas Evolve into Intelligent Digital Realities.
          </p>
          <Link
            to="/about"
            className="mt-8 inline-block text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)] underline decoration-[color:var(--color-muted)] underline-offset-4 hover:text-[color:var(--color-text)] hover:decoration-[color:var(--color-text)] transition-colors md:mt-10"
          >
            Studio layout (alternate)
          </Link>
        </div>
      </div>
    </section>
  );
}
