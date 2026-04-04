# Prompt 24 — Error Monitoring (Sentry)
# Category: Runtime & Monitoring
# Stack: React + Vite + TypeScript + Node/Express

Set up Sentry for both frontend and backend so production errors
are captured, grouped, and alertable — not silently swallowed.

---

## INSTALL

# Frontend
npm install @sentry/react

# Backend
npm install @sentry/node @sentry/profiling-node

---

## FRONTEND SETUP

### src/main.tsx — Initialize before React renders
```tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,        // 'development' | 'production'
  enabled: import.meta.env.PROD,            // only in production
  tracesSampleRate: 0.1,                    // 10% of transactions
  replaysOnErrorSampleRate: 1.0,            // 100% of errors get replay
  replaysSessionSampleRate: 0.05,           // 5% of sessions
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,     // privacy: mask text in replays
      blockAllMedia: false,
    }),
  ],
});
```

### Wrap App with Sentry Error Boundary
```tsx
// src/main.tsx
const FallbackComponent = ({ error, resetError }: { error: Error; resetError: () => void }) => (
  <div role="alert" className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
    <h1 className="text-2xl font-semibold">Something went wrong</h1>
    <p className="text-neutral-600">{error.message}</p>
    <button onClick={resetError} className="rounded-md bg-primary-500 px-4 py-2 text-white">
      Try again
    </button>
  </div>
);

root.render(
  <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
    <App />
  </Sentry.ErrorBoundary>
);
```

### Capture errors manually
```ts
// In catch blocks:
import * as Sentry from '@sentry/react';

try {
  await riskyOperation();
} catch (err) {
  Sentry.captureException(err, {
    tags: { feature: 'checkout' },
    extra: { userId: user.id, orderId },
  });
  toast.error('Payment failed. Our team has been notified.');
}
```

### Set user context on login
```ts
import * as Sentry from '@sentry/react';

// After successful login:
Sentry.setUser({ id: user.id, email: user.email, username: user.name });

// After logout:
Sentry.setUser(null);
```

---

## BACKEND SETUP

### server/src/instrument.ts — Must be imported FIRST
```ts
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
  integrations: [nodeProfilingIntegration()],
});
```

### server/src/server.ts — Import instrument.ts first
```ts
import './instrument'; // MUST be first import
import { app } from './app';
// ... rest of server setup
```

### Error middleware — report to Sentry
```ts
// server/src/middleware/error.middleware.ts
import * as Sentry from '@sentry/node';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Report unexpected errors to Sentry
  if (!(err instanceof AppError) || err.statusCode >= 500) {
    Sentry.captureException(err, {
      user: { id: (req as any).user?.id },
      tags: { path: req.path, method: req.method },
    });
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message, data: null });
    return;
  }

  res.status(500).json({ success: false, message: 'An internal error occurred', data: null });
}
```

---

## ENVIRONMENT VARIABLES

```
# .env.example
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=your-auth-token  # for source map upload
```

---

## SOURCE MAPS (so Sentry shows real code, not minified)

```ts
// vite.config.ts
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: 'your-org',
      project: 'your-project',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  build: {
    sourcemap: true, // enable for Sentry, but hide from browser
  },
});
```

---

## ALERTS TO SET UP IN SENTRY DASHBOARD

1. New issue alert: email on first occurrence of any new error
2. Regression alert: email when a resolved error reappears
3. Error spike alert: email when errors exceed 10/min
4. Performance alert: email when P95 latency > 3s

---

## DELIVERY

1. src/main.tsx updated with Sentry init + error boundary
2. server/src/instrument.ts created
3. server/src/server.ts imports instrument.ts first
4. Error middleware updated to capture to Sentry
5. .env.example updated with Sentry DSN variables
6. vite.config.ts updated with source map + Sentry plugin
