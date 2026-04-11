# SPRDLX — Project Context File

> **Last updated:** 2026-04-06  
> **Purpose:** Provide any AI agent or developer with full project understanding at a glance.

---

## 1. What Is This Project?

**SPRDLX** is an **Awwwards-caliber AI venture studio portfolio website** for a digital agency called "SPRDLX" (Super Delux). It showcases the studio's identity, capabilities, and recent work through immersive 3D visuals, particle effects, cinematic animations, and premium typography.

The site was originally scaffolded via **Google AI Studio** (App ID: `9dc67a42-21fa-433e-99cb-9d841412010a`) but has been heavily customized.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | React | 19 |
| **Build tool** | Vite | 6.2 |
| **Language** | TypeScript | 5.8 |
| **Styling** | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) | 4.1 |
| **3D / WebGL** | Three.js + React Three Fiber (R3F) + Drei | three 0.183, R3F 9.5, Drei 10.7 |
| **Animation** | GSAP (with ScrollTrigger) + Framer Motion | gsap 3.14, framer-motion 12.38 |
| **Smooth scroll** | Lenis | 1.3 |
| **Routing** | React Router DOM v7 | 7.14 |
| **i18n** | i18next + react-i18next | i18next 26.0, react-i18next 17.0 |
| **Icons** | Lucide React | 0.546 |
| **Utilities** | clsx + tailwind-merge (`cn()` helper) | — |

### Key Details
- **Tailwind v4** — uses the new `@import "tailwindcss"` + `@theme {}` syntax. No `tailwind.config.js`. Theme tokens are defined in `src/index.css`.
- **Path alias:** `@/*` maps to the project root (`./*`), configured in both `tsconfig.json` and `vite.config.ts`.
- **Env vars:** `GEMINI_API_KEY` is injected via Vite's `define` from `.env.local`. See `.env.example` for the template.
- **HMR:** Can be disabled via `DISABLE_HMR=true` env var (used by AI Studio during agent edits).

---

## 3. Project Structure

```
sprdlx/
├── index.html                      # HTML entry point (title: "My Google AI Studio App" — needs updating)
├── vite.config.ts                  # Vite config: React + Tailwind plugins, path alias, GEMINI key injection
├── tsconfig.json                   # TS config: ES2022, bundler moduleResolution, JSX react-jsx
├── package.json                    # Dependencies and scripts
├── favicon.svg                     # SPRDLX icon/favicon (SVG)
├── sprdlx.svg                      # Full SPRDLX text logo (SVG) — used in footer via import
├── .env.local                      # Local env vars (gitignored)
├── .env.example                    # Env var template
├── .gitignore
│
├── public/
│   ├── anthill-rocket.png           # Texture for "Anthill Ventures" project showcase (MacBook screen)
│   ├── earthquakes_-_2000_to_2019.optimized.glb  # Globe earthquake data (GLB, ~5MB) — About hero particles
│   ├── about/                       # (Empty — reserved for About page assets)
│   └── models/
│       └── macbook-transformed.glb  # MacBook 3D model (~628KB) — About "Recent Work" section
│
├── scripts/
│   └── extract-particle-data.mjs   # Utility: extract particle positions from GLB (offline)
│
└── src/
    ├── main.tsx                     # React entry: StrictMode → <App />
    ├── App.tsx                      # Root: Lenis smooth scroll, GSAP ScrollTrigger, Router, CustomCursor, LoadingScreen
    ├── index.css                    # Global CSS: font imports (Inter, Cormorant Garamond, SF Pro Display), Tailwind, scrollbar hiding, custom cursor
    ├── i18n.ts                      # i18next config with full English translations (nav, hero, about, UI labels)
    ├── vite-env.d.ts                # Vite client types
    ├── r3f-unreal-bloom.d.ts        # Type augmentation for R3F UnrealBloomPass
    │
    ├── lib/
    │   └── utils.ts                 # `cn()` — clsx + tailwind-merge helper
    │
    ├── pages/
    │   ├── Home.tsx                  # Landing page: particle logo hero, nav, sound toggle, particle/solid toggle
    │   └── About.tsx                 # About page: earthquake globe hero, company info, MacBook showcase, CTA, footer
    │
    ├── components/
    │   ├── LoadingScreen.tsx         # Full-screen loading: animated percentage counter (Lewis-style spaced digits), Framer Motion fade
    │   ├── ScrollToTop.tsx           # Scrolls to top on route change
    │   │
    │   ├── Canvas/                   # Three.js / R3F 3D components
    │   │   ├── ParticleLogo.tsx      # Home hero: 50k particles sampled from extruded SPRDLX SVG logo, custom GLSL shaders, mouse interaction, entrance/exit animations
    │   │   ├── LogoSVG.ts            # Raw SVG path data for "SPRDLX" letters
    │   │   ├── EarthquakeParticleHero.tsx  # About hero: 20k particles from earthquake GLB, additive blending, bloom, volumetric atmosphere, particle linking network, chromatic aberration
    │   │   └── MacbookModel.tsx      # About "Recent Work": GLB MacBook model with texture mapped to screen
    │   │
    │   └── ui/                       # Reusable UI components
    │       ├── CustomCursor.tsx       # GSAP-driven custom cursor dot with `mix-blend-mode: difference`, scale on `[data-cursor-hover]` elements
    │       └── MagneticLink.tsx       # Text links with magnetic hover pull effect (GSAP + elastic easing)
    │
    └── workers/                      # (Empty — was reserved for Web Workers)
```

