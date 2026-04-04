# Prompt 30 — Onboarding Guide (New Developer Setup)
# Category: Documentation
# Stack: React + Vite + TypeScript + Node/Express

Write a complete README and onboarding guide so any developer
can go from zero to running the project in under 10 minutes.

---

## FILES TO CREATE / UPDATE

### README.md (project root)

Write a complete README with these exact sections:

```markdown
# Project Name

One-sentence description of what the project does.

## Live demo
https://yourdomain.com

## Tech stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB / PostgreSQL
- **Auth**: JWT (httpOnly cookies)
- **Testing**: Vitest, React Testing Library

## Prerequisites
- Node.js 20+ (check with: node --version)
- npm 10+ (check with: npm --version)
- MongoDB running locally OR a connection string

## Getting started

### 1. Clone and install
git clone https://github.com/your-org/your-repo.git
cd your-repo
npm install

### 2. Environment setup
cp .env.example .env
# Edit .env with your values (see Environment variables section below)

### 3. Run in development
npm run dev          # starts Vite dev server on http://localhost:5173
cd server
npm run dev          # starts Express on http://localhost:3001

### 4. Run tests
npm run test
npm run test:coverage

### 5. Build for production
npm run build        # outputs to dist/

## Environment variables

| Variable | Required | Description |
|---|---|---|
| VITE_API_BASE_URL | Yes | Backend API base URL |
| VITE_APP_NAME | No | App display name |
| VITE_SENTRY_DSN | No | Sentry error tracking |

| Server Variable | Required | Description |
|---|---|---|
| NODE_ENV | Yes | development / production |
| PORT | Yes | Server port (default: 3001) |
| DATABASE_URL | Yes | MongoDB/PostgreSQL connection string |
| JWT_SECRET | Yes | JWT signing secret (min 32 chars) |
| JWT_EXPIRES_IN | Yes | Token expiry (e.g. 7d) |
| CLIENT_URL | Yes | Frontend URL for CORS |

## Project structure
See .ai/skills/01-project-architect.md for the full folder structure.

Key rule: pages/ are thin shells, sections/ are page content blocks,
components/common/ holds reusable UI.

## Conventions

### Adding a new page
1. Create src/pages/NewPage.tsx
2. Create src/sections/newPage/ with section components
3. Register in src/routes/index.tsx with React.lazy()
4. Add nav link to src/components/layout/Navbar.tsx

### Adding a new API endpoint
1. Add route to server/src/routes/[feature].routes.ts
2. Add handler to server/src/controllers/[feature].controller.ts
3. Add business logic to server/src/services/[feature].service.ts
4. Add service call to src/services/[feature]Service.ts (frontend)
5. Create/update hook in src/hooks/use[Feature].ts

### Commit messages
Use conventional commits: feat|fix|refactor|style|test|docs|chore(scope): description
Example: feat(auth): add Google OAuth login

## Scripts

| Command | Description |
|---|---|
| npm run dev | Start Vite dev server |
| npm run build | Production build |
| npm run type-check | TypeScript check |
| npm run lint | ESLint check |
| npm run lint:fix | ESLint auto-fix |
| npm run test | Run all tests |
| npm run test:coverage | Tests + coverage report |
| npm run storybook | Start Storybook |

## Common issues

**Port already in use:**
lsof -ti:5173 | xargs kill -9

**TypeScript errors after pulling:**
npm run type-check — fix all errors before running

**MongoDB connection refused:**
Ensure MongoDB is running: brew services start mongodb-community
Or update DATABASE_URL in .env to use Atlas

## Contributing
1. Branch from main: git checkout -b feat/your-feature
2. Make changes following .ai/skills/ conventions
3. Ensure CI passes: type-check, lint, tests
4. Open PR with the PR template filled out
```

---

## ALSO CREATE: CONTRIBUTING.md

Short guide covering:
- Code style (Prettier + ESLint enforced by Husky)
- Commit message format
- PR checklist
- How to run the full test suite
- How to update dependencies

---

## DELIVERY

1. README.md — complete, accurate, runnable
2. CONTRIBUTING.md
3. Verify .env.example has every variable with description comments
4. Verify every script in package.json is documented in README
