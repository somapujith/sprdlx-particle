# Skill: State Manager
# Agent: FRONTEND — any state-related decision
# Stack: React + TypeScript (Context for shared state, Zustand if complex)

---

## STATE PLACEMENT DECISION TREE

Ask these questions in order:

```
Is the state only used in ONE component?
  → YES → useState inside that component
  → NO  ↓

Is it server data (from an API)?
  → YES → Custom hook (useFeature.ts) with loading/error/data
  → NO  ↓

Is it used by 2-4 closely related components?
  → YES → React Context (src/context/FeatureContext.tsx)
  → NO  ↓

Is it complex, cross-cutting, or needs async actions?
  → YES → Zustand store (src/store/featureStore.ts)
```

---

## RULE 1 — LOCAL STATE (useState)

Use for: open/closed toggles, form input values, active tab, hover states.

```ts
// ✅ Correct — local UI state
const [isOpen, setIsOpen] = useState(false);
const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
const [inputValue, setInputValue] = useState('');

// ❌ Wrong — these don't belong in local state
const [currentUser, setCurrentUser] = useState<User | null>(null); // → Context
const [products, setProducts] = useState<Product[]>([]);           // → hook + service
```

---

## RULE 2 — SERVER STATE (custom hook)

Use for: anything fetched from an API.
Never store API data in Context or Zustand — hooks handle it.

```ts
// src/hooks/useProducts.ts
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ... fetch logic

  return { products, isLoading, error, refetch };
}

// Component consumes:
const { products, isLoading, error } = useProducts();
```

---

## RULE 3 — SHARED STATE (Context)

Use for: auth state, theme, locale, user preferences, cart.
Keep Context lean — no business logic, no API calls inside the provider.

```tsx
// src/context/AuthContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '@types/user.types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User, token: string): void => {
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — always export this, never export the raw Context
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

Context rules:
- Always throw an error in the consumer hook if context is null.
- Never put API calls directly inside a Context provider.
- Never export the raw `Context` object — only the hook.
- Wrap only the parts of the tree that need the context.

---

## RULE 4 — COMPLEX GLOBAL STATE (Zustand)

Use for: shopping cart, notifications, complex UI state shared app-wide,
multi-step wizard state, real-time data.

```ts
// src/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@types/cart.types';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(i => i.productId === product.id);
          const items = existing
            ? state.items.map(i =>
                i.productId === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              )
            : [...state.items, { productId: product.id, product, quantity }];
          return {
            items,
            totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const items = state.items.filter(i => i.productId !== productId);
          return {
            items,
            totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map(i =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    { name: 'cart-storage' }
  )
);
```

Zustand rules:
- One store per feature domain.
- Compute derived values (totalItems, totalPrice) inside the setter, not the selector.
- Use `persist` middleware only for data that should survive page refresh.
- Never put API calls inside a Zustand store — call service from a hook, then update store.

---

## ANTI-PATTERNS — NEVER DO THESE

```ts
// ❌ Prop drilling 3+ levels deep
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <Avatar user={user} />   // ← use Context instead

// ❌ Duplicate state
const [count, setCount] = useState(0);
const [doubleCount, setDoubleCount] = useState(0); // ← derive it: count * 2

// ❌ Derived state in useState
const [fullName, setFullName] = useState(`${firstName} ${lastName}`);
// ✅ Correct: const fullName = `${firstName} ${lastName}`;

// ❌ State that belongs in a URL
const [currentPage, setCurrentPage] = useState(1);
// ✅ Correct: use URL search params: /products?page=2

// ❌ Storing whole API response in global state
useEffect(() => {
  fetch('/api/users').then(r => r.json()).then(data => {
    dispatch(setUsers(data)); // ← this is server state, not app state
  });
}, []);
// ✅ Correct: use a custom hook with useState inside
```
