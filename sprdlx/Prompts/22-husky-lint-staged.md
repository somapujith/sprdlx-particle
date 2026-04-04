# Prompt 22 — Husky + lint-staged (Pre-commit Guards)
# Category: Dev Experience & Tooling
# Stack: Any Node.js project

Set up pre-commit hooks so broken code can NEVER be committed.
Bad code stopped at the gate — not in CI, not in production.

---

## INSTALL

npm install --save-dev husky lint-staged @commitlint/cli @commitlint/config-conventional

---

## SETUP HUSKY

npx husky init

This creates .husky/ folder and adds prepare script to package.json.

---

## .husky/pre-commit

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx lint-staged
```

---

## .husky/pre-push

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "Running type check before push..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ TypeScript errors found. Fix them before pushing."
  exit 1
fi

echo "Running tests before push..."
npm run test -- --run
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Fix them before pushing."
  exit 1
fi

echo "✅ All checks passed."
```

---

## .husky/commit-msg

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx --no -- commitlint --edit $1
```

---

## commitlint.config.js

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'refactor', 'style', 'perf',
      'test', 'docs', 'chore', 'ci', 'revert'
    ]],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100],
  },
};
```

---

## package.json — lint-staged config

```json
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "eslint --fix --max-warnings=0",
      "prettier --write"
    ],
    "src/**/*.{css,json,md}": [
      "prettier --write"
    ],
    "server/src/**/*.ts": [
      "eslint --fix --max-warnings=0",
      "prettier --write"
    ]
  },
  "scripts": {
    "prepare": "husky"
  }
}
```

---

## WHAT HAPPENS ON EVERY COMMIT

1. ESLint runs on staged files — auto-fixes what it can, blocks commit if errors remain
2. Prettier formats all staged files
3. commitlint validates the commit message format
4. If any step fails → commit is REJECTED with a clear error message

## WHAT HAPPENS ON EVERY PUSH

1. TypeScript full type check — rejects push if type errors exist
2. All tests must pass — rejects push if any test fails

---

## VALID COMMIT MESSAGE EXAMPLES

```
feat(auth): add Google OAuth login
fix(dashboard): resolve CLS issue on stats section
refactor(components): extract Button to common folder
perf(images): convert hero images to WebP
test(userService): add error handling test cases
chore(deps): update vite to 5.3.0
docs(readme): update local setup instructions
```

---

## DELIVERY

All files above created and working.
Test by making a commit with a bad message → should be rejected.
Test by making a commit with a lint error → should be rejected.
