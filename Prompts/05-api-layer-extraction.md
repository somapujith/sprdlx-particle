# Prompt 05 — API Layer Extraction
# Category: Data & State
# Stack: React + Vite + TypeScript + Axios

The iron rule: ZERO API calls inside component or section files.
The data flow is always: Service → Hook → Component. Never skip a layer.

---

## STEP 1 — SCAN AND LIST

Find every instance of:
- fetch(), axios.get/post/put/delete() inside a .tsx or .jsx file
- Any API URL string (http://, https://, /api/) hardcoded in a component
- Any direct HTTP call inside a component body or useEffect

---

## STEP 2 — CREATE BASE API CLIENT (if missing)

Create src/services/api.ts:

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
```

---

## STEP 3 — EXTRACT TO SERVICE FILES

For each API call found, create/update src/services/[feature]Service.ts:

```ts
import api from './api';
import type { User, CreateUserDto } from '@types/user.types';

export const userService = {
  async getAll(): Promise<User[]> {
    const { data } = await api.get<User[]>('/users');
    return data;
  },
  async getById(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },
  async create(payload: CreateUserDto): Promise<User> {
    const { data } = await api.post<User>('/users', payload);
    return data;
  },
};
```

Service rules:
- Services are plain objects with async methods — no React hooks inside
- Services throw errors — they never swallow them
- Always type the response generic: api.get<User[]>()
- Always destructure data from the axios response

---

## STEP 4 — WRAP IN CUSTOM HOOKS

For each service, create src/hooks/use[Feature].ts:

```ts
import { useState, useEffect, useCallback } from 'react';
import { userService } from '@services/userService';
import type { User } from '@types/user.types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void fetchUsers(); }, [fetchUsers]);

  return { users, isLoading, error, refetch: fetchUsers };
}
```

---

## STEP 5 — CONSUME IN COMPONENTS

Replace all inline fetch logic:

```tsx
// ✅ Correct
export function UserList() {
  const { users, isLoading, error, refetch } = useUsers();
  if (isLoading) return <Spinner />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!users.length) return <EmptyState message="No users found" />;
  return <ul>{users.map(u => <UserCard key={u.id} user={u} />)}</ul>;
}
```

---

## STEP 6 — ENVIRONMENT VARIABLES

Move every hardcoded URL to .env as VITE_API_BASE_URL.
Update .env.example with the variable name (empty value).
Access with import.meta.env.VITE_VARIABLE_NAME — never process.env.

---

## DELIVERY

List every file changed. Deliver full updated files.
Zero API calls should remain in any .tsx file after this.
