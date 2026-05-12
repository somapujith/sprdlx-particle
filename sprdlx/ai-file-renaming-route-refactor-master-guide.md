# AI File Renaming & Route Refactoring Master Guide

# Goal

This document is designed for Claude Code / Cursor AI to:

- Rename ALL files with proper naming conventions
- Organize folders
- Standardize assets
- Refactor imports
- Fix broken routes
- Fix image references
- Fix dynamic imports
- Fix aliases
- Maintain project integrity after renaming

This is a FULL-SCALE intelligent cleanup + refactor workflow.

---

# IMPORTANT SAFETY RULES

Before doing ANYTHING:

1. Create a FULL backup.
2. Create a new Git branch.
3. Commit current state.
4. Generate rename preview before modifying files.
5. Never rename system/generated framework files blindly.

---

# STEP 1 — PROJECT AUDIT

Analyze:
- Folder structure
- Duplicate file names
- Bad naming conventions
- Inconsistent casing
- Route structures
- Import patterns
- Asset organization
- Broken imports
- Unused files
- Dead assets

Generate a report BEFORE renaming.

---

# STEP 2 — GLOBAL NAMING CONVENTIONS

# React Components

## Use PascalCase

GOOD:
```txt
HeroSection.tsx
Navbar.tsx
FeatureCard.tsx
PricingSection.tsx
```

BAD:
```txt
hero.tsx
navbarcomponent.tsx
FEATURECARD.tsx
pricing_section.tsx
```

---

# Hooks

## Use camelCase with use prefix

GOOD:
```txt
useAuth.ts
useScrollAnimation.ts
useTheme.ts
```

BAD:
```txt
authHook.ts
scroll_animation.ts
themehook.ts
```

---

# Utility Files

## Use camelCase

GOOD:
```txt
formatDate.ts
generateSlug.ts
apiClient.ts
```

BAD:
```txt
Format_Date.ts
generate_slug.ts
API_CLIENT.ts
```

---

# Constants

## Use camelCase or SCREAMING_SNAKE_CASE

GOOD:
```txt
routes.ts
appConfig.ts
API_ENDPOINTS.ts
```

---

# Pages

## Use PascalCase

GOOD:
```txt
HomePage.tsx
AboutPage.tsx
ContactPage.tsx
```

---

# Layouts

GOOD:
```txt
MainLayout.tsx
DashboardLayout.tsx
```

---

# Context Files

GOOD:
```txt
AuthContext.tsx
ThemeContext.tsx
```

---

# Store Files

GOOD:
```txt
authStore.ts
themeStore.ts
```

---

# Types

GOOD:
```txt
user.types.ts
api.types.ts
```

---

# API Files

GOOD:
```txt
authApi.ts
userApi.ts
paymentApi.ts
```

---

# Asset Naming Conventions

# Images

## Use kebab-case

GOOD:
```txt
hero-background.webp
feature-card-image.webp
founder-portrait.webp
```

BAD:
```txt
HeroBG.PNG
IMG_9283.png
featureCardImage.jpg
```

---

# Icons

GOOD:
```txt
arrow-right.svg
close-icon.svg
menu-icon.svg
```

---

# Videos

GOOD:
```txt
hero-intro-video.mp4
product-demo.mp4
```

---

# Fonts

GOOD:
```txt
inter-variable.woff2
satoshi-medium.woff2
```

---

# Folder Naming

## Use lowercase + kebab-case

GOOD:
```txt
feature-sections/
landing-page/
auth-pages/
```

BAD:
```txt
FeatureSections/
Landing_Page/
AUTH/
```

---

# STEP 3 — ROUTE REFACTORING

After renaming files:

## MUST FIX

- Relative imports
- Absolute imports
- Dynamic imports
- Lazy imports
- Route definitions
- Image references
- CSS imports
- Asset references
- TSConfig aliases
- Vite aliases
- Next.js aliases
- Barrel exports

---

# Route Naming Conventions

GOOD:
```txt
/about
/contact
/pricing
/dashboard/settings
```

BAD:
```txt
/AboutUs
/contact_page
/PRICING
```

---

# React Router Refactor Rules

## Convert ALL routes to lowercase kebab-case

Example:

OLD:
```tsx
<Route path="/AboutUs" />
```

NEW:
```tsx
<Route path="/about-us" />
```

---

# Dynamic Route Naming

GOOD:
```txt
/blog/:slug
/product/:id
/user/:username
```

---

# STEP 4 — IMPORT REFACTORING

Fix ALL imports automatically after renaming.

## Examples

OLD:
```tsx
import Hero from "../components/hero";
```

NEW:
```tsx
import HeroSection from "../components/HeroSection";
```

---

# Alias Refactoring

Fix:
- @/
- src/
- ~/
- custom aliases

