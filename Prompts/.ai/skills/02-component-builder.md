# Skill: Component Builder
# Agent: FRONTEND — building any React component or section
# Stack: React + TypeScript + Tailwind

---

## COMPONENT RULES — ALL MUST PASS

1. Every component is a named export AND a default export.
2. Every prop is typed — no implicit `any`, no untyped props.
3. Every component renders real UI — no empty returns, no `// TODO`.
4. Every async operation has loading, error, and empty states.
5. No `fetch()` or `axios` directly in component body.
6. No `localStorage` access during render.
7. Side effects only inside `useEffect` or custom hooks.

---

## COMPONENT FILE TEMPLATE

```tsx
// src/components/[feature]/ComponentName.tsx

import { type FC } from 'react';

// 1. Types first — always in the same file unless shared across 2+ files
interface ComponentNameProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  onAction: (id: string) => void;
}

// 2. Component — named function (not arrow function at top level)
export function ComponentName({
  title,
  description,
  isLoading = false,
  onAction,
}: ComponentNameProps) {
  if (isLoading) {
    return <ComponentNameSkeleton />;
  }

  return (
    <div className="...">
      <h2 className="...">{title}</h2>
      {description && <p className="...">{description}</p>}
      <button
        type="button"
        onClick={() => onAction('some-id')}
        className="..."
      >
        Take action
      </button>
    </div>
  );
}

// 3. Skeleton (loading state) — always co-located with component
function ComponentNameSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-6 w-48 rounded bg-gray-200" />
      <div className="h-4 w-full rounded bg-gray-200" />
    </div>
  );
}

// 4. Default export — always present
export default ComponentName;
```

---

## SECTION FILE TEMPLATE

Sections are larger page-level blocks. They may own their own data fetching.

```tsx
// src/sections/home/HeroSection.tsx

import { useHeroData } from '@hooks/useHeroData';
import { Button } from '@components/common/Button';
import { Spinner } from '@components/common/Spinner';

export function HeroSection() {
  const { data, isLoading, error } = useHeroData();

  if (isLoading) return <HeroSkeleton />;
  if (error) return <HeroError message={error.message} />;

  return (
    <section aria-labelledby="hero-heading" className="...">
      <h1 id="hero-heading" className="...">{data.headline}</h1>
      <p className="...">{data.subheading}</p>
      <Button variant="primary" size="lg" onClick={() => {}}>
        Get started
      </Button>
    </section>
  );
}

function HeroSkeleton() { /* ... */ }
function HeroError({ message }: { message: string }) { /* ... */ }

export default HeroSection;
```

---

## THREE-STATE RULE — MANDATORY FOR ALL DATA-DEPENDENT UI

Every component that shows data from an API MUST handle all three:

```tsx
// ✅ Correct
if (isLoading) return <Spinner />;
if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;
if (!data || data.length === 0) return <EmptyState message="No items found" />;
return <DataList items={data} />;

// ❌ Wrong — missing states
return <DataList items={data} />;
```

---

## COMMON COMPONENT STANDARDS

### Button
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}
// Always: type="button" by default (prevent accidental form submit)
// Always: disabled when isLoading=true
// Always: aria-busy={isLoading}
```

### Input
```tsx
interface InputProps {
  label: string;           // always required — accessibility
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;          // shows below input when set
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}
// Always: wrap in a label element
// Always: show error with role="alert" aria-live="polite"
// Always: aria-required={required}
// Always: aria-invalid={!!error}
// Always: aria-describedby pointing to error element id
```

### Modal
```tsx
// Always: role="dialog" aria-modal="true" aria-labelledby="modal-title"
// Always: trap focus inside when open
// Always: close on Escape key
// Always: close on backdrop click (configurable)
// Always: return focus to trigger element on close
// Always: render in a React Portal
```

---

## NAMING CONVENTIONS

| Thing | Convention | Example |
|---|---|---|
| Component file | PascalCase.tsx | `UserCard.tsx` |
| Section file | PascalCase + Section.tsx | `HeroSection.tsx` |
| Component function | PascalCase | `function UserCard()` |
| Props interface | ComponentName + Props | `UserCardProps` |
| Hook | camelCase + use prefix | `useUserData` |
| Boolean prop | is/has/can/should prefix | `isLoading`, `hasError` |
| Event handler prop | on + Event | `onSubmit`, `onClick` |
| Event handler function | handle + Event | `handleSubmit`, `handleClick` |
| CSS class variable | className (never class) | `className="flex..."` |

---

## WHAT NEVER GOES IN A COMPONENT

- `fetch()` or `axios` calls → belongs in `src/services/`
- Business logic → belongs in a custom hook
- Hardcoded API URLs → belongs in `.env` + `api.ts`
- Raw `localStorage` access → belongs in a utility/service
- Multiple responsibilities in one file → split it
- More than ~200 lines → consider splitting into sub-components
