# Prompt 09 — UI Consistency Audit
# Category: UI & Design
# Stack: Tailwind CSS + React + TypeScript

Audit this codebase for UI inconsistencies and standardize everything.

---

## SPACING

- Find all hardcoded pixel values for margin/padding (margin: 12px, p-[13px])
- Replace with Tailwind spacing scale: 1(4px) 2(8px) 3(12px) 4(16px) 6(24px) 8(32px) 12(48px) 16(64px)
- NEVER use arbitrary values like p-[13px], mt-[22px], gap-[7px]
- If an exact value is critical, add it to tailwind.config.ts spacing extension

---

## COLORS

- Find all hardcoded hex values outside tailwind.config.ts
- Find color values defined differently in multiple places (#FF0000 vs red vs rgb(255,0,0))
- Standardize all colors to CSS custom properties or Tailwind config tokens
- NEVER use text-black or text-white for body text — use neutral scale
- Semantic colors: success, warning, danger, info — use these for state indicators

---

## TYPOGRAPHY

- Find inconsistent font sizes (mixing text-sm, text-[13px], text-[15px] for body text)
- Standardize to the type scale: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
- Find inconsistent font weights — use only: font-normal(400) font-medium(500) font-semibold(600) font-bold(700)
- Find headings that aren't using h1-h6 tags (divs styled as headings)
- h1 = text-3xl font-bold, h2 = text-2xl font-semibold, h3 = text-lg font-semibold

---

## COMPONENT REUSE

Find every instance of:
- Custom-styled button NOT using Button from components/common/ → replace
- Custom modal/dialog NOT using Modal from components/common/ → replace
- Custom input NOT using Input from components/common/ → replace
- Duplicate badge/pill/tag implementations → consolidate to Badge component

If a common component is missing, create it. Then replace all instances.

---

## BORDER RADIUS

Enforce consistent rounding:
- Inputs, badges: rounded-md (8px)
- Cards: rounded-lg (12px)
- Large cards, modals: rounded-xl (16px)
- Buttons: rounded-md (8px)
- Pills/avatars: rounded-full
- Remove: any rounded-[Xpx] arbitrary values

---

## SHADOWS

Use only:
- shadow-sm — subtle surface elevation (cards, inputs)
- shadow-md — modals, dropdowns
- shadow-lg — popovers, tooltips
- Remove: custom box-shadow strings, arbitrary shadow values

---

## INTERACTIVE STATES (every clickable element must have)

- hover: state
- focus-visible: ring with ring-primary-500 ring-2 ring-offset-2
- active: slightly darker
- disabled: opacity-50 cursor-not-allowed

---

## REPORT FORMAT

For each violation:
  FILE: [path]
  LINE: ~[line number]
  ISSUE: [description]
  FIX: [what to change to]

Fix every violation. Deliver updated files.
