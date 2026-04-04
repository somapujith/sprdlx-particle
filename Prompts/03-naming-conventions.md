# Prompt 03 — Naming Conventions Audit
# Category: Code Quality
# Stack: React + Vite + TypeScript + Tailwind

Audit every file and symbol in this codebase for naming consistency.
Apply these rules and fix every violation.

---

## FILE NAMING

| File type | Convention | Example |
|---|---|---|
| React component | PascalCase.tsx | UserCard.tsx |
| Section | PascalCase + Section.tsx | HeroSection.tsx |
| Page | PascalCase.tsx | Dashboard.tsx |
| Hook | camelCase, use prefix | useAuth.ts |
| Service | camelCase + Service | userService.ts |
| Context | PascalCase + Context | AuthContext.tsx |
| Store | camelCase + Store | cartStore.ts |
| Utility | camelCase, descriptive | formatDate.ts |
| Types | camelCase + .types | user.types.ts |
| Constants | camelCase | constants.ts |
| Test | same name + .test | Button.test.tsx |

---

## VARIABLE + FUNCTION NAMING

| Thing | Convention | Example |
|---|---|---|
| React component | PascalCase | function UserCard() |
| All other functions | camelCase | formatDate() |
| Boolean variables | is/has/can/should prefix | isLoading, hasError |
| Event handlers | handle prefix | handleSubmit, handleClick |
| Event handler props | on prefix | onSubmit, onClick |
| Constants | SCREAMING_SNAKE_CASE | MAX_RETRIES |
| TypeScript interfaces | PascalCase | UserCardProps |
| TypeScript type aliases | PascalCase | ApiResponse |
| Enums (avoid — use unions) | PascalCase | Role (prefer type Role = 'admin' \| 'user') |

---

## CSS / TAILWIND NAMING

- CSS module classes → camelCase (styles.navWrapper not styles.nav-wrapper)
- CSS custom properties → kebab-case (--color-primary)
- Tailwind → no change, use utility classes as-is

---

## REPORT FORMAT

List every violation:
  [file path]
  BEFORE: [old name]
  AFTER:  [new name]
  REASON: [which rule]

Then fix every file.
Update every import that references a renamed file.
Never break a reference — rename file AND all its consumers.
