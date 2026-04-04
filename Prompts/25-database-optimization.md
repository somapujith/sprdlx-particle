# Prompt 25 — Database Optimization
# Category: Runtime & Monitoring
# Stack: Node.js + Express + TypeScript + MongoDB/PostgreSQL

Audit all database usage for performance problems and fix them.

---

## SCAN FOR THESE PROBLEMS

### N+1 Queries (most common performance killer)
```ts
// ❌ N+1 — 1 query to get users + N queries to get their posts
const users = await User.find();
for (const user of users) {
  user.posts = await Post.find({ userId: user.id }); // N queries!
}

// ✅ Fix for MongoDB — use populate
const users = await User.find().populate('posts');

// ✅ Fix for MongoDB — manual batch
const userIds = users.map(u => u.id);
const posts = await Post.find({ userId: { $in: userIds } });
const postsByUser = groupBy(posts, 'userId');
users.forEach(u => { u.posts = postsByUser[u.id] || []; });

// ✅ Fix for PostgreSQL/Prisma — use include
const users = await prisma.user.findMany({
  include: { posts: true }
});
```

### Unbounded Queries (will crash in production with real data)
```ts
// ❌ Returns ALL records — crashes at 100k+ rows
const users = await User.find();
const products = await Product.find({});

// ✅ Always paginate
const page = parseInt(req.query.page as string) || 1;
const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
const skip = (page - 1) * limit;

const [users, total] = await Promise.all([
  User.find().skip(skip).limit(limit).lean(),
  User.countDocuments(),
]);

return paginatedResponse(res, users, total, page, limit);
```

### Missing Indexes
```ts
// MongoDB — add indexes to frequently queried fields
// Find every .find({ email: ... }), .find({ userId: ... }), .sort({ createdAt: ... })
// Add indexes:

// mongoose model:
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, createdAt: -1 });
postSchema.index({ userId: 1, createdAt: -1 });

// PostgreSQL (Prisma migration):
// @@index([email])
// @@index([userId, createdAt])
```

### Fetching More Data Than Needed
```ts
// ❌ Fetches entire document including sensitive fields
const user = await User.findById(id);

// ✅ Project only needed fields
const user = await User.findById(id).select('name email avatar role').lean();

// ❌ Fetching all nested data when only a count is needed
const posts = await Post.find({ userId });
const count = posts.length; // fetched all posts just for count

// ✅
const count = await Post.countDocuments({ userId });
```

### Missing .lean() in Mongoose (performance)
```ts
// ❌ Returns full Mongoose documents (heavy objects with methods)
const users = await User.find();

// ✅ Returns plain JS objects (much faster for reads)
const users = await User.find().lean();
// NOTE: Don't use .lean() if you need to call .save() on the result
```

### Not Using Promise.all for Parallel Queries
```ts
// ❌ Sequential — 3x slower
const user = await User.findById(userId);
const posts = await Post.find({ userId });
const comments = await Comment.find({ userId });

// ✅ Parallel — 3x faster
const [user, posts, comments] = await Promise.all([
  User.findById(userId).lean(),
  Post.find({ userId }).lean(),
  Comment.find({ userId }).lean(),
]);
```

---

## CONNECTION POOLING

```ts
// server/src/config/db.ts
import mongoose from 'mongoose';

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(process.env.DATABASE_URL!, {
    maxPoolSize: 10,     // max connections in pool
    minPoolSize: 2,      // keep 2 connections always open
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
}
```

---

## QUERY PERFORMANCE MONITORING

```ts
// Enable in development to find slow queries:
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    log.debug(`MongoDB: ${collectionName}.${method}`, { query });
  });
}
```

---

## AUDIT CHECKLIST

Go through every service file and check:
- [ ] Every find/findAll has a .limit()
- [ ] Every list endpoint accepts page + limit params
- [ ] No forEach loops that query inside
- [ ] Indexes defined for every queried/sorted field
- [ ] .select() or .lean() used on read-heavy queries
- [ ] Parallel queries use Promise.all

---

## DELIVERY

List every query optimized with BEFORE/AFTER code.
List every index added with the field and reason.
