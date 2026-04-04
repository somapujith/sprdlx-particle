# Prompt 15 — Accessibility Audit
# Category: UI & Design — Accessibility
# Stack: React + TypeScript + Tailwind
# Target: WCAG 2.1 AA compliance

---

## CHECKLIST — FIX EVERY VIOLATION

### Semantic HTML
- <div onClick> → replace with <button type="button">
- <span onClick> → replace with <button> or <a>
- Navigation areas → wrap in <nav aria-label="...">
- Page structure: <header>, <main id="main-content">, <footer>
- Every page has exactly ONE <h1>
- Heading levels never skip (h1 → h2 → h3, never h1 → h3)

### Images
- Every <img>: alt="description" or alt="" (empty for decorative)
- Decorative images: add aria-hidden="true"
- Icon-only buttons: add aria-label="description"
- SVG icons in buttons: add aria-hidden="true" to the SVG

### Forms
- Every input/select/textarea has associated <label>:
  → <label htmlFor="email">Email</label><input id="email" />
  → OR <label>Email <input ... /></label>
  → OR aria-label="Email" on the input
- Required fields: aria-required="true"
- Invalid fields: aria-invalid="true"
- Error messages: aria-describedby="[error-id]" on the input
- Error element: id="[error-id]" role="alert" aria-live="polite"

### Focus Management
- NEVER: outline: none; or outline: 0; without replacement
- ALWAYS: focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
- Add skip nav link as FIRST element in body:
```tsx
<a
  href="#main-content"
  className="absolute -top-full left-4 z-50 rounded-md bg-primary-500 px-4 py-2 text-white focus:top-4"
>
  Skip to main content
</a>
```

### Modals
- role="dialog" aria-modal="true" aria-labelledby="modal-title-id"
- Trap focus inside when open (Tab/Shift+Tab cycle only within modal)
- Close on Escape key
- Return focus to trigger element on close

### Dynamic Content
- Loading spinners: role="status" aria-label="Loading..."
- Error messages: role="alert" aria-live="assertive"
- Success messages: role="status" aria-live="polite"
- Expandable sections: aria-expanded="true|false" on trigger
- Tabs: role="tab" aria-selected aria-controls on tab, role="tabpanel" on panel

### Color Contrast
- Normal text (< 18px): min ratio 4.5:1
- Large text (≥ 18px or ≥ 14px bold): min ratio 3:1
- UI components (borders, icons): min ratio 3:1
- Safe minimum for body text on white: neutral-600 (#525252) = 7.0:1
- NEVER use neutral-400 or lighter for body text on white

### Links
- Never: <a href="#">action</a> → use <button>
- Never: "click here", "read more" → use descriptive text
- External links: rel="noopener noreferrer" + aria-label noting new tab

---

## ACCESSIBLE FORM INPUT PATTERN

```tsx
function AccessibleInput({ id, label, error, hint, required, ...props }: InputProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
        {required && <span aria-hidden="true" className="ml-1 text-danger">*</span>}
        {required && <span className="sr-only">(required)</span>}
      </label>
      {hint && <p id={hintId} className="text-sm text-neutral-500">{hint}</p>}
      <input
        id={id}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={[hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ')}
        {...props}
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

## SR-ONLY UTILITY

Add to styles/index.css:
```css
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
```

---

## DELIVERY

For every violation found:
  FILE: [path]
  ELEMENT: [description]
  ISSUE: [a11y problem]
  FIX: [what was changed]

Fix every violation. Deliver complete updated files.
