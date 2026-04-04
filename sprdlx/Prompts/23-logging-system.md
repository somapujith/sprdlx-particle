# Prompt 23 — Logging System
# Category: Runtime & Monitoring
# Stack: Node.js + Express + TypeScript

Replace all console.log calls with a structured, leveled logger.
Good logs are searchable, filterable, and machine-readable.

---

## INSTALL

npm install winston
npm install --save-dev @types/winston

---

## server/src/utils/logger.ts

```ts
import winston from 'winston';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

const isDev = process.env.NODE_ENV === 'development';

// Human-readable format for development
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} [${level}] ${message}${stack ? `\n${stack}` : ''}${metaStr}`;
  })
);

// Machine-readable JSON for production (Datadog, CloudWatch, etc.)
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  format: isDev ? devFormat : prodFormat,
  transports: [
    new winston.transports.Console(),
    // Add file transport in production:
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Convenience methods
export const log = {
  debug: (message: string, meta?: object) => logger.debug(message, meta),
  info: (message: string, meta?: object) => logger.info(message, meta),
  warn: (message: string, meta?: object) => logger.warn(message, meta),
  error: (message: string, error?: Error | unknown, meta?: object) => {
    if (error instanceof Error) {
      logger.error(message, { error: error.message, stack: error.stack, ...meta });
    } else {
      logger.error(message, { error, ...meta });
    }
  },
};
```

---

## REQUEST LOGGING MIDDLEWARE

```ts
// server/src/middleware/requestLogger.middleware.ts
import { type Request, type Response, type NextFunction } from 'express';
import { log } from '../utils/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    log[level](`${req.method} ${req.path}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: (req as any).user?.id,
    });
  });

  next();
}
```

Apply in app.ts BEFORE routes:
```ts
app.use(requestLogger);
```

---

## REPLACE ALL console.log / console.error

Find every:
- console.log(...)  → log.debug(...) or log.info(...)
- console.warn(...) → log.warn(...)
- console.error(...)→ log.error(...)

In controllers/services, add context:
```ts
// ❌ Before
console.log('User created:', user.id);
console.error('Failed to send email:', err);

// ✅ After
log.info('User created', { userId: user.id, email: user.email });
log.error('Failed to send email', err, { userId: user.id });
```

---

## FRONTEND — GATE BEHIND DEV FLAG

Replace all console.log in React code:
```ts
// src/utils/logger.ts (frontend)
const isDev = import.meta.env.DEV;

export const clientLog = {
  debug: (...args: unknown[]) => { if (isDev) console.debug(...args); },
  info:  (...args: unknown[]) => { if (isDev) console.info(...args);  },
  warn:  (...args: unknown[]) => { if (isDev) console.warn(...args);  },
  error: (...args: unknown[]) => { console.error(...args); }, // always log errors
};
```

---

## LOG LEVELS GUIDE

| Level | Use for |
|---|---|
| debug | Dev-only detail (query params, response bodies) |
| info | Normal operations (request completed, user created) |
| warn | Unexpected but handled (rate limit hit, deprecated usage) |
| error | Failures that need attention (DB error, unhandled exception) |

---

## DELIVERY

1. server/src/utils/logger.ts — full implementation
2. server/src/middleware/requestLogger.middleware.ts
3. src/utils/logger.ts — frontend version
4. Every console.log/error in server code replaced
5. Every console.log in React code gated behind DEV flag
6. app.ts updated to use requestLogger middleware