---

## 4. Pages & User Flows

### 4.1 Loading Screen
- Shows on initial visit (`App.tsx` → `isLoading` state).
- Displays "SPRDLX | AI Venture Studio ✶" with a percentage counter (0→100 over 3.2s).
- White background with large decorative black circle.
- Fades out via Framer Motion `AnimatePresence`.

### 4.2 Home Page (`/`)
- **Background:** Light gray (`#dcdcdc`).
- **Hero:** Full-screen R3F Canvas showing the SPRDLX logo rendered as **50,000 particles** sampled from an extruded SVG geometry.
  - **Entrance animation:** Particles scatter from random 3D positions and converge to form the logo (2.8s, `power3.inOut`).
  - **From-About transition:** If navigating back from About, particles implode from a galaxy formation with a cinematic camera swoop.
  - **Mouse interaction:** Raycaster detects pointer on an invisible plane; nearby particles are repelled outward.
  - **Particle/Solid toggle:** Switch between particle cloud and solid metallic mesh rendering.
  - **Blast-off exit:** Clicking "About" triggers a blast animation (particles explode outward), then navigates after 1.5s.
- **UI overlay:** Navigation (About link), particle/solid toggle, sound on/off button (decorative — no audio implemented), bottom nav bar with `MagneticLink` hover effects.
- **Film grain:** CSS SVG filter overlay with fractal noise.

### 4.3 About Page (`/about`)
- **Background:** Black with white text. Multi-section scrolling page.
- **Section 1 — Hero:** Full-screen R3F Canvas with **Earthquake Particle Globe** (20k particles from earthquake GLB data).
  - Particles color-coded: cool ocean tones for non-hot zones, orange/red for earthquake hot spots.
  - Volumetric atmosphere shader (Rayleigh scattering halo).
  - Particle linking network connecting hot spots with glowing orange lines.
  - Chromatic aberration on mouse proximity.
  - Mouse interaction: particles repel from cursor; hover glow.
  - Scroll-driven rotation/position via `scrollTarget`.
  - Title: "BUILDING YOUR DIGITAL VISION" with per-word GSAP reveal.
  - Tagline: "Innovation In Every Pixel".
- **Section 2 — Company Info:** Long descriptive paragraph with per-word scroll-triggered GSAP reveal. Side image (Unsplash, grayscale→color on hover).
- **Section 3 — Recent Work:** Static showcase of first project ("Anthill Ventures"). Full-bleed R3F Canvas with floating interactive MacBook model (Float + PresentationControls). Texture mapped to MacBook screen. Contact shadows. "View Project" pill button.
- **Section 4 — CTA:** "Let's work together" (serif typography). "Connect With Me" button with green dot.
- **Section 5 — Footer:** Clean, minimal. Two-column link lists (social + nav). "Back to top" arrow. SPRDLX text logo + copyright. GSAP ScrollTrigger blends background from black to white as footer enters viewport.

---

## 5. Design System & Visual Language

### Typography
| Font | Usage | Source |
|---|---|---|
| **Inter** (100–900) | Primary sans-serif: body, UI, hero titles | Google Fonts |
| **Cormorant Garamond** (300–500) | Serif accent: loading screen, CTA headings, copyright | Google Fonts |
| **SF Pro Display** | Footer headings, specialty labels | CDN Fonts |

