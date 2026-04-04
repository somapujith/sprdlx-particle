# Prompt 16 — Testing Coverage
# Category: Performance & Quality — Testing
# Stack: Vitest + React Testing Library + TypeScript

Add tests to this project. Target: 70%+ coverage on utils, services, hooks.
100% coverage on common components.

---

## SETUP (if not already configured)

```ts
// vite.config.ts
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'lcov'],
    exclude: ['node_modules/', 'src/test/', 'src/types/'],
    thresholds: { lines: 70, functions: 70, branches: 60 },
  },
}
```

```ts
// src/test/setup.ts
import '@testing-library/jest-dom';
```

Install: npm install --save-dev vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom

---

## TEST FILE PLACEMENT

Tests live NEXT TO the file they test:
  src/utils/formatters.ts         → src/utils/formatters.test.ts
  src/hooks/useAuth.ts            → src/hooks/useAuth.test.ts
  src/services/userService.ts     → src/services/userService.test.ts
  src/components/common/Button.tsx → src/components/common/Button.test.tsx

---

## WHAT TO TEST (priority order)

### 1. Utils — 100% coverage (pure functions, easy to test)
```ts
describe('formatCurrency', () => {
  it('formats positive numbers', () => expect(formatCurrency(1234.56)).toBe('$1,234.56'));
  it('handles zero', () => expect(formatCurrency(0)).toBe('$0.00'));
  it('handles negative', () => expect(formatCurrency(-50)).toBe('-$50.00'));
});
```

### 2. Services — test structure + error handling (mock axios)
```ts
vi.mock('./api');
describe('userService.getAll', () => {
  it('returns user array', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [mockUser] });
    const result = await userService.getAll();
    expect(result).toEqual([mockUser]);
  });
  it('throws on network error', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('Network error'));
    await expect(userService.getAll()).rejects.toThrow('Network error');
  });
});
```

### 3. Hooks — test state transitions
```ts
describe('useCounter', () => {
  it('increments', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });
});
```

### 4. Common Components — test behavior + accessibility
```tsx
describe('Button', () => {
  it('renders with label', () => {
    render(<Button onClick={vi.fn()}>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
  it('calls onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
  it('disabled when isLoading', () => {
    render(<Button onClick={vi.fn()} isLoading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## QUERY PRIORITY (use in this order)

1. getByRole — best (tests what users see)
2. getByLabelText — for form inputs
3. getByPlaceholderText — fallback for inputs
4. getByText — for non-interactive text
5. getByTestId — LAST RESORT only

---

## RULES

- NEVER test implementation details (internal state, private methods)
- NEVER use querySelector in tests
- ALWAYS use userEvent over fireEvent for user interactions
- ALWAYS vi.clearAllMocks() in beforeEach
- ALWAYS descriptive test names: it('shows error when email is invalid')

---

## DELIVERY

Write tests for:
1. Every file in src/utils/
2. Every file in src/services/
3. Every custom hook in src/hooks/
4. Every component in src/components/common/

Run: npm run test:coverage
Show coverage report. Target: 70%+ lines overall.
