import { RefObject } from 'react';
import { ABOUT_LONG_COPY } from './aboutData';

type Props = {
  textContainerRef: RefObject<HTMLHeadingElement | null>;
};

export default function AboutIntroSection({ textContainerRef }: Props) {
  return (
    <section
      id="about-data"
      aria-label="About"
      className="relative z-10 bg-black px-8 py-20 md:px-12 md:py-32 flex justify-center"
      style={{ marginBottom: '620px' }}
    >
      <div className="w-full max-w-5xl flex flex-col justify-center items-center">
        <div className="font-sans text-center">
          <h2
            ref={textContainerRef}
            className="text-2xl font-light leading-snug tracking-tight text-white md:text-3xl md:leading-relaxed lg:text-4xl lg:leading-snug"
          >
            {ABOUT_LONG_COPY.split(' ').map((word, index) => (
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
  );
}
