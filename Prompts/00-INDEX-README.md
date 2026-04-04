# 🧠 The Complete Web Dev Prompt Toolkit
# 32 Prompts — React + Vite + TypeScript + Tailwind + Node/Express
# Paste any prompt directly into GitHub Copilot, Cursor, or Claude

---

## HOW TO USE

Paste the prompt file content into your AI tool's chat.
Run prompts in the recommended order below for best results.
Each prompt is self-contained — run any one independently.

---

## ALL 32 PROMPTS — QUICK REFERENCE

### 🏗️ CODE QUALITY — STRUCTURE (Run these first)

| # | File | What it does |
|---|---|---|
| 01 | 01-folder-file-structure.md | Reorganize entire project into canonical folder structure with pages, sections, components |
| 02 | 02-dead-code-duplicate-cleanup.md | Find and delete unused files, merge duplicate components |
| 03 | 03-naming-conventions.md | Enforce PascalCase, camelCase, is/has prefixes across all files |
| 04 | 04-file-bloat-surgery.md | Refactor 300+ line files — extract hooks, components, constants |

### 🗄️ DATA & STATE

| # | File | What it does |
|---|---|---|
| 05 | 05-api-layer-extraction.md | Move all fetch/axios calls to services → hooks → components |
| 06 | 06-state-management-audit.md | Fix prop drilling, wrong state placement, missing context |
| 07 | 07-error-handling-boundaries.md | Add error boundaries, toast system, safe async utility |
| 08 | 08-form-validation-zod.md | Centralize all form validation with Zod + react-hook-form |

### 🎨 UI & DESIGN

| # | File | What it does |
|---|---|---|
| 09 | 09-ui-consistency-audit.md | Standardize spacing, colors, typography, component reuse |
| 10 | 10-dark-mode-system.md | Full dark mode with ThemeContext, CSS variables, dark: variants |
| 11 | 11-animation-transitions.md | Add purposeful motion — hover, entrance, loading animations |

### ⚡ PERFORMANCE & QUALITY

| # | File | What it does |
|---|---|---|
| 12 | 12-performance-audit.md | Code splitting, memoization, images, bundle size |
| 13 | 13-lighthouse-optimization.md | Hit 90+ on all 4 Lighthouse categories |
| 14 | 14-typescript-strict-audit.md | Zero any types, strict mode, typed everything |
| 15 | 15-accessibility-audit.md | WCAG 2.1 AA — ARIA, contrast, keyboard, semantic HTML |
| 16 | 16-testing-coverage.md | Vitest + RTL tests for utils, services, hooks, components |

### 🔒 SECURITY & BACKEND

| # | File | What it does |
|---|---|---|
| 17 | 17-auth-security-hardening.md | JWT in httpOnly cookies, XSS, CSRF, input validation |
| 18 | 18-rate-limiting.md | express-rate-limit on auth, uploads, all sensitive routes |
| 19 | 19-code-review-agent.md | PR-style full audit — bugs, security, performance, maintainability |
| 31 | 31-backend-structure-patterns.md | Thin controllers, rich services, standardized responses |
| 32 | 32-env-variables-secrets-audit.md | No hardcoded secrets, complete .env.example, Zod validation |

### 🛠️ DEV EXPERIENCE & TOOLING

| # | File | What it does |
|---|---|---|
| 20 | 20-eslint-prettier-config.md | Strict ESLint + Prettier config, all rules explained |
| 21 | 21-cicd-pipeline.md | GitHub Actions — quality, test, build, Lighthouse, security jobs |
| 22 | 22-husky-lint-staged.md | Pre-commit hooks — lint, format, type-check, commit message rules |

### 📊 RUNTIME & MONITORING

| # | File | What it does |
|---|---|---|
| 23 | 23-logging-system.md | Winston logger — structured, leveled, request logging |
| 24 | 24-error-monitoring-sentry.md | Sentry for frontend + backend with source maps |
| 25 | 25-database-optimization.md | Fix N+1 queries, add indexes, paginate everything |
| 26 | 26-caching-strategy.md | HTTP cache headers, memory cache, React Query |

### 📚 DOCUMENTATION

| # | File | What it does |
|---|---|---|
| 27 | 27-api-documentation-swagger.md | Swagger/OpenAPI docs for every Express route |
| 28 | 28-storybook-component-library.md | Storybook stories for all common components |
| 29 | 29-seo-complete-setup.md | Meta tags, OG, Twitter cards, sitemap, robots.txt |
| 30 | 30-onboarding-guide.md | Complete README + CONTRIBUTING.md for new developers |

---

## RECOMMENDED RUN ORDER

### 🚨 Start here (foundational — everything else depends on these)
1 → 4 → 2 → 3   (structure first, then clean up, then naming)

### 🔧 Core quality (run after structure is clean)
5 → 6 → 7 → 8   (data layer, state, errors, forms)

### 🎨 Polish (run after core is solid)
9 → 10 → 11      (UI consistency, dark mode, animation)

### 🔒 Ship safely (run before going to production)
17 → 18 → 32 → 31   (auth, rate limiting, secrets, backend)
20 → 22 → 21         (ESLint, Husky, CI/CD)

### 🚀 Go from good to great
12 → 13 → 14 → 15 → 16   (performance, Lighthouse, TypeScript, a11y, tests)

### 📊 Production operations
23 → 24 → 25 → 26   (logging, Sentry, DB optimization, caching)

### 📚 Documentation last (or whenever you have bandwidth)
27 → 28 → 29 → 30   (API docs, Storybook, SEO, onboarding)

### 🔍 Run anytime
19   (code review agent — useful after any major feature)

---

## TIPS

- Always have a clean git commit before running any prompt
- Run type-check (tsc --noEmit) before and after each prompt
- The bloat surgery prompt (04) has the biggest impact on vibe-coded projects
- Run the code review agent (19) last to catch anything the other prompts missed
- These prompts work best in Cursor Agent mode or GitHub Copilot workspace mode
