import { useRef } from 'react';

export default function TeamsParallax() {
  const container = useRef(null);

  return (
    <div ref={container} className="parallax-container relative w-full h-full overflow-hidden bg-transparent flex flex-col justify-between pt-[5vh]">
      <div className="absolute left-8 top-8 z-10 flex w-full justify-start text-[#f3f7a8] font-light">
        <div className="w-[100px]">
          <img src="/favicon.svg" alt="SPRDLX" className="h-auto w-full" />
        </div>
      </div>

      <div className="mx-auto w-[80%] px-[2em] pb-0 pt-[8em] font-sans text-[1.4em] font-light leading-[1.4] text-[#f3f7a8]">
        Our team has crafted impactful, full-service work that finds <br />
        your audience where they already are.
      </div>

      <div className="mx-auto w-full overflow-hidden whitespace-nowrap pt-[4em]">
        <span
          className="inline-block text-[28em] font-bold uppercase text-[#f3f7a8]"
          style={{
            fontFamily: '"Thunder", sans-serif',
            animation: 'teams-marquee-animation 80s linear infinite',
          }}
        >
          Creative. Technology. Media. Creative. Technology. Media. Creative. Technology. Media.
          Creative. Technology. Media. Creative. Technology. Media.
        </span>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes teams-marquee-animation {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-100%, 0); }
        }
      `
      }} />
    </div>
  );
}
