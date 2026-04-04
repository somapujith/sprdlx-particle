# Prompt 20 — ESLint + Prettier Full Config
# Category: Dev Experience & Tooling
# Stack: React + Vite + TypeScript

Set up a strict, consistent code quality config for this project.
Every rule has a reason. Nothing is optional.

---

## INSTALL

npm install --save-dev \
  eslint \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-jsx-a11y \
  eslint-plugin-import \
  eslint-plugin-unused-imports \
  prettier \
  eslint-config-prettier \
  eslint-plugin-prettier

---

## .eslintrc.json

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json",
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": { "jsx": true }
  },
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y",
    "import",
    "unused-imports"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true
    }],
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
    ],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "error",
    "no-alert": "error",
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": ["error", "always"],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/display-name": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/no-noninteractive-element-interactions": "error",
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always",
      "alphabetize": { "order": "asc", "caseInsensitive": true }
    }],
    "import/no-duplicates": "error"
  },
  "settings": {
    "react": { "version": "detect" }
  },
  "ignorePatterns": ["dist/", "node_modules/", "*.config.ts", "*.config.js"]
}
```

---

## .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSameLine": false,
  "jsxSingleQuote": false
}
```

---

## .eslintignore

```
dist/
node_modules/
coverage/
*.min.js
public/
```

---

## .prettierignore

```
dist/
node_modules/
coverage/
public/
*.min.css
*.min.js
```

---

## package.json scripts

```json
{
  "scripts": {
    "lint":        "eslint src --ext .ts,.tsx --max-warnings=0",
    "lint:fix":    "eslint src --ext .ts,.tsx --fix",
    "format":      "prettier --write \"src/**/*.{ts,tsx,css,json,md}\"",
    "format:check":"prettier --check \"src/**/*.{ts,tsx,css,json,md}\"",
    "type-check":  "tsc --noEmit"
  }
}
```

---

## AFTER SETUP

Run: npm run lint:fix
Fix all remaining errors that couldn't be auto-fixed.
Run: npm run format
Run: npm run type-check

Target: zero lint errors, zero type errors, consistent formatting.
