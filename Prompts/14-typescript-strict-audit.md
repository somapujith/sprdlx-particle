# Prompt 14 — TypeScript Strict Audit
# Category: Performance & Quality — Type Safety
# Stack: TypeScript (strict mode)

Audit this entire codebase for TypeScript violations and enforce strict typing.

---

## TSCONFIG REQUIREMENTS

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true
  }
}
```

Run tsc --noEmit. Fix every error before proceeding.

---

## VIOLATIONS TO FIND AND FIX

### any — BANNED. Zero exceptions.
```ts
// ❌ All of these are violations
function process(data: any) {}
const result: any = fetchData();
const items = [] as any[];
// @ts-ignore (without explanation)

// ✅ Correct alternatives
function process(data: unknown) {}  // if type is truly unknown
function process<T>(data: T) {}    // if type is parameterized
const result: User[] = fetchData(); // if type is known
```

### Untyped event handlers
```ts
// ❌
const handleChange = (e: any) => setValue(e.target.value);

// ✅
const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  setValue(e.target.value);
};
```

### Untyped API responses
```ts
// ❌
const { data } = await api.get('/users');

// ✅
const { data } = await api.get<User[]>('/users');
```

### Untyped useState
```ts
// ❌
const [user, setUser] = useState(null);
const [items, setItems] = useState([]);

// ✅
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<Item[]>([]);
```

### Non-null assertions without justification
```ts
// ❌ — may crash at runtime
const name = user!.name;

// ✅ — guard first
if (!user) return null;
const name = user.name;
```

### Type casting hiding errors
```ts
// ❌
const user = response as User; // no runtime check

// ✅ — type guard
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value;
}
```

### Unknown error type in catch
```ts
// ❌
} catch (err) {
  setError(err.message); // err is unknown, crashes

// ✅
} catch (err) {
  setError(err instanceof Error ? err.message : 'An error occurred');
}
```

### Missing return types on functions
```ts
// ❌
async function fetchUser(id: string) {
  return userService.getById(id);
}

// ✅
async function fetchUser(id: string): Promise<User> {
  return userService.getById(id);
}
```

---

## USEFUL UTILITY TYPES — USE THESE

```ts
// Partial — all fields optional (update DTOs)
type UpdateUserDto = Partial<Pick<User, 'name' | 'email'>>;

// Required — all fields required
type RequiredConfig = Required<Config>;

// Readonly — prevent mutation
type ImmutableUser = Readonly<User>;

// Pick — subset
type UserPreview = Pick<User, 'id' | 'name' | 'avatar'>;

// Omit — exclude fields
type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// Record — typed map
type FeatureFlags = Record<string, boolean>;

// NonNullable — strip null/undefined
type ValidUser = NonNullable<User | null | undefined>;

// ReturnType — infer from function
type ServiceResult = Awaited<ReturnType<typeof userService.getAll>>;
```

---

## DELIVERY

Run tsc --noEmit before and after.
BEFORE: [X type errors]
AFTER: 0 type errors

List every file changed with what was fixed.
