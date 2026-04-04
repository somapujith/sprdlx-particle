# 🚀 JSX & JavaScript Optimization Bible for Vibe Coders

**Version:** 1.0  
**Purpose:** Turn "vibe-coded" messy, redundant, bloated JSX/React code into clean, performant, minimal JavaScript.  
This single file is your checklist + cookbook. Copy-paste it into `OPTIMIZATION.md` in every project.

---

## 1. Golden Rules (Read Every Time Before Refactoring)

1. **If you wrote the same logic twice while vibing → delete one.**
2. **If a variable/component/function is not used in the final render → delete it.**
3. **Every line must have a reason to exist.** No "just in case" code.
4. **Less code = faster code.** Aim for 30-50% reduction in most vibe-coded files.
5. **Never trust the first draft.** Vibe coding = 70% waste.

---

## 2. Common Vibe-Coding Sins & One-Line Fixes

| Sin (What you wrote while vibing)                  | Optimal Fix (Keep only this)                                                                 | Why |
|----------------------------------------------------|----------------------------------------------------------------------------------------------|-----|
| Multiple `useState` for the same data              | `const [data, setData] = useState(initial);`                                                | One source of truth |
| Inline arrow functions in JSX (`onClick={() => ...}`) | `const handleClick = useCallback(() => ..., [deps]);`                                       | Prevents re-renders |
| `useEffect` with no dependency array or wrong deps | `useEffect(() => { ... }, [exactDeps]);`                                                    | Stops infinite loops |
| `console.log` left everywhere                      | Delete all (or keep only one debug flag)                                                    | Dead weight |
| Unused imports                                     | Remove them (ESLint `no-unused-vars` will scream)                                           | Bundle size killer |
| Duplicate helper functions                         | Extract to one shared utils file or inline if < 3 lines                                     | DRY |
| `if (condition) { return <div>...</div> }` + else  | Ternary or early return                                                                     | Cleaner JSX |
| Big component with 5+ sub-components inside file   | Extract each to its own file (unless < 30 lines)                                            | Readability + tree-shaking |
| `any` types everywhere                             | Add proper TypeScript interfaces (or JSDoc if JS)                                           | Future-proof |
| `setState` called inside render                     | Move to event handler or `useEffect`                                                        | Performance death |
| `useMemo` on everything                            | Only on expensive calculations or when passed to children                                   | Over-memoization = slower |

---

## 3. Step-by-Step Optimization Workflow (Do This Every Time)

1. **Delete Phase** (5 minutes)
   - Run `eslint --fix` + Prettier
   - Delete all unused imports/variables
   - Delete all `console.log`, comments that say "vibe", old experiments
   - Delete any code that is commented out

2. **Consolidate Phase**
   - Find duplicate logic → create one function
   - Merge similar `useState`/`useEffect` pairs
   - Replace multiple props with one object when possible

3. **Memo Phase** (only where it matters)
   ```jsx
   const memoizedValue = useMemo(() => expensiveCalc(data), [data]);
   const memoizedHandler = useCallback((id) => handleSomething(id), []);
   const MemoChild = React.memo(ChildComponent);