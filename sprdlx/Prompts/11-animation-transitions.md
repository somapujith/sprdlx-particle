# Prompt 11 — Animation + Transitions
# Category: UI & Design
# Stack: React + TypeScript + Tailwind CSS

Add professional, consistent motion to this project.
Animations should feel purposeful — not decorative.

---

## CORE RULES

1. Every animation respects prefers-reduced-motion
2. Transitions on interactive elements are instant feedback, not decoration
3. No animation longer than 300ms for UI responses (hover, focus, click)
4. No animation longer than 500ms for page transitions
5. Easing: ease-out for entrances, ease-in for exits, ease-in-out for state changes
6. Never animate layout properties (width, height, top, left) — use transform instead

---

## TAILWIND TRANSITION STANDARDS

Add to tailwind.config.ts:
```ts
extend: {
  transitionDuration: {
    DEFAULT: '150ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
  },
  transitionTimingFunction: {
    'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  keyframes: {
    'fade-in': {
      from: { opacity: '0' },
      to: { opacity: '1' },
    },
    'fade-in-up': {
      from: { opacity: '0', transform: 'translateY(8px)' },
      to: { opacity: '1', transform: 'translateY(0)' },
    },
    'slide-in-right': {
      from: { transform: 'translateX(100%)' },
      to: { transform: 'translateX(0)' },
    },
    'scale-in': {
      from: { opacity: '0', transform: 'scale(0.95)' },
      to: { opacity: '1', transform: 'scale(1)' },
    },
  },
  animation: {
    'fade-in': 'fade-in 200ms ease-out',
    'fade-in-up': 'fade-in-up 250ms ease-out',
    'slide-in-right': 'slide-in-right 300ms ease-out',
    'scale-in': 'scale-in 150ms ease-out',
  },
}
```

---

## INTERACTIVE ELEMENT STANDARDS

Every interactive element needs:
```tsx
// Buttons
className="transition-colors duration-150 hover:bg-primary-600 active:bg-primary-700"

// Links
className="transition-colors duration-150 hover:text-primary-600"

// Cards (clickable)
className="transition-shadow duration-200 hover:shadow-md"

// Focus rings — always instant (no transition on focus)
className="focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
```

---

## ENTRANCE ANIMATIONS

```tsx
// Page sections (on mount)
<section className="animate-fade-in-up">

// Modals
<div className="animate-scale-in">

// Sidebars / drawers
<div className="animate-slide-in-right">

// Toast notifications
<div className="animate-fade-in-up">

// Skeleton → content transition
// Don't animate — just swap. Fast enough to not need animation.
```

---

## LOADING STATES

```tsx
// Skeleton shimmer
<div className="animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700 h-4 w-48" />

// Spinner
<div
  role="status"
  aria-label="Loading"
  className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-primary-500"
/>

// Button loading
<button disabled aria-busy="true" className="...">
  <Spinner className="h-4 w-4" aria-hidden="true" />
  <span>Saving...</span>
</button>
```

---

## PREFERS-REDUCED-MOTION

Add to styles/index.css:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

For JS-driven animations:
```ts
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
  // run animation
}
```

---

## AUDIT

Find and fix:
- Abrupt show/hide without transition (display:none toggling)
  → Use opacity + pointer-events or a library like Headless UI Transition
- Jarring color changes on hover with no transition
- Modals that appear instantly without scale-in
- Toasts that appear without fade-in-up

---

## DELIVERY

1. Updated tailwind.config.ts with animation tokens
2. Updated styles/index.css with reduced-motion reset
3. Every interactive component updated with transition classes
4. Modal, Toast, Drawer components updated with entrance animations
