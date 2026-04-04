# Prompt 10 — Dark Mode System
# Category: UI & Design
# Stack: React + TypeScript + Tailwind CSS

Add a complete, professional dark mode system to this Tailwind project.

---

## STEP 1 — tailwind.config.ts

Enable class-based dark mode:
```ts
export default {
  darkMode: 'class', // toggled by adding 'dark' class to <html>
  // ... rest of config
}
```

---

## STEP 2 — CSS Variables in styles/index.css

```css
:root {
  --color-bg: theme('colors.white');
  --color-surface: theme('colors.neutral.50');
  --color-surface-raised: theme('colors.white');
  --color-text: theme('colors.neutral.900');
  --color-text-muted: theme('colors.neutral.600');
  --color-text-subtle: theme('colors.neutral.400');
  --color-border: theme('colors.neutral.200');
  --color-border-strong: theme('colors.neutral.300');
}

.dark {
  --color-bg: theme('colors.neutral.950');
  --color-surface: theme('colors.neutral.900');
  --color-surface-raised: theme('colors.neutral.800');
  --color-text: theme('colors.neutral.50');
  --color-text-muted: theme('colors.neutral.400');
  --color-text-subtle: theme('colors.neutral.600');
  --color-border: theme('colors.neutral.800');
  --color-border-strong: theme('colors.neutral.700');
}
```

---

## STEP 3 — Theme Context

Create src/context/ThemeContext.tsx:
```tsx
interface ThemeContextValue {
  theme: 'light' | 'dark';
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    // 1. Check localStorage first
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (stored) return stored;
    // 2. Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (): void =>
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');

  const setTheme = (t: 'light' | 'dark'): void => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
```

---

## STEP 4 — Theme Toggle Component

Create src/components/common/ThemeToggle.tsx:
```tsx
export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
```

---

## STEP 5 — AUDIT EVERY COMPONENT

Find every hardcoded light-mode color and add dark: variant:

```tsx
// ❌ Light only
<div className="bg-white text-gray-900 border-gray-200">

// ✅ Dark aware
<div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 border-neutral-200 dark:border-neutral-700">
```

Common patterns to find and fix:
- bg-white → bg-white dark:bg-neutral-900
- bg-gray-50 / bg-neutral-50 → dark:bg-neutral-950
- text-gray-900 / text-neutral-900 → dark:text-neutral-50
- text-gray-600 / text-neutral-600 → dark:text-neutral-400
- border-gray-200 / border-neutral-200 → dark:border-neutral-700
- shadow-sm → stays same (shadows disappear naturally in dark mode)

---

## STEP 6 — IMAGES

Images that are too bright in dark mode:
```tsx
<img className="opacity-90 dark:opacity-75" src="..." alt="..." />
```

SVG icons that need to adapt:
```tsx
// Use currentColor for stroke/fill so they inherit text color
<svg stroke="currentColor" fill="currentColor" ...>
```

---

## DELIVERY

1. Updated tailwind.config.ts
2. Updated styles/index.css with CSS variables
3. ThemeContext.tsx — full implementation
4. ThemeToggle.tsx — full implementation
5. Every component file updated with dark: variants
6. ThemeProvider wrapped in App.tsx or main.tsx
