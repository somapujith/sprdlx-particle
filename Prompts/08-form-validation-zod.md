# Prompt 08 — Form Validation with Zod
# Category: Data & State — Forms
# Stack: React + TypeScript + Zod + react-hook-form

Every form in this project has ad-hoc manual validation scattered across
components and hooks. Centralize it all with Zod + react-hook-form.

---

## INSTALL

npm install zod react-hook-form @hookform/resolvers

---

## THE STANDARD PATTERN

### Step 1 — Schema in src/schemas/[feature].schema.ts
```ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
export type RegisterFormData = z.infer<typeof registerSchema>;
```

### Step 2 — Form uses react-hook-form + zod resolver
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/schemas/login.schema';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      await authService.login(data);
    } catch (err) {
      setError('root', { message: err instanceof Error ? err.message : 'Login failed' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
      <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
      {errors.root && <p role="alert" className="text-sm text-danger">{errors.root.message}</p>}
      <Button type="submit" isLoading={isSubmitting}>Sign in</Button>
    </form>
  );
}
```

### Step 3 — Same schema validates on the backend
```ts
// server/src/middleware/validate.middleware.ts
import { z } from 'zod';

export const validate = (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
        data: null,
      });
      return;
    }
    req.body = result.data; // replace with parsed + typed + stripped data
    next();
  };

// Usage in route:
userRouter.post('/', validate(createUserSchema), userController.create);
```

---

## MIGRATION CHECKLIST

1. Find every form in the codebase.
2. Create a schema file for each in src/schemas/.
3. Replace manual validation with zodResolver.
4. Remove all manual validation from hooks and components.
5. Add the same schema to the corresponding backend route.
6. Create shared schemas in a shared package if monorepo,
   or duplicate to server/src/schemas/ if not.

---

## COMMON SCHEMA PATTERNS

```ts
// Required string
z.string().min(1, 'This field is required')

// Optional string
z.string().optional()
z.string().or(z.literal('')).optional()

// Email
z.string().email('Enter a valid email')

// URL
z.string().url('Enter a valid URL')

// Phone
z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Enter a valid phone number')

// Positive number
z.number().positive('Must be a positive number')

// Integer
z.number().int('Must be a whole number')

// Enum
z.enum(['admin', 'user', 'viewer'])

// Date string
z.string().datetime('Enter a valid date')

// File
z.instanceof(File).refine(f => f.size < 5_000_000, 'File must be under 5MB')
```

---

## DELIVERY

List every form found. Deliver all schema files + updated form components.
Zero manual validation logic should remain in any component or hook.
