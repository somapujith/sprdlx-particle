# Prompt 26 — Caching Strategy
# Category: Runtime & Monitoring
# Stack: Node.js + Express + TypeScript

Add caching at the right layers to reduce DB load and improve response times.

---

## LAYER 1 — HTTP CACHE HEADERS (zero infrastructure cost)

Add Cache-Control headers to Express responses for static/slow-changing data:

```ts
// server/src/middleware/cache.middleware.ts
import type { Request, Response, NextFunction } from 'express';

export function cacheFor(seconds: number) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.set('Cache-Control', `public, max-age=${seconds}, stale-while-revalidate=${seconds * 2}`);
    next();
  };
}

export function noCache(_req: Request, res: Response, next: NextFunction): void {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  next();
}

// Usage:
router.get('/products',       cacheFor(300),  productController.getAll);  // 5 min cache
router.get('/categories',     cacheFor(3600), categoryController.getAll); // 1 hour cache
router.get('/user/profile',   noCache,        userController.getProfile);  // never cache
router.post('/orders',        noCache,        orderController.create);     // never cache mutations
```

**When to cache:**
- Read-heavy, rarely-changing data: product catalog, categories, config
- Public data: blog posts, docs, FAQs
- Aggregations: stats, counts, summaries updated hourly

**Never cache:**
- Auth endpoints
- User-specific data
- POST/PUT/PATCH/DELETE responses
- Real-time data

---

## LAYER 2 — IN-MEMORY CACHE (no Redis needed for simple cases)

```ts
// server/src/utils/memoryCache.ts
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, value: T, ttlSeconds: number): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  deletePattern(pattern: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(pattern)) this.store.delete(key);
    }
  }

  clear(): void {
    this.store.clear();
  }
}

export const cache = new MemoryCache();
```

Usage in services:
```ts
// server/src/services/categoryService.ts
import { cache } from '../utils/memoryCache';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const cacheKey = 'categories:all';
    const cached = cache.get<Category[]>(cacheKey);
    if (cached) return cached;

    const categories = await Category.find().lean();
    cache.set(cacheKey, categories, 3600); // cache 1 hour
    return categories;
  },

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = await Category.create(dto);
    cache.delete('categories:all'); // invalidate on mutation
    return category;
  },
};
```

---

## LAYER 3 — FRONTEND QUERY CACHING (with React Query / TanStack)

If not already using React Query, add it for automatic client-side caching:

```ts
npm install @tanstack/react-query
```

```tsx
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 min before refetch
      gcTime: 10 * 60 * 1000,     // 10 min in cache
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

Replace custom hooks with useQuery:
```ts
// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { productService } from '@services/productService';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

// Mutations with automatic cache invalidation
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
```

---

## WHAT TO CACHE — DECISION GUIDE

| Data | Strategy | TTL |
|---|---|---|
| Static assets (JS, CSS, images) | HTTP Cache-Control immutable | 1 year |
| Product catalog | Memory cache + HTTP | 5 min |
| Category list | Memory cache + HTTP | 1 hour |
| User profile | React Query | 5 min |
| Dashboard stats | React Query | 1 min |
| User-specific data | React Query, no server cache | 30 sec |
| Real-time data | No cache | 0 |

---

## DELIVERY

1. server/src/middleware/cache.middleware.ts
2. server/src/utils/memoryCache.ts
3. Apply cacheFor middleware to all read endpoints for public/slow-changing data
4. Wrap service methods for heavily-read data with memory cache
5. If React Query adopted: update hooks to use useQuery/useMutation
