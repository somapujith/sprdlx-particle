# Skill: Accessibility Agent
# Agent: FRONTEND — every component, section, and page
# Stack: React + TypeScript + Tailwind
# Target: WCAG 2.1 AA compliance

---

## ACCESSIBILITY CHECKLIST — RUN BEFORE EVERY DELIVERY

- [ ] Every image has alt text (empty string for decorative)
- [ ] Every form input has an associated label
- [ ] Every interactive element is keyboard-reachable
- [ ] No `outline: none` without a replacement focus style
- [ ] Every page has one `<h1>` and correct heading hierarchy
- [ ] Every icon-only button has `aria-label`
- [ ] Loading states have `role="status"`
- [ ] Error messages have `role="alert"`
- [ ] Modals trap focus and return it on close

---

## SEMANTIC HTML — ALWAYS USE THE RIGHT ELEMENT

```tsx
// ✅ Navigation
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// ✅ Page structure
<header>...</header>
<main id="main-content">...</main>
<footer>...</footer>
<aside aria-label="Related content">...</aside>

// ✅ Actions → button, not div
<button type="button" onClick={handleClick}>Delete</button>

// ✅ Navigation → a, not div
<a href="/dashboard">Go to dashboard</a>

// ❌ Never
<div onClick={handleClick}>Delete</div>
<span onClick={() => navigate('/dashboard')}>Go to dashboard</span>
```

---

## HEADING HIERARCHY — STRICTLY ENFORCED

```tsx
// ✅ One h1 per page, no skipped levels
<h1>Page title</h1>         // one per page
  <h2>Section heading</h2>
    <h3>Sub-section</h3>
      <h4>Detail</h4>

// ❌ Never skip levels
<h1>Title</h1>
<h3>Subtitle</h3>  // skipped h2 — violation
```

---

## IMAGES

```tsx
// ✅ Content image — descriptive alt
<img src="/chart.png" alt="Bar chart showing monthly revenue growth from $10k in January to $45k in June" />

// ✅ Decorative image — empty alt (screen reader skips it)
<img src="/decorative-wave.svg" alt="" aria-hidden="true" />

// ✅ Icon used inline with text — hide from screen reader
<span aria-hidden="true"><CheckIcon /></span>
<span>Saved successfully</span>

// ✅ Icon-only button — label the button
<button type="button" aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>
```

---

## FORMS — FULL ACCESSIBLE PATTERN

```tsx
function AccessibleInput({
  id,
  label,
  error,
  hint,
  required,
  ...inputProps
}: InputProps) {
  const errorId = `${id}-error`;
  const hintId  = `${id}-hint`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
        {required && <span aria-hidden="true" className="ml-1 text-danger">*</span>}
        {required && <span className="sr-only">(required)</span>}
      </label>

      {hint && (
        <p id={hintId} className="text-sm text-neutral-500">{hint}</p>
      )}

      <input
        id={id}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={[hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ')}
        className={`... ${error ? 'border-danger focus:ring-danger' : 'border-neutral-300 focus:ring-primary-500'}`}
        {...inputProps}
      />

      {error && (
        <p id={errorId} role="alert" aria-live="polite" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
```

---

## FOCUS MANAGEMENT

```css
/* styles/index.css — never remove focus styles */
/* ✅ Replace outline:none with a visible custom style */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* ❌ Never */
* { outline: none; }
button:focus { outline: none; }
```

Tailwind equivalent on interactive elements:
```tsx
className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
```

Skip navigation link (required — first element in `<body>`):
```tsx
// src/components/layout/SkipLink.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="absolute -top-full left-4 z-50 rounded-md bg-primary-500 px-4 py-2 text-white focus:top-4"
    >
      Skip to main content
    </a>
  );
}
// usage in App.tsx — before everything else
<SkipLink />
<Navbar />
<main id="main-content">...</main>
```

---

## MODALS — FULL ACCESSIBLE PATTERN

```tsx
// Required attributes on modal container
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"  // optional
>
  <h2 id="modal-title">Confirm deletion</h2>
  <p id="modal-description">This action cannot be undone.</p>
  ...
</div>
```

Modal behavior requirements:
- Trap focus: Tab/Shift+Tab cycle only within modal.
- Close on Escape key.
- Return focus to the trigger element on close.
- Render in a portal (outside the main DOM tree).

```tsx
// Focus trap hook
import { useEffect, useRef } from 'react';

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    const focusable = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return containerRef;
}
```

---

## LIVE REGIONS — DYNAMIC CONTENT

```tsx
// Loading spinner
<div role="status" aria-label="Loading content" aria-live="polite">
  <Spinner aria-hidden="true" />
  <span className="sr-only">Loading...</span>
</div>

// Success/error toasts
<div role="alert" aria-live="assertive">  {/* for errors */}
  Error: {errorMessage}
</div>
<div role="status" aria-live="polite">   {/* for success */}
  Saved successfully
</div>

// sr-only utility (add to index.css or use Tailwind's sr-only)
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
```

---

## COLOR CONTRAST MINIMUMS

| Text type | Min ratio | Example passing combo |
|---|---|---|
| Normal text (< 18px) | 4.5 : 1 | neutral-700 on white |
| Large text (≥ 18px or ≥ 14px bold) | 3 : 1 | neutral-500 on white |
| UI components (borders, icons) | 3 : 1 | neutral-400 on white |

Never use `neutral-400` or lighter for body text on white backgrounds.
Minimum safe body text: `neutral-600` (#525252) on white = 7.0:1 ✅

---

## INTERACTIVE ELEMENTS CHECKLIST

| Element | Required |
|---|---|
| `<button>` | Visible text OR `aria-label` |
| `<a>` | Meaningful text (not "click here") |
| `<input>` | `<label>` associated via `htmlFor` |
| `<select>` | `<label>` associated via `htmlFor` |
| Icon-only action | `aria-label` on the button |
| Toggle | `aria-pressed="true/false"` |
| Expandable | `aria-expanded="true/false"` |
| Tab | `role="tab"` `aria-selected` `aria-controls` |
| Tab panel | `role="tabpanel"` `aria-labelledby` |
