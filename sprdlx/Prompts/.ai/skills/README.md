# .ai/skills — Project AI Guardrails

This folder contains **skill files** — rules that every AI agent (GitHub Copilot,
Cursor, Claude, etc.) must follow when working on this project.

## Stack
- React + Vite
- TypeScript
- Tailwind CSS
- Node.js + Express (backend)

## How to use

### GitHub Copilot
Add to `.github/copilot-instructions.md`:
```
Read and follow all rules in .ai/skills/ before generating any code.
```

### Cursor
Add to `.cursorrules`:
```
Read and strictly follow every skill file in .ai/skills/ before generating code.
```

### Claude / other chat AIs
Paste at the start of your conversation:
```
Before generating any code, read and follow all rules in .ai/skills/
```

## Skill files

| File | Agent | What it governs |
|------|-------|-----------------|
| `01-project-architect.md` | All agents | Folder structure, file placement, import rules |
| `02-component-builder.md` | Frontend | How to build React components in TypeScript |
| `03-ui-designer.md` | Designer | Tailwind design system, spacing, colors, typography |
| `04-api-layer.md` | Backend | Services, hooks, Express routes, error handling |
| `05-state-manager.md` | Frontend | State rules — local, context, Zustand |
| `06-typescript-enforcer.md` | All agents | TypeScript strictness, no `any`, type patterns |
| `07-performance-agent.md` | Frontend | Lazy loading, memoization, bundle rules |
| `08-accessibility-agent.md` | Frontend | ARIA, keyboard nav, semantic HTML |
| `09-seo-lighthouse-agent.md` | Frontend | Meta tags, Lighthouse 90+, Core Web Vitals |
| `10-backend-agent.md` | Backend | Express structure, middleware, error handling |
| `11-testing-agent.md` | All agents | Vitest, RTL, test file placement |
| `12-git-agent.md` | All agents | Commit messages, branch names, PR rules |
