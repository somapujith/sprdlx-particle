# Prompt 12 — Performance Audit
# Category: Performance & Quality
# Stack: React + Vite + TypeScript

Audit this React project for performance problems and fix them all.

---

## RULE 1 — CODE SPLITTING (mandatory for all routes)

```tsx
// src/routes/index.tsx — ALL page imports must be lazy
const Home      = lazy(() => import('@pages/Home'));
const Dashboard = lazy(() => import('@pages/Dashboard'));
const NotFound  = lazy(() => import('@pages/NotFound'));

<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/" element={<Home />} />
    ...
  </Routes>
</Suspense>
```

Also lazy-load:
- Modals not shown on first load
- Charts and data visualization components
- Rich text editors
- Map embeds

---

## RULE 2 — RE-RENDERS

Find components that re-render on every parent render despite same props:
→ Wrap in React.memo()

Find expensive calculations in render body:
→ Wrap in useMemo()

Find functions recreated on every render and passed as props:
→ Wrap in useCallback()

Find useEffect hooks with missing or wrong dependency arrays:
→ Fix dependencies or use useCallback for stable references

---

## RULE 3 — MEMOIZATION EXAMPLES

```tsx
// React.memo — pure components with expensive renders
export const UserCard = React.memo(function UserCard({ user }: UserCardProps) {
  return <div>{user.name}</div>;
});

// useMemo — expensive computation
const sortedUsers = useMemo(
  () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
  [users]
);

// useCallback — stable function for memoized children
const handleDelete = useCallback((id: string): void => {
  deleteUser(id);
}, [deleteUser]);
```

Don't over-memo — only memo components where re-renders cause measurable slowness.

---

## RULE 4 — IMAGES

Every <img> must have:
- width and height attributes (prevents CLS)
- loading="lazy" for below-fold images
- fetchPriority="high" for the LCP (hero) image ONLY
- decoding="async"
- WebP format (flag non-WebP images for manual conversion)

Fixed aspect ratio containers:
```tsx
<div className="aspect-video overflow-hidden rounded-lg">
  <img className="h-full w-full object-cover" ... />
</div>
```

---

## RULE 5 — BUNDLE SIZE

```ts
// ❌ Whole library imports
import _ from 'lodash';
import * as Icons from 'lucide-react';

// ✅ Named imports
import { debounce, groupBy } from 'lodash';
import { X, Menu, ChevronDown } from 'lucide-react';
import { format } from 'date-fns'; // prefer date-fns over moment
```

Vite manual chunks in vite.config.ts:
```ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'router': ['react-router-dom'],
        'ui': ['lucide-react'],
      },
    },
  },
  chunkSizeWarningLimit: 500,
  sourcemap: false,
}
```

---

## RULE 6 — LISTS

Find .map() rendering lists with more than 100 items:
→ Add pagination OR recommend react-virtual / react-window

Find lists missing key props:
→ Add key={item.id} (never use array index as key for reorderable lists)

---

## RULE 7 — OBJECT/ARRAY PROPS

```tsx
// ❌ New reference every render — child always re-renders
<DataTable columns={[{ key: 'name' }]} style={{ padding: 16 }} />

// ✅ Stable references
const COLUMNS: Column[] = [{ key: 'name' }]; // outside component
const TABLE_STYLE: React.CSSProperties = { padding: 16 }; // outside component
```

---

## DELIVERY

Report:
  FIXED: [component] — [what was fixed]
  FLAG (manual): [image files] — need WebP conversion
  RECOMMENDATION: [component] — needs virtualization (install react-window)

Deliver full updated files.
