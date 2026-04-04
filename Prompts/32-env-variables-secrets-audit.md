# Prompt 32 — Environment Variables + Secrets Audit
# Category: Security & Backend
# Stack: React + Vite + TypeScript + Node/Express

Audit this entire codebase for hardcoded values, secrets, and missing env config.
Nothing sensitive should ever exist in source code.

---

## WHAT TO SCAN FOR

### Hardcoded URLs
- Any string containing "http://" or "https://" in source files
- Localhost ports hardcoded: localhost:3000, localhost:3001, :8080, :5432
- IP addresses hardcoded: 192.168.x.x, 127.0.0.1 (except development no-ops)

### Secrets and Keys
- API keys: patterns like sk_live_, pk_live_, AKID, apikey=
- JWT secrets or passwords in source code
- Database connection strings: mongodb+srv://, postgresql://
- Any string with "password", "secret", "token", "key" as a variable name with a hardcoded value

### Third-party Service IDs
- Stripe publishable/secret keys
- Firebase config objects
- AWS access keys
- Google client IDs
- SendGrid / Mailgun API keys
- Any analytics tracking IDs

### Feature Flags
- Boolean flags hardcoded as true/false that should be runtime-configurable

---

## FIX PATTERN — FRONTEND

```ts
// ❌ Hardcoded
const API_URL = 'http://localhost:3001/api/v1';
const STRIPE_KEY = 'pk_live_xxx';

// ✅ Environment variable
const API_URL = import.meta.env.VITE_API_BASE_URL;
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
```

All Vite env vars MUST:
- Start with VITE_ to be accessible in browser code
- Be accessed via import.meta.env.VITE_*
- Never contain secrets (they're embedded in the bundle — anyone can see them)
- Frontend secrets don't exist — if you need a secret, call a backend endpoint

---

## FIX PATTERN — BACKEND

```ts
// ❌ Hardcoded
const jwtSecret = 'my-super-secret';
mongoose.connect('mongodb://localhost:27017/mydb');

// ✅ Environment variable
const jwtSecret = process.env.JWT_SECRET!;
mongoose.connect(process.env.DATABASE_URL!);
```

Backend env access rules:
- Only access process.env in config/ files — never in services or controllers
- Use validateEnv() on startup to fail fast if any required var is missing
- Never log env vars, even in debug mode

---

## .env.example — COMPLETE TEMPLATE

Create/update .env.example with every variable the project needs:

```bash
# App
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=mongodb://localhost:27017/your-db-name

# Auth
JWT_SECRET=replace-with-at-least-32-character-random-string
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=replace-with-different-32-character-string
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CLIENT_URL=http://localhost:5173

# Email (if applicable)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-smtp-password
EMAIL_FROM=noreply@yourdomain.com

# Storage (if applicable)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name

# Monitoring
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Frontend (.env in project root)
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_APP_NAME=Your App Name
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

---

## .gitignore — ENSURE THESE ARE PRESENT

```
# Environment files — NEVER commit these
.env
.env.local
.env.development
.env.production
.env.*.local

# Secrets
*.pem
*.key
*.cert
secrets/
```

---

## RUNTIME VALIDATION

```ts
// server/src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.string().transform(Number).default('3001'),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().url(),
});

const result = envSchema.safeParse(process.env);
if (!result.success) {
  console.error('❌ Invalid environment variables:');
  console.error(result.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = result.data;
// Use env.DATABASE_URL instead of process.env.DATABASE_URL everywhere
```

---

## AUDIT REPORT FORMAT

HARDCODED VALUES FOUND:
  FILE: src/services/api.ts, LINE: 3
  VALUE: 'http://localhost:3001/api/v1'
  FIX: Moved to VITE_API_BASE_URL in .env

SECRETS FOUND:
  FILE: server/src/config/db.ts, LINE: 8
  VALUE: 'mongodb://localhost:27017/prod-db' (looks like prod URL)
  FIX: Moved to DATABASE_URL in .env

GITIGNORE STATUS:
  .env present in .gitignore: YES / NO
  .env accidentally committed: YES (need to git rm --cached .env) / NO

---

## DELIVERY

1. Every hardcoded value moved to .env / .env.example
2. Updated .env.example with all variables and descriptions
3. Updated .gitignore
4. Runtime env validation with Zod in server/src/config/env.ts
5. Frontend env validation in src/config/env.ts
6. Audit report listing every finding
