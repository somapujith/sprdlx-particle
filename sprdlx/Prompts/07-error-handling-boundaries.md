# Prompt 07 — Error Handling + Boundaries
# Category: Data & State — Reliability
# Stack: React + TypeScript + Express

You are a reliability engineer. Add a complete error boundary and notification system.

---

## FRONTEND

### 1. Global Error Boundary
Create src/components/common/GlobalErrorBoundary.tsx:

```tsx
import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class GlobalErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[GlobalErrorBoundary]', error, info);
    // Replace with: Sentry.captureException(error, { extra: info });
  }

  handleReset = (): void => this.setState({ hasError: false, error: null });

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div role="alert" className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
          <h1 className="text-2xl font-semibold text-neutral-900">Something went wrong</h1>
          <p className="text-neutral-600">{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button
            type="button"
            onClick={this.handleReset}
            className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

Wrap in main.tsx:
```tsx
<GlobalErrorBoundary>
  <App />
</GlobalErrorBoundary>
```

### 2. Route-level Error Boundary
Create src/components/common/RouteErrorBoundary.tsx:
Same pattern but renders an inline error state (not full page).
Wrap each <Route> element in AppRoutes.

### 3. ErrorState Component
Create src/components/common/ErrorState.tsx:
```tsx
interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullPage?: boolean;
}
// Renders user-friendly error with optional retry button
// fullPage=true centers vertically
// role="alert" on the container
```

### 4. Toast Notification System
Create src/context/ToastContext.tsx:
```tsx
// Exposes useToast() hook
// toast.success('Saved!') → green toast, auto-dismiss 4s
// toast.error('Failed')   → red toast, stays until dismissed
// toast.info('...')       → blue toast, auto-dismiss 4s
// role="alert" aria-live="assertive" for errors
// role="status" aria-live="polite" for success/info
// Stacks multiple toasts vertically
// Max 3 toasts visible at once
```

### 5. Safe Async Utility
Create src/utils/safeAsync.ts:
```ts
export async function safeAsync<T>(
  fn: () => Promise<T>
): Promise<[T, null] | [null, Error]> {
  try {
    return [await fn(), null];
  } catch (e) {
    return [null, e instanceof Error ? e : new Error(String(e))];
  }
}

// Usage:
const [data, error] = await safeAsync(() => userService.getAll());
if (error) { toast.error(error.message); return; }
```

### 6. THREE-STATE RULE — ENFORCE EVERYWHERE

Every component rendering data from an API MUST:
```tsx
if (isLoading) return <Spinner />;
if (error) return <ErrorState message={error.message} onRetry={refetch} />;
if (!data || data.length === 0) return <EmptyState message="No items found" />;
return <DataList items={data} />;
```

Scan every component and section — add missing states.

---

## BACKEND

Every async controller MUST:
```ts
async function getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await userService.getAll();
    successResponse(res, users);
  } catch (error) {
    next(error); // always — never res.json(error)
  }
}
```

Global error middleware must be the LAST middleware registered.
Never expose stack traces to clients in production.

---

## DELIVERY

Deliver all files complete and wired into App.tsx and main.tsx.
Every file: 100% complete, no placeholders.
