# Prompt 19 — Code Review Agent (PR-Style Full Audit)
# Category: Code Quality — Review
# Stack: React + Vite + TypeScript + Node/Express

You are a principal engineer doing a thorough code review of this entire codebase.
Review it exactly as you would review a pull request before merging to production.

---

## REVIEW DIMENSIONS

### CORRECTNESS
- Logic bugs: off-by-one errors, wrong comparisons, inverted conditions
- Race conditions: async operations that can interleave incorrectly
- Missing edge cases: empty arrays, null values, zero, negative numbers, very long strings
- Incorrect error handling: errors caught and swallowed silently
- Stale closures in useEffect or useCallback with wrong dependencies
- Off-by-one in pagination calculations
- Date/timezone issues (comparing dates without normalization)

### SECURITY
- Unvalidated user input reaching DB queries or the file system
- Secrets or tokens logged or exposed in API responses
- Missing auth checks on protected routes
- CORS configured too broadly (Access-Control-Allow-Origin: *)
- SQL/NoSQL injection vectors

### PERFORMANCE
- N+1 query patterns (calling DB inside a forEach/map loop)
  → Fix: batch queries with findByIds([...ids])
- Missing database indexes on frequently queried/sorted fields
- Unbounded queries with no pagination limit
  → Fix: always add .limit(n) and accept page/limit params
- Memory leaks: event listeners added in useEffect without cleanup
- Intervals/timeouts not cleared on component unmount

### MAINTAINABILITY
- Functions doing more than one thing
- Magic numbers with no explanation
  → Fix: extract to named constant with a comment
- Business logic duplicated in 2+ places
- Complex conditions that should be extracted to a named function:
  WRONG: if (user.role === 'admin' && user.verified && !user.suspended && Date.now() < user.planExpiry)
  RIGHT: const canAccessAdminPanel = (user: User): boolean => ...
- Deeply nested callbacks or promise chains (> 3 levels)
  → Fix: use async/await, extract to named functions

### TYPESCRIPT
- Type assertions (as X) hiding real type errors
- Non-null assertions (!) where null is actually possible
- any types anywhere
- Missing error type narrowing in catch blocks

### REACT-SPECIFIC
- Missing key prop in lists
- useEffect with missing dependencies
- Mutation of state directly (push, splice, direct assignment)
- useRef used for things that should trigger re-renders
- Multiple setState calls that should be batched (use useReducer or single setState)

---

## OUTPUT FORMAT

For every issue found:

  FILE: src/services/userService.ts
  LINE: ~45
  SEVERITY: HIGH | MEDIUM | LOW
  CATEGORY: Performance / Security / Correctness / Maintainability / TypeScript
  ISSUE: N+1 query — calling findById() inside a forEach loop
  FIX:   Use findByIds([...ids]) and build a lookup map instead

  [show the BEFORE code]
  [show the AFTER code]

---

## ACTION AFTER REVIEW

- Fix every HIGH severity issue immediately
- Fix every MEDIUM severity issue
- List LOW severity issues as tech debt recommendations (don't change code)

---

## FINAL SUMMARY

HIGH SEVERITY:   [count] — [list]
MEDIUM SEVERITY: [count] — [list]
LOW SEVERITY:    [count] — [list as recommendations]

FILES CHANGED:   [list]
