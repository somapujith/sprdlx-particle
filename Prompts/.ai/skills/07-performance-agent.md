# Skill: Performance Agent
# Agent: FRONTEND — any component, page, or build config change
# Stack: React + Vite + TypeScript

---

## PERFORMANCE CHECKLIST — RUN BEFORE EVERY DELIVERY

- [ ] Route-level components use React.lazy()
- [ ] No unnecessary re-renders (check memo/callback usage)
- [ ] No expensive calculations in render body (use useMemo)
- [ ] Images have width + height + loading="lazy"
- [ ] No full library imports where a sub-import works
- [ ] No fetch() inside component bodies

---

## RULE 1 — CODE SPLITTING (mandatory for all routes)

```tsx
// src/routes/index.tsx — ALL page imports must be lazy
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageLoader from '@components/common/PageLoader';

const Home      = lazy(() => import('@pages/Home'));
const Dashboard = lazy(() => import('@pages/Dashboard'));
const Profile   = lazy(() => import('@pages/Profile'));
const NotFound  = lazy(() => import('@pages/NotFound'));

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
```

Also lazy-load: modals not shown on first load, charts, rich text editors, map embeds.

```tsx
const ChartComponent = lazy(() => import('@components/charts/RevenueChart'));
const RichEditor = lazy(() => import('@components/common/RichEditor'));
```

---

## RULE 2 — MEMOIZATION

### React.memo — prevent child re-renders
```tsx
// ✅ Use when: component is pure (same props = same output)
// and its parent re-renders frequently
export const UserCard = React.memo(function UserCard({ user }: UserCardProps) {
  return <div>{user.name}</div>;
});

// ❌ Don't memo everything — it adds overhead
// Only memo components that actually cause measurable slowness
```

### useMemo — expensive computations
```tsx
// ✅ Use when: calculation is expensive and deps don't change often
const sortedUsers = useMemo(
  () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
  [users]
);

const filteredItems = useMemo(
  () => items.filter(item => item.category === selectedCategory),
  [items, selectedCategory]
);

// ❌ Don't useMemo for simple operations
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);
// ✅ Just do: const fullName = `${firstName} ${lastName}`;
```

### useCallback — stable function references
```tsx
// ✅ Use when: function is passed as a prop to a memoized child
const handleDelete = useCallback((id: string): void => {
  deleteUser(id);
}, [deleteUser]);

// ✅ Use when: function is a useEffect dependency
const fetchData = useCallback(async (): Promise<void> => {
  const data = await userService.getAll();
  setUsers(data);
}, []); // no deps = stable reference

useEffect(() => { void fetchData(); }, [fetchData]);
```

---

## RULE 3 — IMAGE OPTIMIZATION

Every `<img>` must follow this pattern:

```tsx
// ✅ Above-fold hero image
<img
  src="/images/hero.webp"
  alt="Hero description"
  width={1200}
  height={600}
  fetchPriority="high"     // tells browser to load this first
  decoding="async"
/>

// ✅ Below-fold images
<img
  src="/images/product.webp"
  alt="Product name"
  width={400}
  height={300}
  loading="lazy"           // defer loading until near viewport
  decoding="async"
/>

// ✅ Responsive images
<img
  srcSet="/images/hero-400.webp 400w, /images/hero-800.webp 800w, /images/hero-1200.webp 1200w"
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  src="/images/hero-1200.webp"
  alt="Hero"
  width={1200}
  height={600}
/>
```

Rules:
- Always specify `width` and `height` — prevents CLS.
- Always use WebP format — convert PNG/JPG before adding to project.
- Always `loading="lazy"` for below-fold images.
- Always `fetchPriority="high"` for the LCP image only.
- Wrap images in a fixed aspect-ratio container to reserve space:
```tsx
<div className="aspect-video overflow-hidden rounded-lg">
  <img className="h-full w-full object-cover" ... />
</div>
```

---

## RULE 4 — BUNDLE SIZE

```ts
// ❌ Whole library imports
import _ from 'lodash';
import * as Icons from 'lucide-react';
import moment from 'moment';

// ✅ Named / sub-path imports
import { debounce, groupBy } from 'lodash';
import { X, Menu, ChevronDown } from 'lucide-react';
import { format, parseISO } from 'date-fns'; // prefer date-fns over moment
```

Vite config for optimal chunking:
```ts
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router':       ['react-router-dom'],
          'ui':           ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 500, // warn if chunk > 500KB
    sourcemap: false,           // disable in production
    assetsInlineLimit: 4096,    // inline assets < 4KB
  },
});
```

---

## RULE 5 — RE-RENDER PREVENTION

```tsx
// ❌ New object/array created on every render = child always re-renders
<DataTable
  columns={[{ key: 'name', label: 'Name' }]}  // new array every render
  style={{ padding: 16 }}                       // new object every render
/>

// ✅ Move stable values outside the component or useMemo
const COLUMNS: Column[] = [{ key: 'name', label: 'Name' }]; // outside component
const TABLE_STYLE: React.CSSProperties = { padding: 16 };   // outside component

// ❌ Anonymous function prop always creates new reference
<Button onClick={() => handleDelete(item.id)} />

// ✅ Stable reference with useCallback
const handleDeleteItem = useCallback(() => handleDelete(item.id), [item.id, handleDelete]);
<Button onClick={handleDeleteItem} />
```

---

## RULE 6 — FONTS

```html
<!-- index.html — preconnect before the font link -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Non-render-blocking font load -->
<link
  rel="preload"
  as="style"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  onload="this.rel='stylesheet'"
/>
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
</noscript>
```

In CSS:
```css
@font-face {
  font-display: swap; /* always — prevents invisible text */
}
```

---

## RULE 7 — RENDER-BLOCKING RESOURCES

```html
<!-- index.html -->
<!-- ✅ Scripts at bottom or with defer -->
<script type="module" src="/src/main.tsx"></script>  <!-- Vite handles this -->

<!-- ✅ Third-party scripts — always defer -->
<script defer src="https://analytics.example.com/script.js"></script>

<!-- ❌ Never synchronous scripts in <head> -->
<script src="some-library.js"></script>
```
