# Codebase Optimization Report
**Date:** 2026-04-18  
**Status:** Comprehensive Dead Code & Dependency Analysis

---

## Executive Summary

Project: React+TypeScript creative portfolio with 3D WebGL (Three.js, Spline, GSAP).  
**Verdict:** 6 unused hooks + 5 unused components + 2 duplicate page files + 9 e2e test cruft = **~25KB dead code + testing debris**.

Safety: All removals safe (no indirect usage, no config refs, no dynamic imports).

---

## 1. UNUSED HOOKS (6 total) — DELETE IMMEDIATELY

### Analysis: Import Grep Results
```
useTextScramble   — 0 imports (UNUSED)
useScrollGlitch   — 0 imports (UNUSED)
usePageLoad       — 0 imports (UNUSED)
useAmbientAudio   — 0 imports (UNUSED)
useAudioReactive  — 0 imports (UNUSED)
use3DDepthScroll  — 0 imports (UNUSED)
```

**Used hooks only:**
- `useDevicePerformance` ✅ (OptimizedCanvas, OptimizedMacbookScene)
- `useLazyLoad3D` ✅ (LazySplineHero, About.refactored)

### Safe to Delete:
1. `src/hooks/useTextScramble.ts` (235 bytes)
2. `src/hooks/useScrollGlitch.ts` (1.4 KB)
3. `src/hooks/usePageLoad.ts` (235 bytes)
4. `src/hooks/useAmbientAudio.ts` (1.4 KB)
5. `src/hooks/useAudioReactive.ts` (1.2 KB)
6. `src/hooks/use3DDepthScroll.ts` (945 bytes)

**Total:** ~5.4 KB freed

---

## 2. UNUSED COMPONENTS (5 total) — DELETE IMMEDIATELY

### Analysis: Grep + Import Search
```
AsciiCanvas       — 0 imports (UNUSED)
ParticleLogo      — 0 imports (UNUSED)
LiquidEther       — 0 imports (UNUSED) + CSS orphan file
LogoSVG.ts        — only used by ParticleLogo (delete cascading)
```

**Used components:**
- `SplineHero` ✅ (Home.tsx → LazySplineHero wrapper)
- `MacbookModel` ✅ (About.tsx, DisposableMacbookModel)
- `EarthquakeParticleHero` ✅ (About.tsx)
- `LoadingScreen` ✅ (App.tsx)

### Safe to Delete:
1. `src/components/Canvas/AsciiCanvas.tsx` (1.4 KB)
2. `src/components/Canvas/ParticleLogo.tsx` (3.5 KB, 40+ lines)
3. `src/components/Canvas/LogoSVG.ts` (cascading: only ParticleLogo import)
4. `src/components/Canvas/LiquidEther.tsx` (2.0 KB)
5. `src/components/Canvas/LiquidEther.css` (0.5 KB CSS orphan)

**Total:** ~7.4 KB freed

---

## 3. DUPLICATE PAGE FILES — DELETE .REFACTORED VERSIONS

### Current State:
```
src/App.tsx (66 lines)               ← ACTIVE, used
src/App.refactored.tsx (73 lines)    ← DEAD: never imported, not wired

src/pages/About.tsx (451 lines)      ← ACTIVE, used
src/pages/About.refactored.tsx (391  ← DEAD: never imported, not wired
```

**Why they exist:**  
Per OPTIMIZATION_SUMMARY.md, `.refactored` files were created as alternatives for lazy-loading & optimization but **never switched to** (routes still import original files).

### Safe to Delete:
1. `src/App.refactored.tsx` (73 lines)
2. `src/pages/About.refactored.tsx` (391 lines)

**Why safe:**
- No imports of `.refactored` anywhere (grep confirmed)
- Routes hardcoded to original `App.tsx`, `About.tsx`
- Refactored features (lazy About route, device awareness) NOT active

**Total:** ~464 lines (~14 KB) freed

---

## 4. ROOT-LEVEL E2E TEST DEBRIS (9 files) — CLEAN UP

### Current State:
```
e2e-about-test.mjs                  (16 KB) — orphaned
e2e-check.cjs                       (1.9 KB) — orphaned
e2e-check2.cjs                      (1.2 KB) — orphaned
e2e-earthquake-check.spec.ts        (3.6 KB) — orphaned
e2e-earthquake-check2.spec.ts       (3.2 KB) — orphaned
e2e-earthquake-check3.spec.ts       (4.1 KB) — orphaned
e2e-earthquake-check4.spec.ts       (3.4 KB) — orphaned
e2e-hero-screenshot.mjs             (2.9 KB) — orphaned
e2e-screenshots/ (dir)              — orphaned artifacts
screenshot-about-data.png           (19.6 KB) — orphaned artifact
screenshot-fullpage.png             (432 KB) — orphaned artifact
```

**Problems:**
- Not in `package.json` test scripts
- Mixed formats (`.mjs`, `.cjs`, `.spec.ts`) with no runner config
- Playwright not configured in codebase
- Screenshots only for debugging, not CI

**Safe to Delete:**
All 9 files + 2 PNGs = **~488 KB freed** (bulk of cruft!)

---

## 5. DUPLICATE UTILITY/CONFIG FILES