Update:
- tsconfig.json
- jsconfig.json
- vite.config.ts
- webpack config

---

# STEP 5 — IMAGE & ASSET OPTIMIZATION

After renaming:

## Convert:
- PNG → WebP
- JPG → WebP
- Compress large images
- Remove duplicate assets
- Remove unused assets

---

# STEP 6 — REMOVE FILE CHAOS

Detect and clean:
- Untitled files
- Final-final-final files
- Duplicate exports
- Unused folders
- Backup files
- Temp files

BAD:
```txt
final2.tsx
newfinal.tsx
hero-copy.tsx
```

GOOD:
```txt
HeroSection.tsx
```

---

# STEP 7 — CLEAN IMPORT STRUCTURE

Prefer:

GOOD:
```tsx
import { Button } from "@/components/ui/Button";
```

OVER:
```tsx
import Button from "../../../../components/ui/Button";
```

---

# STEP 8 — BARREL EXPORTS

Create index.ts files:

GOOD:
```txt
components/
 ├── ui/
 │    ├── Button.tsx
 │    ├── Card.tsx
 │    └── index.ts
```

Example:
```ts
export { default as Button } from "./Button";
export { default as Card } from "./Card";
```

---

# STEP 9 — FILE ORGANIZATION

# Recommended Structure

```txt
src/
 ├── app/
 ├── assets/
 │    ├── images/
 │    ├── icons/
 │    ├── videos/
 │    └── fonts/
 ├── components/
 │    ├── common/
 │    ├── ui/
 │    ├── sections/
 │    └── animations/
 ├── pages/
 ├── layouts/
 ├── hooks/
 ├── services/
 ├── api/
 ├── store/
 ├── context/
 ├── routes/
 ├── utils/
 ├── constants/
 ├── lib/
 ├── styles/
 ├── types/
 └── config/
```

---

# STEP 10 — TYPESCRIPT SAFETY

After renaming:
- Fix type imports
- Fix generic imports
- Fix enum imports
- Fix interfaces
- Fix path aliases

Run:
```bash
npm run type-check
```

---

# STEP 11 — FINAL VERIFICATION

After ALL renaming:

Run:
```bash
npm install
npm run lint
npm run type-check
npm run build
npm run preview
```

---

# STEP 12 — AUTO FIX BROKEN REFERENCES

AI MUST:
- Detect broken imports
- Detect broken routes
- Detect broken assets
- Detect broken dynamic imports
- Detect missing exports
- Detect circular dependencies

And automatically repair them.

---

# STEP 13 — NEXT.JS SPECIFIC RULES

If using Next.js:

DO NOT rename blindly:
- app/
- pages/
- layout.tsx
- page.tsx
- loading.tsx
- error.tsx

Maintain framework conventions.

---

# STEP 14 — VITE SPECIFIC RULES

Ensure:
- vite.config.ts aliases remain valid
- Asset imports still resolve
- Lazy imports work correctly

---

# STEP 15 — CLAUDE CODE EXECUTION PROMPT

Use this EXACT prompt:

```txt
Audit and refactor this entire project structure professionally.

Tasks:
1. Rename ALL files using proper naming conventions.
2. Standardize component naming.
3. Standardize asset naming.
4. Organize folders professionally.
5. Fix ALL broken imports automatically.
6. Fix ALL routes after renaming.
7. Fix ALL image references.
8. Fix aliases and tsconfig paths.
9. Remove duplicate/unused files.
10. Remove temporary/final/final2 files.
11. Create barrel exports where appropriate.
12. Optimize images and assets.
13. Maintain full project functionality.
14. Detect and fix broken dynamic imports.
15. Ensure build succeeds after refactor.
16. Preserve framework conventions.
17. Generate a full report of all renamed files.

VERY IMPORTANT:
- NEVER break the app.
- NEVER rename framework-critical files incorrectly.
- ALWAYS auto-fix imports after renaming.
- ALWAYS verify build integrity after changes.
- ALWAYS generate rename previews before applying changes.
```

---

# STEP 16 — FINAL SUCCESS CRITERIA

The project should have:
- Clean naming conventions
- Organized folders
- Zero broken imports
- Zero broken routes
- Zero duplicate files
- Optimized assets
- Clean architecture
- Scalable structure
- Production-ready maintainability

---

# BONUS RULES

# Naming Cheat Sheet

## Components
PascalCase.tsx

## Hooks
useCamelCase.ts

## Utilities
camelCase.ts

## Assets
kebab-case.webp

## Routes
lowercase-kebab-case

## Folders
lowercase-kebab-case

---

# FINAL GOAL

Transform the project from:
- messy
- inconsistent
- chaotic

Into:
- scalable
- enterprise-grade
- production-ready
- maintainable
- clean architecture
