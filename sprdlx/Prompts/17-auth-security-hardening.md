# Prompt 17 — Auth + Security Hardening
# Category: Security & Backend
# Stack: Node.js + Express + TypeScript + JWT

Audit this Express + React project for every common vulnerability and fix all of them.

---

## AUTH ISSUES

### JWT in localStorage → move to httpOnly cookies
```ts
// ❌ Wrong — localStorage is XSS-vulnerable
localStorage.setItem('token', jwt);

// ✅ Set httpOnly cookie from the server
res.cookie('token', jwt, {
  httpOnly: true,     // JS cannot access this
  secure: true,       // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

### Add refresh token flow
- Access token: 15 minutes expiry
- Refresh token: 7 days, stored in httpOnly cookie
- POST /auth/refresh endpoint exchanges refresh token for new access token
- POST /auth/logout clears both cookies

### Password hashing
- Use bcrypt with cost factor ≥ 12
- Never store plain text passwords
- Never log passwords, never include in responses

```ts
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12);
const valid = await bcrypt.compare(password, hash);
```

---

## XSS PREVENTION

### Frontend
- Never use dangerouslySetInnerHTML
  → If unavoidable: npm install dompurify && sanitize first
- All user-generated content rendered as text (React does this by default in JSX)
- No eval() or new Function() with user input anywhere

### Backend Content-Security-Policy header
```ts
// In helmet config:
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
})
```

---

## CSRF PREVENTION

If using httpOnly cookies for auth, add CSRF protection:
```ts
npm install csurf
app.use(csrf({ cookie: true }));

// Frontend must include CSRF token in state-changing requests
// GET /api/csrf-token → returns token
// All POST/PUT/DELETE requests include: X-CSRF-Token header
```

---

## INPUT VALIDATION

Every route that accepts body data must validate with Zod:
```ts
// See prompt 08 for full Zod middleware
// Every POST/PUT/PATCH route needs: validate(schema) middleware
userRouter.post('/', authenticate, validate(createUserSchema), userController.create);
```

Never trust req.body directly. Always strip unknown fields (Zod does this with .strict() or .strip()).

---

## INJECTION PREVENTION

- All DB queries must use parameterized queries or ORM methods
- Never concatenate user input into query strings
- File uploads: validate type, size, extension — never execute uploaded files
- No eval(), no require() with user input

---

## SECURITY HEADERS (use helmet.js)

```ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: false, // may break some integrations
  hsts: { maxAge: 31536000, includeSubDomains: true },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
}));
```

---

## DEPENDENCY AUDIT

Run: npm audit --audit-level=high
Fix all HIGH + CRITICAL vulnerabilities: npm audit fix
For breaking changes: npm audit fix --force (test thoroughly after)

---

## DELIVERY

SECURITY REPORT:
  CRITICAL: [list each vulnerability and fix applied]
  HIGH: [list each]
  MEDIUM: [list each — fixed if code change, noted if dependency]

Full updated files for every security change.
Zero HIGH or CRITICAL vulnerabilities in npm audit after.
