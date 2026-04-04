# Prompt 27 — API Documentation (Swagger / OpenAPI)
# Category: Documentation
# Stack: Node.js + Express + TypeScript

Generate complete OpenAPI 3.0 documentation for every Express route.
Available at /api/docs in development.

---

## INSTALL

npm install swagger-jsdoc swagger-ui-express
npm install --save-dev @types/swagger-jsdoc @types/swagger-ui-express

---

## server/src/config/swagger.ts

```ts
import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'REST API for [Your App Name]',
    },
    servers: [
      { url: 'http://localhost:3001/api/v1', description: 'Development' },
      { url: 'https://api.yourdomain.com/v1', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token from /auth/login response',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id:        { type: 'string', example: 'abc123' },
            email:     { type: 'string', format: 'email' },
            name:      { type: 'string', example: 'John Doe' },
            role:      { type: 'string', enum: ['admin', 'user', 'viewer'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data:    { },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success:    { type: 'boolean' },
            message:    { type: 'string' },
            data:       { type: 'array' },
            pagination: {
              type: 'object',
              properties: {
                total:      { type: 'integer' },
                page:       { type: 'integer' },
                limit:      { type: 'integer' },
                totalPages: { type: 'integer' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Resource not found' },
            data:    { type: 'null' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'], // JSDoc comments in route files
});
```

---

## server/src/app.ts — Mount docs in dev only

```ts
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

if (process.env.NODE_ENV !== 'production') {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'API Docs',
    swaggerOptions: { persistAuthorization: true },
  }));
  log.info('API docs available at http://localhost:3001/api/docs');
}
```

---

## ROUTE DOCUMENTATION PATTERN

Add JSDoc to EVERY route in every routes/*.ts file:

```ts
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns a paginated list of users. Requires admin role.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Filter by name or email
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden — insufficient permissions
 */
userRouter.get('/', authenticate, authorize('admin'), userController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
userRouter.get('/:id', authenticate, userController.getById);
```

---

## DELIVERY

1. server/src/config/swagger.ts — full config with all schemas
2. app.ts updated to serve docs
3. JSDoc comments on EVERY route in every routes/*.ts file
4. Document covers: all endpoints, all parameters, all response codes
5. Accessible at http://localhost:3001/api/docs
