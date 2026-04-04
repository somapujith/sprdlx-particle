# Skill: Git Agent
# Agent: ALL AGENTS — every commit, branch, and PR
# Stack: Git + Conventional Commits

---

## COMMIT MESSAGE FORMAT — CONVENTIONAL COMMITS

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types
| Type | When to use |
|---|---|
| `feat` | New feature or user-facing addition |
| `fix` | Bug fix |
| `refactor` | Code change with no behavior change |
| `style` | Formatting, Tailwind class changes, no logic |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `docs` | README, comments, JSDoc |
| `chore` | Build config, dependencies, tooling |
| `ci` | GitHub Actions, CI/CD config |
| `revert` | Reverting a previous commit |

### Scopes (use your feature names)
```
feat(auth): add Google OAuth login
fix(dashboard): resolve CLS issue in stats section
refactor(components): extract Button to common
perf(images): convert hero to WebP and add lazy loading
style(navbar): fix mobile menu spacing
test(userService): add error handling tests
chore(deps): update vite to 5.2.0
```

### Rules
- Subject line: max 72 characters, sentence case, no period at end
- Use imperative mood: "add feature" not "added feature"
- Body: explain WHY, not WHAT (the diff shows what changed)
- Breaking changes: add `BREAKING CHANGE:` footer

---

## BRANCH NAMING

```
<type>/<short-description>

feat/user-authentication
feat/dashboard-analytics
fix/navbar-mobile-overflow
fix/image-cls-issue
refactor/api-layer-extraction
perf/code-splitting-routes
chore/update-dependencies
```

Rules:
- Lowercase only
- Hyphens, not underscores or spaces
- Short but descriptive (2-4 words)
- Always branch from `main` (or `develop` if used)
- Never commit directly to `main`

---

## .gitignore — REQUIRED ENTRIES

```
# Dependencies
node_modules/

# Build outputs
dist/
build/
.next/

# Environment (NEVER commit these)
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*

# Editor
.vscode/settings.json
.idea/
*.swp
*.swo
.DS_Store

# Coverage
coverage/
.nyc_output/

# Vite
*.local
```

Always commit:
- `.env.example` ← template with all variable names, no values
- `.gitignore`
- `package-lock.json` or `yarn.lock`

Never commit:
- `.env`, `.env.local`, any file with real secrets
- `node_modules/`
- `dist/` or `build/`

---

## PR CHECKLIST — BEFORE MERGING

- [ ] Branch is up to date with main (`git pull origin main`)
- [ ] No merge conflicts
- [ ] All tests pass (`npm run test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No lint errors (`npm run lint`)
- [ ] New components have tests
- [ ] New API endpoints have tests
- [ ] No `console.log` in production code
- [ ] No `.env` values hardcoded in source
- [ ] `import` paths use aliases (`@/`) not relative chains

---

## SCRIPTS — package.json STANDARDS

```json
{
  "scripts": {
    "dev":          "vite",
    "build":        "tsc && vite build",
    "preview":      "vite preview",
    "type-check":   "tsc --noEmit",
    "lint":         "eslint src --ext .ts,.tsx --report-unused-disable-directives",
    "lint:fix":     "eslint src --ext .ts,.tsx --fix",
    "format":       "prettier --write src",
    "test":         "vitest",
    "test:ui":      "vitest --ui",
    "test:coverage":"vitest run --coverage"
  }
}
```