### Color Palette
| Context | Colors |
|---|---|
| Home page | Background `#dcdcdc`, particles `#1a1a1a`, text grays |
| About page | Background `#000000`, text `#ffffff`, accents (particle colors from earthquake data) |
| Footer transition | Scrolls from black → white background via GSAP scrub |
| Loading screen | White bg, neutral-900 text |
| CTA button dot | `#A5DCA3` (soft green) |

### Animation Stack
- **GSAP:** Core animation engine. ScrollTrigger for scroll-linked animations. `quickTo` for cursor. Ticker integration with Lenis.
- **Framer Motion:** Page-level enter/exit transitions (`AnimatePresence`), loading screen.
- **Lenis:** Smooth momentum scrolling. Connected to GSAP ticker for ScrollTrigger compatibility.
- **Custom GLSL shaders:** Per-particle vertex/fragment shaders in both ParticleLogo and EarthquakeParticleHero.

### Interaction Patterns
- **Custom cursor:** 8px white dot with `mix-blend-mode: difference` for universal contrast. Scales to 1.5x on `[data-cursor-hover]` elements. Only on `pointer: fine` devices.
- **Magnetic links:** Text subtly pulls toward pointer on hover (GSAP). Elastic snap-back on leave.
- **Scroll progress:** Hidden scrollbar (all browsers). Lenis smooth scroll.

---

## 6. Key Technical Decisions & Gotchas

### Architecture
1. **Lenis + GSAP ScrollTrigger integration:** Lenis's `scroll` event feeds `ScrollTrigger.update`, and GSAP ticker drives `lenis.raf()`. This is critical — removing either breaks scroll-triggered animations.
2. **Dual R3F Canvas instances:** Home and About each have their own `<Canvas>`. They are not shared to avoid state conflicts and allow different camera setups.
3. **Camera animation on mount:** Both pages animate the camera from an initial dramatic angle to the final position (3.5s). OrbitControls are disabled until animation completes.
4. **GLB models loaded via `useGLTF`:** Earthquake data (~5MB) and MacBook model (~628KB) are in `/public`. The earthquake model uses dequantization (handles Int8/Int16/Uint8/etc buffers from compressed GLTFs).

### Performance
- **Particle counts:** Home = 50k particles, About = 20k particles. These are tuned to balance visual density vs FPS.
- **DPR capping:** Both canvases use `dpr={[1, 1.5]}` to limit pixel ratio.
- **Additive blending + no depth write:** Standard for particle systems to avoid z-sorting artifacts.
- **About hero:** Uses `antialias: false` and `powerPreference: 'high-performance'` for maximum particle throughput.

### Known Patterns
- **`data-cursor-hover` attribute:** Add to any element to trigger cursor scale effect.
- **`data-home-reveal` attribute:** Used on Home page elements for staggered GSAP entrance.
- **`reveal-word` / `hero-reveal-word` classes:** Per-word animated text reveal on About page.
- **Page transitions:** Home→About uses "blast" (particles explode) + navigate after delay. About→Home uses opacity+blur fade-out + navigate with `state: { fromAbout: true }` for reverse animation.

---

## 7. npm Scripts

```bash
npm run dev       # Start Vite dev server on port 5173 (host: ::)
npm run build     # Production build → dist/
npm run preview   # Preview production build
npm run clean     # Remove dist/
npm run lint      # TypeScript type-check (no emit)
```

---

## 8. Current Project Status

### ✅ Completed
- [x] Loading screen with animated percentage counter
- [x] Home page with 50k particle logo (particles / solid toggle)
- [x] Custom cursor with mix-blend-mode difference
- [x] Magnetic link hover effects
- [x] Lenis smooth scrolling with GSAP ScrollTrigger integration
- [x] About page hero with earthquake particle globe (20k particles, volumetric atmosphere, particle linking, chromatic aberration)
- [x] About page company info section with scroll-triggered text reveal
- [x] About page "Recent Work" with interactive floating MacBook 3D model
- [x] About page CTA section
- [x] About page footer with GSAP scroll-driven black→white background transition
- [x] Page transitions (blast → navigate, fade → navigate back)
- [x] i18n setup (English only)
- [x] Cinematic camera animations on both pages
- [x] Film grain overlay on Home page
- [x] Custom GLSL shaders for all particle systems