### Check: Refactored Config
- `PERFORMANCE_PLAN.md` — planning doc, safe to keep (reference)
- `OPTIMIZATION_SUMMARY.md` — planning doc, safe to keep (reference)
- `CONTEXT.md` — project context, safe to keep

**Verdict:** Keep docs (reference value), no code duplicates.

---

## 6. UNUSED DEPENDENCIES ANALYSIS

### Package.json Check:
**All dependencies used:**
- ✅ `@react-three/drei`, `@react-three/fiber`, `three` — 3D rendering
- ✅ `@splinetool/react-spline` — Hero scene
- ✅ `gsap` — animations (heavy use in About, App)
- ✅ `framer-motion` — AnimatePresence wrapper
- ✅ `lenis` — smooth scroll (App.tsx initialization)
- ✅ `react-router-dom` — routing
- ✅ `tailwindcss`, `tailwind-merge`, `clsx` — styling
- ✅ `lucide-react` — icons (unused in current pages, but available)
- ✅ `i18next`, `react-i18next` — i18n initialized in main.tsx

**Candidate for removal:**
- `lucide-react` — imported but no icons visible in About, Home (0 usages)

**Not enough evidence to remove yet.** Check actual rendered code.

---

## 7. UNUSED IMPORTS WITHIN FILES

### Quick scan of main files:

#### `src/pages/About.tsx` (451 lines):
```typescript
import React — UNUSED (no JSX.createElement)
import { useMemo } — OK, used for workItems
```

#### `src/pages/Home.tsx` (118 lines):
```typescript
import { useLayoutEffect, useRef } — OK
All imports used ✅
```

#### `src/App.tsx` (66 lines):
```typescript
All imports used ✅
```

**Verdict:** Main files clean. Minor: remove unused `React` import in About.tsx (line 1).

---

## 8. IMPORT OPTIMIZATION

### Found redundancy:
- `gsap.registerPlugin(ScrollTrigger)` called twice:
  - Line 6 in `About.tsx`
  - Line 5 in `useScrollGlitch.ts` (but hook unused)

**Fix:** Remove from About.tsx, keep one registration in App.tsx

---

## CLEAN-UP CHECKLIST

### DELETE (Safe, 0 refs):
- [ ] `src/hooks/useTextScramble.ts`
- [ ] `src/hooks/useScrollGlitch.ts`
- [ ] `src/hooks/usePageLoad.ts`
- [ ] `src/hooks/useAmbientAudio.ts`
- [ ] `src/hooks/useAudioReactive.ts`
- [ ] `src/hooks/use3DDepthScroll.ts`
- [ ] `src/components/Canvas/AsciiCanvas.tsx`
- [ ] `src/components/Canvas/ParticleLogo.tsx`
- [ ] `src/components/Canvas/LogoSVG.ts`
- [ ] `src/components/Canvas/LiquidEther.tsx`
- [ ] `src/components/Canvas/LiquidEther.css`
- [ ] `src/App.refactored.tsx`
- [ ] `src/pages/About.refactored.tsx`
- [ ] `e2e-about-test.mjs`
- [ ] `e2e-check.cjs`
- [ ] `e2e-check2.cjs`
- [ ] `e2e-earthquake-check.spec.ts`
- [ ] `e2e-earthquake-check2.spec.ts`
- [ ] `e2e-earthquake-check3.spec.ts`
- [ ] `e2e-earthquake-check4.spec.ts`
- [ ] `e2e-hero-screenshot.mjs`
- [ ] `e2e-screenshots/` (folder)
- [ ] `screenshot-about-data.png`
- [ ] `screenshot-fullpage.png`

### MINOR FIXES:
- [ ] Remove `import React` from About.tsx (line 1) — JSX doesn't need it in React 17+
- [ ] Remove duplicate `gsap.registerPlugin(ScrollTrigger)` from About.tsx (line 6)

---

## TOTAL SAVINGS

| Category | Count | Size |
|----------|-------|------|
| Unused Hooks | 6 | ~5.4 KB |
| Unused Components | 5 | ~7.4 KB |
| Duplicate Pages | 2 | ~14 KB |
| E2E Cruft | 9 files + 2 images + dir | ~488 KB |
| **TOTAL** | **24 items** | **~515 KB** |

---

## RISKS & ASSUMPTIONS

1. ✅ **No indirect usage:** Grep confirmed 0 imports for all dead code
2. ✅ **No dynamic imports:** No `require()`, `import()`, or reflection
3. ✅ **No config refs:** No file paths in env, metadata, or build config
4. ✅ **No external linking:** Refactored pages not exported or linked anywhere
5. ⚠️ **E2E tests:** Not wired to CI (safe to delete, but track externally if needed)

---

## RECOMMENDED EXECUTION ORDER

1. **Delete unused hooks** (no risk, instant)
2. **Delete unused components** (no risk, instant)
3. **Delete .refactored files** (no risk, instant)
4. **Delete E2E cruft** (confirm not in CI, then delete)
5. **Minor: Remove React import + duplicate registerPlugin in About.tsx**
6. **Test:** `npm install && npm run build && npm run preview`

---

## NOTES FOR FUTURE WORK

- Keep `OPTIMIZATION_SUMMARY.md` & `PERFORMANCE_PLAN.md` as historical reference
- Consider implementing lazy-load About route in future (refactored logic is solid)
- E2E tests should live in dedicated `/tests` folder if restored
- Consider setting up Playwright config + CI integration (not current)

