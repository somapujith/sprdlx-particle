# Prompt 04 — File Bloat Surgery
# Category: Code Quality — Refactoring
# Stack: React + Vite + TypeScript

You are a senior staff engineer doing file bloat surgery. Find every file that is
over-engineered, under-organized, or doing too many things — and refactor it to be
clean, lean, and professional.

---

## PHASE 1 — AUDIT (do this before touching a single line)

Scan the entire codebase. Find every file meeting ANY of these criteria:

BLOAT SIGNALS:
- File is over 200 lines
- Component has more than one responsibility
- Same JSX pattern repeated 2+ times inside the same file
- Inline styles or className strings repeated 2+ times
- Same logic block copy-pasted in 2+ different files
- A function longer than 40 lines
- A useEffect with more than 3 responsibilities
- Conditional rendering chains longer than 3 levels deep
- Props passed through 3+ levels without being used in between
- More than 5 useState hooks in one component
- Hardcoded data arrays (mock data, config lists, nav items) inside components
- More than 3 imports from the same folder (suggests a barrel export is missing)
- Multiple fetch/axios calls in the same component or file

Produce this audit table before doing anything:

FILE BLOAT AUDIT:
  File                           | Lines | Problems
  -------------------------------|-------|-----------------------------------
  src/pages/Dashboard.tsx        |  480  | 6 useState, 3 useEffect, inline data
  src/components/Sidebar.tsx     |  340  | repeated JSX, hardcoded nav items

---

## PHASE 2 — SURGERY RULES

### RULE 1 — ONE COMPONENT, ONE RESPONSIBILITY
A component does ONE thing. If you can describe it with "and", split it.
- Data fetching + state → extract to a custom hook
- A repeated visual block → extract to a sub-component
- A complex render branch → extract to its own component

### RULE 2 — EXTRACT REPEATED JSX TO COMPONENTS
If a JSX block appears 2+ times (even with slight variation) → extract to a component.
Variations controlled by props (variant, size, type, etc.)

### RULE 3 — EXTRACT HARDCODED DATA TO CONSTANTS
Hardcoded arrays, config objects, and option lists do NOT belong inside components.
- Nav links → src/config/navigation.ts
- Select options / table columns → src/config/[feature]Config.ts
- Mock data → src/utils/mockData.ts
- Constants → src/utils/constants.ts

### RULE 4 — EXTRACT COMPLEX LOGIC TO CUSTOM HOOKS
If a component has:
- More than 3 useState hooks
- A useEffect with multiple responsibilities
- Complex event handler functions
- Derived/computed values with update logic
→ Extract to src/hooks/use[Feature].ts

### RULE 5 — BARREL EXPORTS FOR CROWDED IMPORTS
If you import 3+ things from the same folder → create an index.ts barrel.
NOTE: Only barrel-export stable, complete folders.
NEVER barrel-export pages/ or sections/ (breaks lazy imports).

### RULE 6 — TAME CONDITIONAL RENDERING CHAINS
Deep ternaries → use early returns:
  if (isLoading) return <Spinner />;
  if (error) return <ErrorState message={error.message} />;
  if (!data.length) return <EmptyState />;
  return <DataList items={data} />;

### RULE 7 — SPLIT LARGE useEffect BLOCKS
One useEffect = one purpose. Split effects that do 2+ things.

### RULE 8 — EXTRACT FORM LOGIC TO A HOOK
Forms are the #1 source of 400-line components.
State + validation + submission → src/hooks/use[Feature]Form.ts
Component becomes markup only (~40 lines).

### RULE 9 — EXTRACT TABLE COLUMN DEFINITIONS
Column configs defined inline bloat components fast.
→ Extract to src/config/[feature]TableColumns.tsx
Component becomes: const columns = useMemo(() => getColumns(handlers), [handlers]);

---

## PHASE 3 — LINE BUDGET TARGETS

After surgery, every file must hit these targets:
  Page component        → max 60 lines
  Section component     → max 120 lines
  Feature component     → max 150 lines
  Common component      → max 100 lines
  Custom hook           → max 80 lines
  Service file          → max 80 lines
  Utility file          → max 60 lines
  Backend controller    → max 80 lines
  Backend service       → max 120 lines
  Config/constants file → no limit (data only, no logic)

If still over limit after surgery → it has more than one responsibility, split further.

---

## PHASE 4 — DELIVERY FORMAT

For each bloated file:
  1. Show the BEFORE line count and problems.
  2. List every file that will be CREATED as a result.
  3. Show every new file in full — no placeholders.
  4. Show the AFTER version of the original file in full.
  5. List every import path updated across the codebase.

FORMAT:
  ── SURGERY: src/pages/Dashboard.tsx (480 lines → 45 lines) ──
  Problems: 6 useState, inline nav data, repeated card JSX
  Files created:
    src/hooks/useDashboard.ts
    src/components/common/StatCard.tsx
    src/sections/dashboard/StatsSection.tsx
  [full content of each file]
  [full updated Dashboard.tsx]
  Imports updated: [list]

---

## STRICT RULES

- Never change behavior — only structure.
- Never leave a broken import anywhere.
- Never create a barrel export for pages/ or sections/.
- Never extract a component used only once and under 10 lines.
- Never output a file with "// rest of file", "...", or "// same as before".
- Every delivered file must be 100% complete and immediately copy-pasteable.
