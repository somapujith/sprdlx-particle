# Skill: TypeScript Enforcer
# Agent: ALL AGENTS — applies to every .ts and .tsx file
# Stack: TypeScript (strict mode)

---

## NON-NEGOTIABLE RULES

1. `any` is BANNED. Zero exceptions. Use `unknown`, generics, or a proper interface.
2. Every function must have explicit return types.
3. Every prop interface must be defined before the component.
4. No `@ts-ignore` or `@ts-expect-error` without a comment explaining why.
5. No `as SomeType` casts unless absolutely necessary — prefer type guards.
6. No non-null assertions (`!`) unless the value is provably non-null at that point.

---

## TSCONFIG — REQUIRED SETTINGS

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

---

## TYPE PATTERNS

### Props — always explicit interface
```ts
// ✅ Correct
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

// ❌ Wrong
function Button({ label, onClick }: any) {}
function Button(props: object) {}
```

### Event handlers — always typed
```ts
// ✅ Correct
const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  setValue(e.target.value);
};
const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
  e.preventDefault();
};

// ❌ Wrong
const handleChange = (e: any) => {};
```

### API responses — always typed generics
```ts
// ✅ Correct
const { data } = await api.get<User[]>('/users');
const { data } = await api.post<User>('/users', payload);

// ❌ Wrong
const { data } = await api.get('/users'); // data is any
```

### useState — always typed when initial value is ambiguous
```ts
// ✅ Correct
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<Item[]>([]);
const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

// ❌ Wrong
const [user, setUser] = useState(null); // inferred as null
const [items, setItems] = useState([]);  // inferred as never[]
```

### useRef — always typed
```ts
// ✅ Correct
const inputRef = useRef<HTMLInputElement>(null);
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

### Unknown over any
```ts
// ✅ Correct
async function fetchData(): Promise<unknown> {
  const res = await fetch('/api/data');
  return res.json();
}

function processError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
}

// ❌ Wrong
function processError(error: any): string {
  return error.message; // runtime crash if error isn't an Error
}
```

### Type guards — prefer over casting
```ts
// ✅ Correct
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value
  );
}

// ❌ Wrong
const user = value as User; // no runtime safety
```

### Enums — use string unions instead
```ts
// ✅ Preferred — simpler, more readable in JSON
type Status = 'idle' | 'loading' | 'success' | 'error';
type Role = 'admin' | 'user' | 'viewer';

// ❌ Avoid — enums compile to verbose JS
enum Status { Idle, Loading, Success, Error }
```

### Utility types — use them
```ts
// Partial — all fields optional (update payloads)
type UpdateUserDto = Partial<User>;

// Pick — subset of fields
type UserPreview = Pick<User, 'id' | 'name' | 'avatar'>;

// Omit — all fields except
type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// Record — typed object map
type FeatureFlags = Record<string, boolean>;

// NonNullable — remove null/undefined
type RequiredUser = NonNullable<User | null>;

// ReturnType — infer from function
type UserServiceResult = ReturnType<typeof userService.getAll>;
```

---

## REACT-SPECIFIC TYPES

```ts
// Children
children: React.ReactNode          // any renderable
children: React.ReactElement       // only JSX elements

// Refs
ref: React.RefObject<HTMLDivElement>
ref: React.MutableRefObject<number | null>

// Events
onClick: React.MouseEventHandler<HTMLButtonElement>
onChange: React.ChangeEventHandler<HTMLInputElement>
onSubmit: React.FormEventHandler<HTMLFormElement>
onKeyDown: React.KeyboardEventHandler<HTMLDivElement>

// Style
className?: string                 // always optional
style?: React.CSSProperties        // use sparingly (prefer Tailwind)

// Async handlers — always void, never Promise<void> on event props
onSave: () => void                 // internally it can be async
// ✅ usage: onSave={() => { void handleSave(); }}
```

---

## FILE NAMING

| Content | Extension |
|---|---|
| React component | `.tsx` |
| Hook | `.ts` |
| Service | `.ts` |
| Utility | `.ts` |
| Type definitions | `.ts` |
| Context | `.tsx` (contains JSX) |
| Test | `.test.ts` or `.test.tsx` |
