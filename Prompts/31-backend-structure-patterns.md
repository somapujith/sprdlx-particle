# Prompt 31 — Backend Structure + Patterns
# Category: Security & Backend
# Stack: Node.js + Express + TypeScript

Audit and restructure the Express backend following professional patterns.
Thin controllers. Rich services. Consistent responses. Proper middleware stack.

---

## CANONICAL BACKEND STRUCTURE

```
server/src/
├── app.ts              ← Express setup only (middleware, routes mount)
├── server.ts           ← HTTP server (port binding only)
├── routes/
│   ├── index.ts        ← mounts all routers on /api/v1
│   └── [feature].routes.ts
├── controllers/        ← request handlers (thin — delegate to services)
├── services/           ← ALL business logic
├── middleware/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── validate.middleware.ts
│   ├── cache.middleware.ts
│   └── requestLogger.middleware.ts
├── models/             ← DB schemas/models
├── config/
│   ├── db.ts
│   ├── env.ts          ← validates required env vars on startup
│   └── swagger.ts
└── utils/
    ├── response.ts     ← standardized response helpers
    ├── errors.ts       ← custom error classes
    └── logger.ts
```

---

## app.ts STANDARD SETUP

```ts
import 'express-async-errors'; // handles async errors without try/catch
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { apiRouter } from './routes';
import { requestLogger } from './middleware/requestLogger.middleware';
import { errorHandler, notFound } from './middleware/error.middleware';

export const app = express();

// 1. Security headers
app.use(helmet());

// 2. CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// 3. Compression + parsing
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 4. Request logging
app.use(requestLogger);

// 5. Routes
app.use('/api/v1', apiRouter);

// 6. Error handling — MUST be last
app.use(notFound);
app.use(errorHandler);
```

---

## CONTROLLER PATTERN (thin)

Controllers only: extract params → call service → send response.
NO business logic in controllers.

```ts
export const userController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search } = req.query;
      const result = await userService.getAll({
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 20,
        search: search as string,
      });
      paginatedResponse(res, result.users, result.total, result.page, result.limit);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.create(req.body);
      createdResponse(res, user, 'User created successfully');
    } catch (error) {
      next(error);
    }
  },
};
```

---

## SERVICE PATTERN (business logic)

```ts
export const userService = {
  async getAll({ page, limit, search }: GetUsersOptions) {
    const query = search
      ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] }
      : {};

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).select('-password').skip(skip).limit(limit).lean(),
      User.countDocuments(query),
    ]);

    return { users, total, page, limit };
  },

  async getById(id: string) {
    const user = await User.findById(id).select('-password').lean();
    if (!user) throw new NotFoundError('User not found');
    return user;
  },

  async create(dto: CreateUserDto) {
    const exists = await User.findOne({ email: dto.email });
    if (exists) throw new ConflictError('Email already registered');
    const hashed = await bcrypt.hash(dto.password, 12);
    const user = await User.create({ ...dto, password: hashed });
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  },
};
```

---

## ENVIRONMENT VALIDATION ON STARTUP

```ts
// server/src/config/env.ts
const required = [
  'NODE_ENV',
  'DATABASE_URL',
  'JWT_SECRET',
  'CLIENT_URL',
];

export function validateEnv(): void {
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters');
    process.exit(1);
  }
}
```

Call in server.ts before anything else:
```ts
import { validateEnv } from './config/env';
validateEnv(); // exits process if env is invalid
```

---

## STANDARDIZED RESPONSE FORMAT

Every endpoint returns:
```json
{ "success": true, "message": "Users retrieved", "data": [...] }
```

Paginated:
```json
{
  "success": true, "message": "Users retrieved",
  "data": [...],
  "pagination": { "total": 100, "page": 1, "limit": 20, "totalPages": 5 }
}
```

---

## AUDIT CHECKLIST

- [ ] app.ts uses the standard middleware stack in the correct order
- [ ] All routes follow controller → service pattern
- [ ] No business logic in controllers
- [ ] No DB calls in route files
- [ ] All errors use custom error classes and are passed to next()
- [ ] All routes validated with Zod schemas
- [ ] All auth routes protected with authenticate middleware
- [ ] validateEnv() called on startup
- [ ] No process.env access outside of config files

---

## DELIVERY

Refactor every controller and service to match the patterns above.
Deliver full updated files. No mixed-layer violations remaining.
