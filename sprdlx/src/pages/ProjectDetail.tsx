import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const project = projects.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    (window as any).lenisInstance?.start();
  }, [id]);

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center text-white bg-black">Project not found</div>;
  }

  const projectIndex = projects.findIndex(p => p.id === id);
  const prevProject = projects[projectIndex - 1] || projects[projects.length - 1];
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-white selection:text-black">
      {/* No menu button */}

      {/* Hero */}
      <section
        className="w-full px-5 pb-8 pt-[max(5.5rem,env(safe-area-inset-top))] sm:px-6 sm:pb-8 md:px-8"
        aria-labelledby="project-hero-title"
      >
        <div className="relative h-[min(42vh,22rem)] w-full overflow-hidden rounded-2xl sm:h-[40vh] sm:rounded-[2rem] md:h-[50vh]">
          <BlurUpImg
            src={project.image}
            alt={`${project.title} — hero`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center px-3 sm:px-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-6 md:px-12 md:py-8 rounded-2xl flex items-center justify-center max-w-[min(96vw,36rem)] text-center">
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
            <div>
              <p id="chapter-overview" className="font-mono text-sm uppercase tracking-[0.32em] text-red-500 mb-6">
                01 — Overview
              </p>
            </div>

            <div className="flex flex-col lg:flex-row lg:gap-16">
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-5xl md:text-6xl font-bold tracking-tight font-serif mb-6">{project.title}</h2>
                  <p className="text-zinc-400 text-lg leading-snug font-medium">{project.desc}</p>
                </div>

                <div className="mt-16">
                  <button
                    type="button"
                    data-cursor="view"
                    className="group inline-flex cursor-pointer items-center gap-4 border-0 bg-transparent px-0 py-2 text-left transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/35"
                  >
                    <span className="view-work-icon inline-flex h-8 w-8 shrink-0 items-center justify-center" aria-hidden>
                      <svg
                        className="h-8 w-8"
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
                    <span className="view-work-chromatic font-serif text-base font-normal italic tracking-tight text-zinc-100">
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
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-left font-bold text-base sm:justify-end sm:text-right">
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
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-left font-bold text-base sm:justify-end sm:text-right">
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
                      <span className="text-left font-bold text-base sm:justify-end sm:text-right">{project.status}</span>
                    </div>
                  ) : (
                    'completed' in project &&
                    project.completed && (
                      <div className="flex flex-col gap-1 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                        <span className="shrink-0 font-mono text-[0.7rem] font-medium uppercase tracking-wider text-zinc-500">
                          Completed
                        </span>
                        <span className="text-left font-bold text-base sm:justify-end sm:text-right">{project.completed}</span>
                      </div>
                    )
                  )}
                  {'fundingStage' in project && project.fundingStage ? (
                    <div className="flex flex-col gap-1 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                      <span className="shrink-0 font-mono text-[0.7rem] font-medium uppercase tracking-wider text-zinc-500">
                        Funding Stage
                      </span>
                      <span className="flex flex-wrap items-center gap-1.5 text-left font-bold text-base sm:justify-end sm:text-right">
                        {project.fundingStage}
                        <span className="text-white" aria-hidden>
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
                      <span className="flex flex-wrap items-center gap-2 text-left font-bold text-base sm:justify-end sm:text-right">
                        {project.backedByLogo === 'Y' ? (
                          <span className="bg-white text-black px-1.5 py-0.5 rounded-sm text-[10px] font-black leading-none">
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
            <p id="chapter-narrative" className="font-mono text-[0.65rem] uppercase tracking-[0.32em] text-[#ccff00]/55">
              02 — Narrative
            </p>
          </div>
          <div className="flex flex-1 flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            <div className="flex w-full flex-col justify-center lg:w-1/2">
              <p className="max-w-2xl text-left text-lg font-serif italic leading-[1.55] tracking-[-0.01em] text-zinc-100 sm:text-xl md:text-2xl md:leading-[1.6]">
                {project.about}
              </p>
            </div>
            <div className="w-full lg:w-1/2">
              <BlurUpImg
                src={project.images[0]}
                alt={`${project.title} detail`}
                className="w-full rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Gallery */}
      {project.images[1] ? (
        <section className="border-t border-white/10" aria-labelledby="chapter-gallery">
          <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20 md:pb-32">
            <p id="chapter-gallery" className="font-mono text-[0.65rem] uppercase tracking-[0.32em] text-[#ccff00]/55 mb-10 md:mb-14">
              03 — Gallery
            </p>
            <BlurUpImg
              src={project.images[1]}
              alt={`${project.title} showcase`}
              className="w-full rounded-[2rem] shadow-2xl"
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
            className="hover:text-white transition-colors flex items-center gap-4 order-2 sm:order-1 no-underline"
          >
            <span className="not-italic text-sm font-sans opacity-50">Prev</span>
            {prevProject.title}
          </VTLink>
          <VTLink
            to="/projects"
            data-cursor="view"
            className="hover:text-white transition-colors not-italic font-sans font-medium text-sm uppercase tracking-widest order-1 sm:order-2 no-underline"
          >
            All Projects
          </VTLink>
          <VTLink
            to={`/project/${nextProject.id}`}
            data-cursor="view"
            className="hover:text-white transition-colors flex items-center gap-4 justify-end order-3 no-underline"
          >
            {nextProject.title}
            <span className="not-italic text-sm font-sans opacity-50">Next</span>
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
