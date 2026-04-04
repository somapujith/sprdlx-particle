# Skill: Backend Agent
# Agent: BACKEND — all Express routes, controllers, services, middleware
# Stack: Node.js + Express + TypeScript

---

## CANONICAL BACKEND STRUCTURE

```
server/
└── src/
    ├── app.ts              ← Express setup (middleware, routes mount)
    ├── server.ts           ← HTTP server (port binding only)
    ├── routes/
    │   ├── index.ts        ← mounts all routers
    │   ├── auth.routes.ts
    │   └── [feature].routes.ts
    ├── controllers/        ← request handlers (thin — delegate to services)
    │   ├── auth.controller.ts
    │   └── [feature].controller.ts
    ├── services/           ← business logic (called by controllers)
    │   ├── auth.service.ts
    │   └── [feature].service.ts
    ├── middleware/
    │   ├── auth.middleware.ts
    │   ├── error.middleware.ts
    │   └── validate.middleware.ts
    ├── models/             ← DB schemas / ORM models
    │   └── User.model.ts
    ├── config/
    │   ├── db.ts
    │   └── env.ts
    └── utils/
        ├── response.ts     ← standardized API response helpers
        ├── errors.ts       ← custom error classes
        └── logger.ts
```

---

## app.ts — STANDARD SETUP

```ts
// server/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/notFound.middleware';

export const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Parsing
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', apiRouter);

// Error handling — must be LAST
app.use(notFound);
app.use(errorHandler);
```

---

## STANDARDIZED API RESPONSE FORMAT

Every endpoint returns this shape — no exceptions:

```ts
// server/src/utils/response.ts

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Helper functions
export function successResponse<T>(
  res: express.Response,
  data: T,
  message = 'Success',
  statusCode = 200
): void {
  res.status(statusCode).json({ success: true, message, data });
}

export function createdResponse<T>(res: express.Response, data: T, message = 'Created'): void {
  successResponse(res, data, message, 201);
}

export function paginatedResponse<T>(
  res: express.Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Success'
): void {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}
```

---

## CONTROLLER PATTERN — THIN LAYER

Controllers only: validate input, call service, send response. No business logic.

```ts
// server/src/controllers/user.controller.ts
import type { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { successResponse, createdResponse } from '../utils/response';

export const userController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getAll();
      successResponse(res, users, 'Users retrieved');
    } catch (error) {
      next(error); // always pass to error middleware
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.getById(id);
      successResponse(res, user);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.create(req.body);
      createdResponse(res, user, 'User created');
    } catch (error) {
      next(error);
    }
  },
};
```

---

## SERVICE PATTERN — BUSINESS LOGIC

```ts
// server/src/services/user.service.ts
import { User } from '../models/User.model';
import { NotFoundError, ConflictError } from '../utils/errors';
import type { CreateUserDto, UpdateUserDto } from '../types/user.types';

export const userService = {
  async getAll() {
    return User.find().select('-password').lean();
  },

  async getById(id: string) {
    const user = await User.findById(id).select('-password').lean();
    if (!user) throw new NotFoundError('User not found');
    return user;
  },

  async create(dto: CreateUserDto) {
    const exists = await User.findOne({ email: dto.email });
    if (exists) throw new ConflictError('Email already registered');
    const user = await User.create(dto);
    return user.toObject({ versionKey: false });
  },

  async update(id: string, dto: UpdateUserDto) {
    const user = await User.findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .select('-password').lean();
    if (!user) throw new NotFoundError('User not found');
    return user;
  },

  async remove(id: string) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new NotFoundError('User not found');
  },
};
```

---

## CUSTOM ERROR CLASSES

```ts
// server/src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 422, 'VALIDATION_ERROR');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}
```

---

## ERROR MIDDLEWARE — CATCHES EVERYTHING

```ts
// server/src/middleware/error.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      data: null,
    });
    return;
  }

  // Log unexpected errors (never expose internals)
  console.error('[Unhandled Error]', err);

  res.status(500).json({
    success: false,
    message: 'An internal server error occurred',
    data: null,
  });
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    data: null,
  });
}
```

---

## AUTH MIDDLEWARE

```ts
// server/src/middleware/auth.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import type { JwtPayload } from '../types/auth.types';

// Extend Express Request to carry user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError();
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ForbiddenError();
    }
    next();
  };
}
```

---

## ROUTE FILE PATTERN

```ts
// server/src/routes/user.routes.ts
import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

export const userRouter = Router();

userRouter.get('/',         authenticate, userController.getAll);
userRouter.get('/:id',      authenticate, userController.getById);
userRouter.post('/',        authenticate, authorize('admin'), userController.create);
userRouter.patch('/:id',    authenticate, userController.update);
userRouter.delete('/:id',   authenticate, authorize('admin'), userController.remove);
```

---

## ENVIRONMENT VARIABLES — SERVER

```
# .env (never commit)
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:5173
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=your-secret-here
JWT_EXPIRES_IN=7d

# .env.example (always commit)
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:PORT
DATABASE_URL=mongodb://localhost:27017/DBNAME
JWT_SECRET=change-this-secret
JWT_EXPIRES_IN=7d
```

---

## NEVER DO THESE

- ❌ Business logic inside a controller
- ❌ Database calls directly in a route handler
- ❌ `res.json({ error: err })` — use error middleware with `next(err)`
- ❌ `console.log` in production — use a proper logger
- ❌ Hardcoded secrets or connection strings
- ❌ Missing `try/catch` in async controllers — always `next(error)`
- ❌ Sending stack traces to the client in production
- ❌ JWT secret in source code — always `process.env.JWT_SECRET`
