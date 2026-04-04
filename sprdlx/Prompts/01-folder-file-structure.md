# Prompt 01 — Folder + File Structure Refactor

# Category: Code Quality — Structure

# Stack: React + Vite + TypeScript + Tailwind + Node/Express

You are a senior frontend architect. Your job is to audit and completely restructure
this codebase. Do not generate new features — only reorganize, deduplicate, and fix.

---

## PHASE 1 — READ THE ENTIRE CODEBASE FIRST

Before touching a single file:

1. Recursively scan every file in this project.
2. Identify every component, hook, utility, service, context, page, and section.
3. Build a mental map of what each file does, what it imports/exports,
  whether it has duplicates, and whether it belongs to a specific feature or is reusable.
4. Identify the framework (React/Next.js/Vue) and CSS approach.

Do NOT skip this step. Read first, plan second, move files third.

---

## PHASE 2 — TARGET FOLDER STRUCTURE

```
src/
├── main.tsx / index.tsx         ← entry point only
├── App.tsx                      ← Router setup + root layout
├── routes/
│   └── index.tsx                ← ALL route definitions (single source of truth)
├── pages/                       ← one file per route — thin shells only
├── sections/                    ← page-level sections, grouped by page
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   └── FeaturesSection.tsx
│   └── [pageName]/
├── components/
│   ├── common/                  ← reused in 2+ places (Button, Input, Modal, Badge)
│   ├── layout/                  ← structural (Navbar, Sidebar, Footer, PageWrapper)
│   └── [feature]/               ← feature-specific components
├── hooks/                       ← custom React hooks only
├── context/                     ← React Context providers
├── services/                    ← ALL API calls live here
├── store/                       ← Zustand stores
├── utils/                       ← pure helper functions
├── types/                       ← TypeScript interfaces and types
└── styles/
    └── index.css                ← Tailwind directives + global resets only

server/
└── src/
    ├── app.ts
    ├── server.ts
    ├── routes/
    ├── controllers/
    ├── services/
    ├── middleware/
    ├── models/
    ├── config/
    └── utils/
```

---

## PHASE 3 — SECTIONS vs COMPONENTS DECISION RULE

GOES IN sections/[page]/       if:

- Represents a full visual band of a specific page
- Only used on ONE specific page
- May contain business logic for that page area

GOES IN components/common/     if:

- Reused across 2+ pages or sections
- Accepts props, no page-specific context
- Examples: Button, Input, Modal, Badge, Spinner, Card, Avatar

GOES IN components/layout/     if:

- Wraps pages structurally (Navbar, Sidebar, Footer, PageWrapper)

GOES IN components/[feature]/  if:

- Reusable within one feature domain

A PAGE IS A THIN SHELL:

```tsx
// pages/Home.tsx
import HeroSection from '@sections/home/HeroSection';
import FeaturesSection from '@sections/home/FeaturesSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  );
}
```

---

## PHASE 4 — PATH ALIASES (set up if missing)

In vite.config.ts:

```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@components': path.resolve(__dirname, './src/components'),
    '@sections': path.resolve(__dirname, './src/sections'),
    '@pages': path.resolve(__dirname, './src/pages'),
    '@hooks': path.resolve(__dirname, './src/hooks'),
    '@services': path.resolve(__dirname, './src/services'),
    '@utils': path.resolve(__dirname, './src/utils'),
    '@store': path.resolve(__dirname, './src/store'),
    '@context': path.resolve(__dirname, './src/context'),
    '@types': path.resolve(__dirname, './src/types'),
  }
}
```

In tsconfig.json:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@sections/*": ["src/sections/*"],
      "@pages/*": ["src/pages/*"],
      "@hooks/*": ["src/hooks/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"],
      "@store/*": ["src/store/*"],
      "@context/*": ["src/context/*"],
      "@types/*": ["src/types/*"]
    }
  }
}
```

---

## PHASE 5 — RULES FOR EVERY FILE MOVE

1. Update every import path that references it across the entire codebase.
2. Verify the new import path resolves correctly using @/ aliases.
3. Ensure the moved component still renders correctly.
4. Register any new page in src/routes/index.tsx immediately.
5. Never leave a dangling import or broken reference.
6. Never use placeholder JSX (no empty returns, no // TODO handlers).
7. Consolidate any duplicate logic into a single source.

---

## PHASE 6 — DELIVERY REPORT FORMAT

FILES MOVED:
  [old path] → [new path]

SECTIONS IDENTIFIED:
  [page name]: [list of section files created]

COMMON COMPONENTS IDENTIFIED:
  [component] → components/common/ (reason)

FILES MERGED / DEDUPLICATED:
  [list]

IMPORTS UPDATED:
  [list of files where import paths changed]

ROUTE REGISTRATIONS:
  [pages added/fixed in routes/index.tsx]

ALIASES CONFIGURED:
  [confirm vite.config.ts and tsconfig.json updated]

---

## STRICT RULES — NEVER VIOLATE

- NEVER place API calls inside a component or section file
- NEVER place a new page outside src/pages/
- NEVER keep duplicate components — merge with props
- NEVER leave a broken import anywhere
- NEVER skip registering a page in the router
- NEVER use ../../.. import chains — use @/ aliases
- NEVER output incomplete files with // rest of file or ...
- ALWAYS present complete, copy-pasteable file content

