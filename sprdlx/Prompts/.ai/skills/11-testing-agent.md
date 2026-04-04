# Skill: Testing Agent
# Agent: ALL AGENTS — any file that needs a test
# Stack: Vitest + React Testing Library + TypeScript

---

## TEST FILE PLACEMENT

```
src/
├── components/common/Button.tsx
├── components/common/Button.test.tsx    ← co-located with component
├── hooks/useAuth.ts
├── hooks/useAuth.test.ts
├── services/userService.ts
├── services/userService.test.ts
├── utils/formatters.ts
├── utils/formatters.test.ts
└── pages/Dashboard.tsx
    pages/Dashboard.test.tsx
```

Tests live NEXT TO the file they test. Never in a separate `__tests__` folder.

---

## VITEST CONFIG

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
});
```

```ts
// src/test/setup.ts
import '@testing-library/jest-dom';
```

---

## COMPONENT TEST TEMPLATE

```tsx
// src/components/common/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button onClick={vi.fn()}>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Save</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled and shows loading when isLoading=true', () => {
    render(<Button onClick={vi.fn()} isLoading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Save</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

---

## HOOK TEST TEMPLATE

```ts
// src/hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });

  it('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });
});
```

---

## SERVICE TEST TEMPLATE (with mock)

```ts
// src/services/userService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService } from './userService';
import api from './api';

// Mock the axios instance
vi.mock('./api');
const mockedApi = vi.mocked(api);

describe('userService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('fetches all users', async () => {
    const mockUsers = [{ id: '1', name: 'Alice', email: 'alice@example.com' }];
    mockedApi.get = vi.fn().mockResolvedValue({ data: mockUsers });

    const result = await userService.getAll();
    expect(result).toEqual(mockUsers);
    expect(mockedApi.get).toHaveBeenCalledWith('/users');
  });

  it('throws on API error', async () => {
    mockedApi.get = vi.fn().mockRejectedValue(new Error('Network error'));
    await expect(userService.getAll()).rejects.toThrow('Network error');
  });
});
```

---

## UTILITY TEST TEMPLATE

```ts
// src/utils/formatters.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, truncateText } from './formatters';

describe('formatCurrency', () => {
  it('formats positive numbers', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
  it('formats negative numbers', () => {
    expect(formatCurrency(-50)).toBe('-$50.00');
  });
});

describe('truncateText', () => {
  it('returns text unchanged when under limit', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });
  it('truncates and adds ellipsis when over limit', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...');
  });
});
```

---

## TESTING RULES

### Query priority (use in this order)
1. `getByRole` — best: accessible, tests what users see
2. `getByLabelText` — for form inputs
3. `getByPlaceholderText` — fallback for inputs
4. `getByText` — for non-interactive text
5. `getByTestId` — last resort only (add `data-testid` sparingly)

### Never
- ❌ `querySelector` or `getElementsBy*` in tests
- ❌ Test implementation details (internal state, private methods)
- ❌ Snapshot tests for dynamic content — they break constantly
- ❌ `act()` warnings — always wrap state updates in `act()`
- ❌ Tests that depend on execution order

### Always
- ✅ Test behavior, not implementation
- ✅ Use `userEvent` over `fireEvent` for user interactions
- ✅ `vi.clearAllMocks()` in `beforeEach`
- ✅ Descriptive test names: `it('shows error message when email is invalid')`
- ✅ One assertion concept per test (multiple `expect` calls are fine)

---

## WHAT TO TEST

| Layer | Test focus |
|---|---|
| `utils/` | All edge cases — pure functions are easy to test |
| `services/` | API call structure, error handling, mocked axios |
| `hooks/` | Return values, state transitions, side effects |
| `components/common/` | Render, user interaction, accessibility |
| `pages/` | Integration: renders correct sections, navigation |
| `sections/` | Data loading states (loading/error/empty/success) |
