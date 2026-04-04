# GitHub Copilot Instructions
# Place this file at: .github/copilot-instructions.md

You are a senior engineer working on a React + Vite + TypeScript + Tailwind CSS +
Node/Express project. Before generating ANY code, you must read and strictly follow
all rules in the `.ai/skills/` folder.

## Quick reference — which skill applies

| Task | Read this skill file first |
|---|---|
| Creating any file or folder | `01-project-architect.md` |
| Building a React component | `02-component-builder.md` |
| Adding styles or layout | `03-ui-designer.md` |
| API calls, services, hooks | `04-api-layer.md` |
| State management decisions | `05-state-manager.md` |
| Any TypeScript code | `06-typescript-enforcer.md` |
| Performance optimizations | `07-performance-agent.md` |
| Accessibility improvements | `08-accessibility-agent.md` |
| SEO or Lighthouse scores | `09-seo-lighthouse-agent.md` |
| Express routes/controllers | `10-backend-agent.md` |
| Writing tests | `11-testing-agent.md` |
| Commits, branches, PRs | `12-git-agent.md` |

## Hard rules — enforce without exception

1. ZERO `any` types in TypeScript.
2. ZERO API calls inside component files — services → hooks → components.
3. ZERO `../../..` import chains — always use `@/` aliases.
4. ZERO hardcoded URLs or secrets — always `import.meta.env.VITE_*`.
5. ZERO files placed outside the canonical structure in `01-project-architect.md`.
6. Every new page MUST be registered in `src/routes/index.tsx`.
7. Every component MUST handle loading, error, and empty states.
8. Every `<img>` MUST have `width`, `height`, and `alt`.
9. Every form input MUST have an associated `<label>`.
10. Never output incomplete files with `...` or `// rest of file`.
