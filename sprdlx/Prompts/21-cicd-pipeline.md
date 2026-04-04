# Prompt 21 — CI/CD Pipeline (GitHub Actions)
# Category: Dev Experience & Tooling
# Stack: React + Vite + TypeScript + Node/Express

Create a complete GitHub Actions CI/CD pipeline.
Every PR must pass CI before merging. No exceptions.

---

## .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # ─────────────────────────────────────
  # Job 1: Code Quality Checks
  # ─────────────────────────────────────
  quality:
    name: Quality checks
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: TypeScript check
        run: npm run type-check

      - name: ESLint
        run: npm run lint

      - name: Prettier check
        run: npm run format:check

  # ─────────────────────────────────────
  # Job 2: Tests + Coverage
  # ─────────────────────────────────────
  test:
    name: Tests
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - name: Run tests with coverage
        run: npm run test:coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          fail_ci_if_error: false

  # ─────────────────────────────────────
  # Job 3: Build
  # ─────────────────────────────────────
  build:
    name: Production build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7

  # ─────────────────────────────────────
  # Job 4: Lighthouse CI (on build)
  # ─────────────────────────────────────
  lighthouse:
    name: Lighthouse
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - name: Download build
        uses: actions/download-artifact@v4
        with: { name: dist, path: dist/ }
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          uploadArtifacts: true
          temporaryPublicStorage: true
          budgetPath: ./lighthouse-budget.json

  # ─────────────────────────────────────
  # Job 5: Security audit
  # ─────────────────────────────────────
  security:
    name: Security audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm audit --audit-level=high
```

---

## lighthouse-budget.json

```json
[{
  "path": "/*",
  "resourceSizes": [
    { "resourceType": "total", "budget": 500 },
    { "resourceType": "script", "budget": 300 }
  ],
  "scores": [
    { "metric": "performance",     "minScore": 0.9  },
    { "metric": "accessibility",   "minScore": 0.95 },
    { "metric": "best-practices",  "minScore": 0.95 },
    { "metric": "seo",             "minScore": 0.95 }
  ]
}]
```

---

## .github/PULL_REQUEST_TEMPLATE.md

```markdown
## What does this PR do?
[Brief description]

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] Performance improvement
- [ ] Documentation

## Checklist
- [ ] TypeScript: zero errors (`npm run type-check`)
- [ ] Lint: zero errors (`npm run lint`)
- [ ] Tests: all passing (`npm run test`)
- [ ] No `console.log` in production code
- [ ] No hardcoded URLs or secrets
- [ ] All new components handle loading / error / empty states
- [ ] Accessibility: keyboard nav + ARIA on new interactive elements
```

---

## .github/CODEOWNERS

```
# Global code owners
*                    @your-username

# Critical files require explicit review
src/services/        @your-username
server/src/          @your-username
.github/workflows/   @your-username
```

---

## BRANCH PROTECTION RULES

Set these in GitHub → Settings → Branches → main:
- Require pull request before merging: ON
- Require status checks to pass: quality, test, build
- Require branches to be up to date: ON
- Do not allow bypassing: ON

---

## DELIVERY

Create all files above. Every CI job must pass on a clean branch.
