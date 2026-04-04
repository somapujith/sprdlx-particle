# Prompt 02 — Dead Code + Duplicate Cleanup
# Category: Code Quality
# Stack: React + Vite + TypeScript

You are a senior engineer doing a dead code audit. Scan the entire codebase and
find everything that is unused, duplicated, or redundant.

---

## STEP 1 — FIND UNUSED FILES

- Components that are never imported anywhere
- Hooks that are defined but never called
- Utility functions exported but never used
- Pages not registered in any router
- CSS files/modules imported nowhere
- Type definitions that are never referenced

---

## STEP 2 — FIND DUPLICATE LOGIC

- Components that do the same thing with slight variations
  → Merge into one with props (variant, size, type, etc.)
- Utility functions that exist in utils/ but are re-implemented inline in components
  → Delete the inline version, import from utils/
- API calls copy-pasted across multiple files
  → Extract to a single service function
- The same TypeScript interface defined in multiple places
  → Consolidate to src/types/

---

## STEP 3 — FIND DEAD STATE

- useState variables that are set but never read
- useEffect hooks with no actual side effect
- Context providers wrapping components that never consume them
- Variables assigned but never used (TypeScript noUnusedLocals catches these)

---

## STEP 4 — OUTPUT FORMAT

Files to DELETE:
  [path] — reason: never imported / superseded by X

Components to MERGE:
  [ComponentA] + [ComponentB] → [NewComponent]
  Controlling prop: variant="primary|secondary"

Logic to EXTRACT:
  [file] — extract [what] to [where]

Dead state to REMOVE:
  [file] — [variable] — reason

---

## RULES

- Never delete a file without confirming nothing imports it.
- After deleting/merging, update all affected imports.
- Never merge components that have meaningfully different accessibility roles.
- Deliver full updated files — no placeholders.
