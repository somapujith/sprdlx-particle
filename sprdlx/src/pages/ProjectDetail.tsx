import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projects } from './projects/data';
import Footer from '../components/Common/Footer';
import VTLink from '../components/Common/VTLink';

function BlurUpImg({ className = '', ...rest }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      {...rest}
      onLoad={(e) => {
        setLoaded(true);
        rest.onLoad?.(e);
      }}
      className={`${className} transition-[filter,opacity,transform] duration-700 ease-out ${
        loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
      }`}
    />
  );
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    (window as any).lenisInstance?.start();
  }, [id]);

  const handleLogoClick = () => {
    navigate('/');
  };

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center text-white bg-black">Project not found</div>;
  }

  const projectIndex = projects.findIndex(p => p.id === id);
  const prevProject = projects[projectIndex - 1] || projects[projects.length - 1];
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-white selection:text-black">
      {/* Fixed Logo */}
      <div className="fixed top-0 left-0 z-50 p-5 sm:p-6 md:p-8">
        <button
          onClick={handleLogoClick}
          className="w-10 h-10 sm:w-12 sm:h-12 hover:opacity-70 transition-opacity duration-300 flex items-center justify-center"
          aria-label="Back to home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 873 774" className="w-full h-full">
            <path fill="white" d="M578 587.2c-19.3-19-42.1-41-64.2-63.7-4-4-7-11-7-16.8-.7-32-.4-64-.4-97.3 5-.2 9.1-.5 13.2-.5 27.9-.1 55.8.3 83.6-.3 8.6-.1 14.1 3 20.1 8.7 22 21.2 44.6 41.6 68 63.3l33.5-32.4c13.4-12.9 24.7-30.8 40.6-37.2 16.4-6.6 37.3-2 56.2-2.1 16.2-.2 32.4 0 50 0v55c-.2 17.4 4 36.6-2.2 51.5-6 14.6-22.3 25-34.5 37-12.6 12.4-25.6 24.4-37.8 36.1 22.2 22.9 42.3 44.2 63.3 64.7 8 7.9 11.8 15.7 11.5 27.2-.8 30.5-.3 61-.3 92.5-3.3.4-6.2 1-9.1 1-29.7 0-59.4.3-89.1-.3a25.7 25.7 0 0 1-15.7-7c-19.7-19.2-39-38.7-57.8-58.8-7.8-8.4-12.6-9.4-20.8-.2a1453.3 1453.3 0 0 1-57 59.6 23.5 23.5 0 0 1-14.7 6.4c-30 .5-60.1-.1-90.2.4-9 .1-11-3-11-11.4.5-29.8 0-59.6.5-89.3.1-5 3-11 6.5-14.9 20.7-23.4 42-46.4 64.7-71.2Zm-1.4-204.4V.8c4.5-.3 8.2-.7 12-.7 72 0 144-.2 215.9.3 6.1 0 13.5 3.1 18 7.3A844.6 844.6 0 0 1 866 51.2a21 21 0 0 1 5.4 13c.4 37.4.4 75 0 112.5 0 4.7-2.8 10.3-6 14-12.4 14.8-25.5 29-39.2 44.5 13 14.8 26.2 28.8 38.2 43.8 3.9 4.8 6.8 12 7 18.2.6 28.2.2 56.4.2 86.6-13.4 0-26.6-1.8-39.3.3-32.1 5.3-54.9-6.9-73.7-32.4-11.8-15.9-26.8-29.4-42.6-46.5v77.6H576.7Zm140-273.1v55.1h12.8c0-16-.3-31.4.2-46.7.3-10-4.4-11-13-8.4ZM272.4 1v134.1h-92.2c3.5 4.4 5.2 7 7.4 9.3 26.2 26.3 52.7 52.3 78.5 79a25.8 25.8 0 0 1 6.5 15.9c.7 25.5.5 51 .1 76.5 0 4.2-1.5 9.3-4.1 12.4a1554.2 1554.2 0 0 1-45.4 49.7 18 18 0 0 1-11.6 5.6c-68.5.4-137 .3-205.5.2-1.5 0-3-.4-5-.8V247.3h81.7c-4.2-4.8-6.4-7.7-9-10.2-21.8-22-43.4-44-65.6-65.6a24.2 24.2 0 0 1-7.8-19.4C.7 122.7.3 93.3.8 64c0-4.7 2.5-10.5 5.8-14 14.3-15.1 29-29.8 44.2-44.3 3-2.9 7.9-5.3 12-5.3 67.6-.4 135.3-.4 203-.4 1.9 0 3.7.5 6.5 1ZM.9 408.8H68c43.3 0 86.7-.2 130 .3a26 26 0 0 1 16 6.6c15.4 14.5 35.8 27.5 43.4 45.7 7.7 18.1 2.4 41.8 2.5 63 .1 61.9.2 123.8-.3 185.6 0 6.1-3.2 13.4-7.4 18a582.3 582.3 0 0 1-39.6 39 26 26 0 0 1-16 6.6c-31 0-61.8-1.3-92.7-1.3s-62.6.8-94 1.7c-7.4.2-10-2.2-10-9.9.2-116 .1-232 .2-348 0-2 .3-3.8.7-7.3Zm123.6 260.4c7.5 2.5 11.3 1.3 11.2-7.4-.2-47.2-.2-94.4 0-141.6.1-9.3-3.8-10.2-11.2-7.6v156.6Zm164.9-286.3V.9c3.7-.2 7.4-.8 11-.8C366 0 431.3-.1 496.7.3a27 27 0 0 1 17 7 770.1 770.1 0 0 1 41.6 42c3.3 3.5 5.8 9.3 5.8 14 .4 49.5.4 99 0 148.5a21 21 0 0 1-5.4 13 986.8 986.8 0 0 1-43.4 43.4 23.1 23.1 0 0 1-14.2 5.6c-23.5.5-47.1.2-72 .2v109H289.5ZM425.6 164l3.8 2.8c2.2-2.4 6.1-4.8 6.2-7.2.6-15 .5-30 0-45.1 0-2-3.2-4-5-6-1.6 2-4.7 4-4.8 6-.4 16.5-.2 33-.2 49.5Zm66.5 608.9H275.8V409.7H404v243.4h88v119.8Z" />
          </svg>
        </button>
      </div>

      {/* Hero */}
      <section
        className="w-full px-5 pb-8 pt-[max(5.5rem,env(safe-area-inset-top))] sm:px-6 sm:pb-8 md:px-8"
        aria-labelledby="project-hero-title"
      >
        <div className="relative h-[min(42vh,22rem)] w-full overflow-hidden rounded-2xl sm:h-[40vh] sm:rounded-[2rem] md:h-[50vh]">
          <BlurUpImg
            src={project.id === 'anthill' ? '/projects/assets/anthill2.png' : project.image}
            alt={`${project.title} — hero`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center px-3 sm:px-4">
            <div className="bg-black/40 backdrop-blur-md border border-white/20 px-8 py-6 md:px-12 md:py-8 rounded-xl flex items-center justify-center max-w-[min(96vw,36rem)] text-center">
              <h1
                id="project-hero-title"
                className="m-0 font-sans font-bold uppercase tracking-[0.14em] text-white text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight"
              >
                {project.title.toUpperCase()}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* 01 — Overview */}
      <section className="border-t border-white/10 flex justify-center" aria-labelledby="chapter-overview">
        <div className="w-full max-w-7xl px-5 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28 flex flex-col gap-12">

            <div className="flex flex-col lg:flex-row lg:gap-16">
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-5xl md:text-6xl font-bold tracking-tight font-serif mb-6 text-white">{project.title}</h2>
                  <p className="text-zinc-300 text-lg leading-relaxed font-medium">{project.desc}</p>
                </div>

                <div className="mt-16">
                  <button
                    type="button"
                    data-cursor="view"
                    onClick={() => project.website && window.open(project.website, '_blank')}
                    disabled={!project.website}
                    className="group inline-flex cursor-pointer items-center gap-3 border border-white/30 bg-transparent hover:bg-white/5 px-6 py-3 rounded-lg transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/50 disabled:opacity-50 disabled:cursor-default"
                  >
                    <span className="view-work-icon inline-flex h-5 w-5 shrink-0 items-center justify-center text-white group-hover:text-white/80 transition-colors" aria-hidden>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="1.35"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 9V3h6M15 3h6v6M3 15v6h6M21 15v6h-6"
                        />
                        <path
                          stroke="currentColor"
                          strokeWidth="1.35"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h5M14 12l-2-2M14 12l-2 2"
                        />
                      </svg>
                    </span>
                    <span className="view-work-chromatic font-sans text-sm font-semibold uppercase tracking-wide text-white group-hover:text-white/80 transition-colors">
                      View work
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col border-t border-white/10 text-sm">
                  <div className="flex flex-col gap-1 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                    <span className="shrink-0 font-mono text-[0.7rem] font-medium uppercase tracking-wider text-zinc-500">
                      Industry
                    </span>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-left font-bold text-base sm:justify-end sm:text-right text-white/90">
                      <span>{project.industry}</span>
                      {project.subIndustry ? (
                        <>
                          <span className="text-white/25" aria-hidden>
                            ·
                          </span>
                          <span>{project.subIndustry}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                    <span className="shrink-0 font-mono text-[0.7rem] font-medium uppercase tracking-wider text-zinc-500">
                      Deliverables
                    </span>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-left font-bold text-base sm:justify-end sm:text-right text-white/90">
                      {project.deliverables.map((d, i) => (
                        <React.Fragment key={i}>
                          <span>{d}</span>
                          {i !== project.deliverables.length - 1 && (
                            <span className="text-white/25 font-normal" aria-hidden>
                              ,
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  {'status' in project && project.status ? (
                    <div className="flex flex-col gap-1 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                      <span className="shrink-0 font-mono text-[0.7rem] font-medium uppercase tracking-wider text-zinc-500">
                        Status
                      </span>
                      <span className="text-left font-bold text-base sm:justify-end sm:text-right text-white/90">{project.status}</span>
                    </div>
                  ) : (
                    'completed' in project &&
                    project.completed && (
                      <div className="flex flex-col gap-1 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                        <span className="shrink-0 font-mono text-[0.7rem] font-medium uppercase tracking-wider text-zinc-500">
                          Completed
                        </span>
                        <span className="text-left font-bold text-base sm:justify-end sm:text-right text-white/90">{project.completed}</span>
                      </div>
                    )
                  )}
                  {'fundingStage' in project && project.fundingStage ? (
                    <div className="flex flex-col gap-1 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                      <span className="shrink-0 font-mono text-[0.7rem] font-medium uppercase tracking-wider text-zinc-500">
                        Funding Stage
                      </span>
                      <span className="flex flex-wrap items-center gap-1.5 text-left font-bold text-base sm:justify-end sm:text-right text-white/90">
                        {project.fundingStage}
                        <span className="text-pink-400" aria-hidden>
                          ♥
                        </span>
                      </span>
                    </div>
                  ) : null}
                  {project.backedBy || project.backedByLogo ? (
                    <div className="flex flex-col gap-1 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                      <span className="shrink-0 font-mono text-[0.7rem] font-medium uppercase tracking-wider text-zinc-500">
                        Backed by
                      </span>
                      <span className="flex flex-wrap items-center gap-2 text-left font-bold text-base sm:justify-end sm:text-right text-white/90">
                        {project.backedByLogo === 'Y' ? (
                          <span className="bg-white text-black px-2 py-1 rounded-md text-[11px] font-black leading-none">
                            Y
                          </span>
                        ) : (
                          <span className="font-bold tracking-widest">{project.backedByLogo || project.backedBy}</span>
                        )}
                        {project.backedByLogo === 'Y' ? 'Combinator' : ''}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* 02 — Narrative */}
      <section className="border-t border-white/10" aria-labelledby="chapter-narrative">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-10 px-5 py-16 sm:gap-12 sm:px-6 sm:py-20 md:px-8 md:py-28 lg:flex-row lg:gap-20">
          <div className="lg:w-[min(100%,18rem)] lg:shrink-0 lg:sticky lg:top-28">
            <p id="chapter-narrative" className="font-sans text-lg uppercase tracking-[0.15em] text-white font-bold">
              Narrative
            </p>
          </div>
          <div className="flex flex-1 flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            <div className="flex w-full flex-col justify-center lg:w-2/5">
              <p className="max-w-xl text-left text-lg font-serif italic leading-[1.6] tracking-[-0.01em] text-zinc-200 sm:text-xl md:text-2xl md:leading-[1.7]">
                {project.about}
              </p>
            </div>
            <div className="w-full lg:w-3/5">
              <BlurUpImg
                src={project.images[0]}
                alt={`${project.title} detail`}
                className="w-full rounded-3xl shadow-2xl ring-1 ring-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Gallery */}
      {project.images[1] ? (
        <section className="border-t border-white/10" aria-labelledby="chapter-gallery">
          <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20 md:pb-32">
            <p id="chapter-gallery" className="font-sans text-lg uppercase tracking-[0.15em] text-white font-bold mb-10 md:mb-14">
              Gallery
            </p>
            <BlurUpImg
              src={project.id === 'anthill' ? project.images[3] : project.images[1]}
              alt={`${project.title} showcase`}
              className="w-full rounded-[2rem] shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </section>
      ) : null}

      {/* Prev / Next */}
      <div className="w-full border-t border-white/10 px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 text-base font-serif italic text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:text-lg">
          <VTLink
            to={`/project/${prevProject.id}`}
            data-cursor="view"
            className="hover:text-white transition-colors flex items-center gap-4 order-2 sm:order-1 no-underline group"
          >
            <span className="not-italic text-sm font-sans opacity-50 group-hover:opacity-70 transition-opacity">Prev</span>
            <span className="group-hover:text-white">{prevProject.title}</span>
          </VTLink>
          <VTLink
            to="/projects"
            data-cursor="view"
            className="hover:text-white transition-colors not-italic font-sans font-medium text-sm uppercase tracking-widest order-1 sm:order-2 no-underline border border-white/30 hover:border-white/50 px-4 py-2 rounded-lg"
          >
            All Projects
          </VTLink>
          <VTLink
            to={`/project/${nextProject.id}`}
            data-cursor="view"
            className="hover:text-white transition-colors flex items-center gap-4 justify-end order-3 no-underline group"
          >
            <span className="group-hover:text-white">{nextProject.title}</span>
            <span className="not-italic text-sm font-sans opacity-50 group-hover:opacity-70 transition-opacity">Next</span>
          </VTLink>
        </div>
      </div>

      <Footer />

      <div
        className="pointer-events-none fixed inset-0 z-40 bg-black transition-opacity duration-600 ease-in-out"
        style={{ opacity: 0 }}
        aria-hidden
      />
    </main>
  );
}