### 🔧 Needs Work / Known Issues
- [ ] **`index.html` title** is still "My Google AI Studio App" — should be updated to "SPRDLX"
- [ ] **Sound toggle** on Home page is decorative only — no audio is implemented
- [ ] **Contact page** is referenced in nav but doesn't exist (route not defined)
- [ ] **"View Project" button** on About page is non-functional (no link/action)
- [ ] **Work items list** on About page is hardcoded to show only the first project (Anthill Ventures) — the other two items exist in the array but aren't displayed
- [ ] **Some external image URLs** (Unsplash) are used directly — should be downloaded to local assets for reliability
- [ ] **`console.log` debug statements** remain in `App.tsx` and `main.tsx`
- [ ] **TypeScript errors** exist (see `ts_errors.log`) — likely minor type issues
- [ ] **`workers/` directory** is empty — was reserved for offloading particle computation but never implemented
- [ ] **No SEO meta tags** beyond a basic title
- [ ] **No responsive testing notes** — the site uses responsive classes but hasn't been formally tested on mobile
- [ ] **GEMINI_API_KEY** is referenced but not visibly used anywhere in the frontend code — leftover from AI Studio scaffolding

### 🚀 Potential Enhancements
- Contact page with form
- Project detail pages (click "View Project" → case study)
- Sound design / ambient audio for the particle effects
- Additional work items in the portfolio carousel
- Blog or writing section
- Dark/light mode toggle
- Accessibility audit (keyboard nav, screen reader support)
- Performance profiling on lower-end devices
- PWA support
- Deploy pipeline (Vercel / Railway / Cloudflare Pages)

---

## 9. Environment Setup

```bash
# Prerequisites: Node.js (v18+)
cd sprdlx
npm install
cp .env.example .env.local   # Edit with your GEMINI_API_KEY if needed
npm run dev                   # → http://localhost:5173
```

---

## 10. File-Level Quick Reference

| File | What It Does | Lines |
|---|---|---|
| `src/App.tsx` | Root component: Lenis, Router, CustomCursor, LoadingScreen, Routes (/, /about) | 61 |
| `src/main.tsx` | React entry point | 13 |
| `src/index.css` | Font imports, Tailwind import, cursor hiding, theme tokens | 29 |
| `src/i18n.ts` | i18next config, all English translation strings | 62 |
| `src/pages/Home.tsx` | Home page: particle logo, nav, toggles | 162 |
| `src/pages/About.tsx` | About page: earthquake hero, company info, MacBook showcase, CTA, footer | 456 |
| `src/components/Canvas/ParticleLogo.tsx` | 50k particle SPRDLX logo with GLSL shaders | 380 |
| `src/components/Canvas/EarthquakeParticleHero.tsx` | 20k earthquake globe particles with atmosphere + linking | 639 |
| `src/components/Canvas/MacbookModel.tsx` | MacBook GLB model component | 43 |
| `src/components/Canvas/LogoSVG.ts` | Raw SVG path data for SPRDLX letters | 11 |
| `src/components/ui/CustomCursor.tsx` | GSAP cursor dot with mix-blend-mode difference | 78 |
| `src/components/ui/MagneticLink.tsx` | Magnetic hover pull on links | 69 |
| `src/components/LoadingScreen.tsx` | Loading percentage + fade out | 90 |
| `src/components/ScrollToTop.tsx` | Scroll to top on route change | ~10 |
| `src/lib/utils.ts` | cn() utility (clsx + twMerge) | 7 |

---

## 11. Coding Conventions

- **Component style:** Functional React components with hooks. Default exports for pages/components.
- **Named exports:** Used for `CustomCursor`, `MagneticLink`.
- **State management:** Local React state only (no global store — project is small enough).
- **3D pattern:** R3F `<Canvas>` wraps Three.js scenes. Each 3D scene is a separate component tree. Custom shaders are inline strings in JSX.
- **Animation pattern:** GSAP for scroll-linked/complex animations, Framer Motion for mount/unmount transitions.
- **CSS pattern:** Tailwind utility classes. Custom CSS only in `index.css` for global overrides.
- **TypeScript:** Loose — `any` used in some GLB model typing. `skipLibCheck: true`.

---

*This file should be treated as the single source of truth for understanding the project state. Update it when making significant architectural changes.*
