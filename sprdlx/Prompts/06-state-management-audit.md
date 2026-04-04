# Prompt 06 — State Management Audit
# Category: Data & State
# Stack: React + TypeScript (useState → Context → Zustand)

Audit the state management of this codebase and fix all anti-patterns.

---

## STATE PLACEMENT DECISION TREE

Ask these questions in order:

Is the state only used in ONE component?
  → YES → useState inside that component
  → NO  ↓

Is it server data (from an API)?
  → YES → Custom hook with loading/error/data
  → NO  ↓

Is it used by 2-4 closely related components?
  → YES → React Context (src/context/FeatureContext.tsx)
  → NO  ↓

Is it complex, cross-cutting, or needs async actions?
  → YES → Zustand store (src/store/featureStore.ts)

---

## FIND AND FIX PROP DRILLING

Props passed through 3+ levels without being used in between:
→ Lift to a shared context or store, consume directly where needed.

## FIND AND FIX DUPLICATED STATE

Same piece of data stored in useState in two different components:
→ Single source of truth — lift to shared context or store.

## FIND MISSING GLOBAL STATE

- Auth/user info in local useState → should be AuthContext
- Theme/locale in a component → should be global
- Cart, session, notifications → should be in store/context

## FIND OVER-USED GLOBAL STATE

Things in a global store used only in one component:
→ Move back to local useState.

## FIND DERIVED STATE STORED IN STATE

```ts
// ❌ Wrong — derived state
const [count, setCount] = useState(0);
const [doubleCount, setDoubleCount] = useState(0);

// ✅ Correct — compute it
const doubleCount = count * 2;
```

---

## CONTEXT PATTERN

```tsx
// src/context/AuthContext.tsx
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

// Always export a typed hook — never the raw Context
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

---

## ZUSTAND PATTERN

```ts
// src/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  items: CartItem[];
  totalItems: number;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      addItem: (product) => set((state) => {
        const items = [...state.items, { ...product, quantity: 1 }];
        return { items, totalItems: items.length };
      }),
      removeItem: (id) => set((state) => {
        const items = state.items.filter(i => i.id !== id);
        return { items, totalItems: items.length };
      }),
      clearCart: () => set({ items: [], totalItems: 0 }),
    }),
    { name: 'cart-storage' }
  )
);
```

---

## OUTPUT

List every violation with the fix applied.
Deliver new context files, updated components, removed prop drilling.
