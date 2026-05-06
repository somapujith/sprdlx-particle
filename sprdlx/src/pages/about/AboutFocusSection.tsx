import FocusAreaFluid from '../../components/Canvas/FocusAreaFluid';
import Copy from '../../components/Common/Copy';
import { FOCUS_AREAS, FOCUS_IMAGES } from './aboutData';

type Props = {
  activeTopicIndex: number;
};

export default function AboutFocusSection({ activeTopicIndex }: Props) {
  return (
    <section
      className="make-it-matter-section relative z-10 bg-black px-8 pt-24 md:px-12 flex justify-center"
      style={{ marginTop: '820px', paddingBottom: '1280px' }}
    >
      <div className="w-full max-w-4xl">
        <Copy blockColor="#ffffff" delay={0.1}>
          <h2 className="text-5xl md:text-7xl font-bold text-white/95 text-center mb-8 md:mb-10">Make it Matter.</h2>
        </Copy>

        <div className="focus-areas-container grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10 md:gap-12 items-start">
          <div className="left-images hidden md:flex items-start justify-center pt-14">
            <FocusAreaFluid
              currentImageUrl={FOCUS_IMAGES[activeTopicIndex]}
              nextImageUrl={FOCUS_IMAGES[(activeTopicIndex + 1) % FOCUS_IMAGES.length]}
              className="max-w-[300px]"
              height={170}
            />
          </div>

          <div className="right-content md:pt-10">
            <div className="focus-items-list relative space-y-4">
              <div className="focus-out-overlay pointer-events-none absolute inset-0 bg-black opacity-0" />
              {FOCUS_AREAS.map((item, index) => (
                <div key={index} className="focus-item transition-all duration-500 opacity-40">
                  <p className="text-[10px] text-gray-600/80 mb-1 uppercase tracking-wider">Areas of focus</p>
                  <div className="focus-title-wrap relative inline-block overflow-hidden">
                    <div className="focus-title-revealer absolute inset-0 z-10 origin-left scale-x-0 bg-[#0d0f14]" />
                    <h3 className="focus-title text-4xl md:text-[3.4rem] font-bold text-gray-500/70 transition-all duration-500 leading-[0.92]">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
