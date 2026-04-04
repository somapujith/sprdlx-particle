# Skill: API Layer Agent
# Agent: FRONTEND + BACKEND — all data fetching and API integration
# Stack: React + TypeScript + Axios + Node/Express

---

## THE IRON RULE

**Zero API calls inside component or section files.**
The data flow is always: `Service → Hook → Component`. Never skip a layer.

```
src/services/featureService.ts   ← axios calls live here ONLY
src/hooks/useFeature.ts          ← wraps service, manages state
src/components/Feature.tsx       ← consumes hook, never service directly
```

---

## BASE API CLIENT — src/services/api.ts

This file must exist and be the only place the base URL is configured.

```ts
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — normalize errors + handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Normalize error shape for consistent handling
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
```

---

## SERVICE FILE TEMPLATE

```ts
// src/services/userService.ts
import api from './api';
import type { User, CreateUserDto, UpdateUserDto } from '@types/user.types';

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

  async update(id: string, payload: UpdateUserDto): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
```

Service rules:
- Services are plain objects with async methods — no React hooks inside.
- Services throw errors — they don't swallow them.
- Always type the response generic: `api.get<User[]>('/users')`
- Always destructure `data` from the axios response.
- Never return the raw axios response — return `data` directly.

---

## QUERY HOOK TEMPLATE (data fetching)

```ts
// src/hooks/useUsers.ts
import { useState, useEffect, useCallback } from 'react';
import { userService } from '@services/userService';
import type { User } from '@types/user.types';

interface UseUsersResult {
  users: User[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, isLoading, error, refetch: fetchUsers };
}
```

---

## MUTATION HOOK TEMPLATE (create / update / delete)

```ts
// src/hooks/useCreateUser.ts
import { useState } from 'react';
import { userService } from '@services/userService';
import type { CreateUserDto, User } from '@types/user.types';

interface UseMutationResult<T, P> {
  mutate: (payload: P) => Promise<T>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

export function useCreateUser(): UseMutationResult<User, CreateUserDto> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (payload: CreateUserDto): Promise<User> => {
    try {
      setIsLoading(true);
      setError(null);
      return await userService.create(payload);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create user');
      setError(error);
      throw error; // re-throw so the caller can handle it too
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => setError(null);

  return { mutate, isLoading, error, reset };
}
```

---

## CONSUMING A HOOK IN A COMPONENT

```tsx
// ✅ Correct
export function UserList() {
  const { users, isLoading, error, refetch } = useUsers();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;
  if (users.length === 0) return <EmptyState message="No users found" />;

  return <ul>{users.map(u => <UserCard key={u.id} user={u} />)}</ul>;
}

// ❌ Wrong — never do this
export function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers); // ← VIOLATION
  }, []);
  return <ul>{users.map(...)}</ul>;
}
```

---

## ENVIRONMENT VARIABLES

```
# .env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_APP_NAME=MyApp

# .env.example (always commit this)
VITE_API_BASE_URL=http://localhost:PORT/api/v1
VITE_APP_NAME=Your App Name
```

Rules:
- All Vite env vars must be prefixed `VITE_` to be accessible in the browser.
- Access with `import.meta.env.VITE_VARIABLE_NAME` — never `process.env`.
- Never hardcode any URL, key, or secret in source files.
- Never commit `.env` — only `.env.example`.

---

## TYPE DEFINITIONS FOR API

```ts
// src/types/user.types.ts

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
  createdAt: string; // ISO 8601
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role?: User['role'];
}

export interface UpdateUserDto {
  name?: string;
  role?: User['role'];
}

// Standard API response wrapper (match your backend shape)
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```
