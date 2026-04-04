# Skill: Project Architect
# Agent: ALL AGENTS — read this before touching any file
# Stack: React + Vite + TypeScript + Tailwind + Node/Express

---

## ABSOLUTE RULES — NEVER VIOLATE

1. Every file has exactly ONE correct home. No exceptions.
2. Never create files outside the canonical structure below.
3. Never place API calls inside component or section files.
4. Never leave a broken import anywhere in the codebase.
5. Every new page MUST be registered in `src/routes/index.tsx` immediately.
6. Never use `../../..` import chains — always use `@/` path aliases.
7. Never output incomplete files with `// rest of file` or `...` placeholders.
8. Every file must be complete and copy-pasteable.

---

## CANONICAL FOLDER STRUCTURE

```
project-root/
├── .ai/                          ← AI skill files (this folder — never modify)
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── assets/                   ← static files served as-is
│
├── src/
│   ├── main.tsx                  ← entry point ONLY (ReactDOM.createRoot)
│   ├── App.tsx                   ← Router setup + root providers
│   │
│   ├── routes/
│   │   └── index.tsx             ← ALL route definitions (single source of truth)
│   │
│   ├── pages/                    ← ONE file per route — thin shells only
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   └── NotFound.tsx
│   │
│   ├── sections/                 ← Page-level sections, grouped by page
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   └── FeaturesSection.tsx
│   │   └── [pageName]/
│   │
│   ├── components/
│   │   ├── common/               ← Generic, reused in 2+ places
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── PageLoader.tsx
│   │   ├── layout/               ← Structural shells
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PageWrapper.tsx
│   │   └── [feature]/            ← Feature-specific components
│   │       └── e.g. components/auth/LoginCard.tsx
│   │
│   ├── hooks/                    ← Custom React hooks only
│   │   ├── useAuth.ts
│   │   └── use[Feature].ts
│   │
│   ├── context/                  ← React Context providers
│   │   └── AuthContext.tsx
│   │
│   ├── services/                 ← ALL API calls live here
│   │   ├── api.ts                ← axios base config
│   │   └── [feature]Service.ts
│   │
│   ├── store/                    ← Zustand stores (if used)
│   │   └── [feature]Store.ts
│   │
│   ├── utils/                    ← Pure helper functions, no side effects
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   ├── types/                    ← TypeScript interfaces and types
│   │   ├── index.ts
│   │   └── [feature].types.ts
│   │
│   └── styles/
│       └── index.css             ← Tailwind directives + global resets only
│
├── server/                       ← Express backend
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── middleware/
│       ├── models/
│       └── utils/
│
├── .env
├── .env.example                  ← ALWAYS commit this, never .env
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## FILE PLACEMENT QUICK REFERENCE

| What you're building | Where it goes |
|---|---|
| New screen / route | `src/pages/` |
| Visual band of one page | `src/sections/[pageName]/` |
| Button, Input, Modal, Badge | `src/components/common/` |
| Navbar, Sidebar, Footer | `src/components/layout/` |
| Feature-specific card/table | `src/components/[feature]/` |
| Function that calls the API | `src/services/[feature]Service.ts` |
| Data-fetching hook | `src/hooks/use[Feature].ts` |
| Global state | `src/store/[feature]Store.ts` |
| Shared state via Context | `src/context/[Feature]Context.tsx` |
| Pure helper / formatter | `src/utils/` |
| All route definitions | `src/routes/index.tsx` |
| TypeScript types | `src/types/` |

---

## PATH ALIASES — ALWAYS USE THESE

```ts
// vite.config.ts must have:
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

```json
// tsconfig.json must have:
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

## PAGE SHELL PATTERN — PAGES ARE THIN

```tsx
// src/pages/Home.tsx — CORRECT
import { Helmet } from 'react-helmet-async';
import HeroSection from '@sections/home/HeroSection';
import FeaturesSection from '@sections/home/FeaturesSection';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Home — MyApp</title>
        <meta name="description" content="Page description here" />
      </Helmet>
      <HeroSection />
      <FeaturesSection />
    </>
  );
}
```

---

## TASK EXECUTION ORDER

When building anything, generate files in this order:
1. Types / interfaces (`src/types/`)
2. Constants / utils (`src/utils/`)
3. Services (`src/services/`)
4. Hooks (`src/hooks/`)
5. Common components (`src/components/common/`)
6. Feature components (`src/components/[feature]/`)
7. Sections (`src/sections/[page]/`)
8. Page (`src/pages/`)
9. Route registration (`src/routes/index.tsx`)
10. Navigation update (Navbar/Sidebar)

---

## NEVER DO THESE

| ❌ Wrong | ✅ Correct |
|---|---|
| `import x from '../../../utils'` | `import x from '@/utils'` |
| `fetch()` inside a component | Service → Hook → Component |
| Route defined inside a component | All routes in `src/routes/index.tsx` |
| New page not added to router | Always register immediately |
| `any` type in TypeScript | Define a proper interface |
| Hardcoded `http://localhost:3001` | `import.meta.env.VITE_API_BASE_URL` |
| Copy-paste logic across files | Extract to utils/ or service |
| `console.log` in production code | Gate behind `import.meta.env.DEV` |
