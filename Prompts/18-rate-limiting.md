# Prompt 18 — Rate Limiting + API Abuse Protection
# Category: Security & Backend
# Stack: Node.js + Express + TypeScript

Protect this API from abuse, brute force, and DOS attacks.

---

## INSTALL

npm install express-rate-limit express-slow-down

---

## LIMITERS TO IMPLEMENT

### 1. Global limiter — all API routes
```ts
import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                   // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    data: null,
  },
  skip: (req) => req.ip === '127.0.0.1', // skip in development
});

app.use('/api', globalLimiter);
```

### 2. Auth limiter — stricter for login/register
```ts
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait 15 minutes.',
    data: null,
  },
});

app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);
app.use('/api/v1/auth/forgot-password', authLimiter);
```

### 3. File upload limiter
```ts
export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { success: false, message: 'Upload limit reached. Please wait.', data: null },
});
```

### 4. Slow down repeat offenders
```ts
import slowDown from 'express-slow-down';

export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,        // start slowing after 50 requests
  delayMs: () => 500,    // add 500ms delay per request after limit
});

app.use('/api', speedLimiter);
```

---

## REQUEST SIZE LIMITS

```ts
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
```

---

## ACCOUNT LOCKOUT (for auth routes)

```ts
// Track failed login attempts per email/IP
// In userService:
async login(email: string, password: string) {
  const user = await User.findOne({ email });

  if (user?.lockUntil && user.lockUntil > Date.now()) {
    const mins = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw new AppError(`Account locked. Try again in ${mins} minutes.`, 423);
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    if (user) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = Date.now() + 30 * 60 * 1000; // lock 30 min
      }
      await user.save();
    }
    throw new UnauthorizedError('Invalid email or password');
  }

  // Reset on successful login
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();
}
```

---

## LOGGING RATE LIMIT HITS

```ts
// Custom handler to log limit hits
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    logger.warn(`Rate limit hit: ${req.ip} → ${req.path}`);
    res.status(429).json({
      success: false,
      message: 'Too many attempts.',
      data: null,
    });
  },
});
```

---

## APPLY TO ALL SENSITIVE ROUTES

Find every route that:
- Triggers an email send
- Processes a payment
- Creates a user/account
- Accepts file uploads
- Accepts password resets
→ Apply the appropriate limiter

---

## DELIVERY

List every route a limiter was applied to.
Deliver updated app.ts and all affected route files.
