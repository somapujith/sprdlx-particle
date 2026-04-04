# Skill: UI Designer
# Agent: DESIGNER / FRONTEND — styling, layout, visual consistency
# Stack: Tailwind CSS + React + TypeScript

---

## CORE RULE

**Never invent one-off styles.** Every visual decision — color, spacing, radius,
shadow, typography — must come from the design tokens defined in this file.
If something isn't in the token system, add it to `tailwind.config.ts` first.

---

## TAILWIND CONFIG — SINGLE SOURCE OF TRUTH

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          400: '#60a5fa',
          500: '#3b82f6',   // ← main brand color
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        // Neutrals (use these, not gray-*)
        neutral: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Semantic
        success: { light: '#dcfce7', DEFAULT: '#16a34a', dark: '#14532d' },
        warning: { light: '#fef9c3', DEFAULT: '#ca8a04', dark: '#713f12' },
        danger:  { light: '#fee2e2', DEFAULT: '#dc2626', dark: '#7f1d1d' },
        info:    { light: '#dbeafe', DEFAULT: '#2563eb', dark: '#1e3a8a' },
      },
      spacing: {
        // Stick to this scale: 1(4px) 2(8px) 3(12px) 4(16px) 6(24px) 8(32px) 12(48px) 16(64px)
        // Don't use arbitrary values like p-[13px] — use the closest scale value
      },
      borderRadius: {
        sm:   '4px',
        md:   '8px',   // default for inputs, badges
        lg:   '12px',  // default for cards
        xl:   '16px',  // large cards, modals
        '2xl':'24px',  // hero sections
        full: '9999px',// pills, avatars
      },
      fontSize: {
        xs:   ['12px', { lineHeight: '16px' }],
        sm:   ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg:   ['18px', { lineHeight: '28px' }],
        xl:   ['20px', { lineHeight: '28px' }],
        '2xl':['24px', { lineHeight: '32px' }],
        '3xl':['30px', { lineHeight: '36px' }],
        '4xl':['36px', { lineHeight: '40px' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      boxShadow: {
        sm:  '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md:  '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg:  '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl:  '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

---

## SPACING SCALE — USE ONLY THESE

| Token | Value | Use case |
|---|---|---|
| `p-1` / `m-1` | 4px | Icon padding, tiny gaps |
| `p-2` / `m-2` | 8px | Dense UI, compact badges |
| `p-3` / `m-3` | 12px | Small component padding |
| `p-4` / `m-4` | 16px | Standard component padding |
| `p-6` / `m-6` | 24px | Card padding, section gaps |
| `p-8` / `m-8` | 32px | Large section padding |
| `p-12` / `m-12` | 48px | Section vertical rhythm |
| `p-16` / `m-16` | 64px | Hero padding |
| `gap-2` | 8px | Tight flex/grid gaps |
| `gap-4` | 16px | Standard gaps |
| `gap-6` | 24px | Card grid gaps |
| `gap-8` | 32px | Section content gaps |

**Never use arbitrary spacing like `p-[13px]`, `mt-[22px]`, `gap-[7px]`.**
If the exact value matters, add it to the spacing scale in tailwind.config.ts.

---

## TYPOGRAPHY RULES

```tsx
// Page titles (one per page)
<h1 className="text-3xl font-bold text-neutral-900 tracking-tight">

// Section headings
<h2 className="text-2xl font-semibold text-neutral-800">

// Card / component headings
<h3 className="text-lg font-semibold text-neutral-800">

// Body text
<p className="text-base text-neutral-600 leading-relaxed">

// Small / supporting text
<p className="text-sm text-neutral-500">

// Labels (form, table headers)
<label className="text-sm font-medium text-neutral-700">

// Code
<code className="text-sm font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-800">
```

**Never** use raw `text-black` or `text-white` for body text — use `neutral-*`.
**Never** use font sizes outside the type scale.

---

## COLOR USAGE RULES

```
primary-500     → interactive elements (buttons, links, focus rings)
primary-600     → hover state of primary
primary-700     → active/pressed state
neutral-900     → headings, high-emphasis text
neutral-700     → body text
neutral-500     → secondary / supporting text
neutral-400     → placeholder, disabled text
neutral-200     → borders, dividers
neutral-100     → subtle backgrounds (table stripes, code blocks)
neutral-50      → page background

success.DEFAULT → success states, positive badges
warning.DEFAULT → warning states
danger.DEFAULT  → error states, destructive actions
info.DEFAULT    → informational states
```

**Never** use color to convey information alone — always pair with an icon or text.

---

## COMPONENT CLASS PATTERNS

### Card
```tsx
<div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
```

### Badge
```tsx
// Success
<span className="inline-flex items-center rounded-full bg-success-light px-2.5 py-0.5 text-xs font-medium text-success-dark">
// Warning
<span className="inline-flex items-center rounded-full bg-warning-light px-2.5 py-0.5 text-xs font-medium text-warning-dark">
// Danger
<span className="inline-flex items-center rounded-full bg-danger-light px-2.5 py-0.5 text-xs font-medium text-danger-dark">
```

### Input
```tsx
<input className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400" />
```

### Button — Primary
```tsx
<button className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:bg-primary-700">
```

### Button — Secondary
```tsx
<button className="inline-flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
```

### Button — Danger
```tsx
<button className="inline-flex items-center justify-center gap-2 rounded-md bg-danger px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-danger-dark focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
```

---

## LAYOUT PATTERNS

### Page wrapper
```tsx
<main className="min-h-screen bg-neutral-50">
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    {/* content */}
  </div>
</main>
```

### Two-column layout
```tsx
<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
  <aside className="lg:col-span-1">{/* sidebar */}</aside>
  <section className="lg:col-span-2">{/* main */}</section>
</div>
```

### Card grid
```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
```

### Stack (vertical)
```tsx
<div className="flex flex-col gap-4">
```

### Inline group
```tsx
<div className="flex items-center gap-2">
```

---

## RESPONSIVE BREAKPOINTS

Always mobile-first. Add breakpoints only when layout changes.

| Prefix | Min-width | Use for |
|---|---|---|
| (none) | 0px | Mobile — base styles |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |

---

## DARK MODE (if enabled)

Add `dark:` variants alongside every color class:
```tsx
<div className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
```

Enable in tailwind.config.ts: `darkMode: 'class'`
Toggle by adding/removing `dark` class on `<html>`.

---

## WHAT NEVER TO DO

- ❌ Arbitrary values: `w-[347px]`, `mt-[13px]`, `text-[15px]`
- ❌ Inline `style={{}}` for anything covered by Tailwind
- ❌ Raw `#hex` colors outside tailwind.config.ts
- ❌ Multiple competing utility classes for the same property: `text-sm text-base`
- ❌ `!important` overrides (`!text-red-500`) — redesign instead
- ❌ Pixel-perfect designs that break on different text sizes
- ❌ Fixed heights on text containers — use `min-h-` instead
- ❌ `text-black` / `text-white` for body text — use neutral scale
