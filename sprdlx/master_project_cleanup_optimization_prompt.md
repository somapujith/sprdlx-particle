# MASTER PROJECT CLEANUP & OPTIMIZATION PROMPT

You are now acting as a senior software architect, performance engineer, and production-grade refactoring expert.

Your task is to completely audit, optimize, clean, and modernize this entire codebase while preserving ALL existing functionality and visual behavior unless explicitly improving performance, maintainability, accessibility, or scalability.

## PRIMARY GOALS

Perform a FULL deep-clean and optimization pass across the entire project.

### 1. REMOVE REDUNDANCIES
Find and remove:

- Duplicate components
- Duplicate utility functions
- Repeated logic blocks
- Dead code
- Unused variables
- Unused imports
- Unused assets
- Unused CSS/Tailwind classes
- Unused images/icons/fonts
- Unused API handlers
- Unused hooks
- Unused packages/dependencies
- Legacy fallback code no longer needed
- Commented-out code blocks
- Experimental code snippets
- Console logs/debug statements
- Temporary mock/testing code

Do NOT remove anything actively used.

---

## 2. IMPROVE CODE QUALITY

Refactor the codebase to production-grade quality.

### Enforce:
- Clean architecture
- Modular structure
- Reusable components
- Proper separation of concerns
- Consistent naming conventions
- Better folder organization
- Strong typing
- Proper error handling
- Async safety
- Stable state management
- Consistent formatting
- Better readability
- Scalable patterns

### Improve:
- Component composition
- Hook abstraction
- API organization
- Utility structure
- Config management
- Environment handling
- State updates
- Memoization where useful
- Data fetching efficiency

---

## 3. PERFORMANCE OPTIMIZATION

Aggressively optimize runtime performance.

### Frontend:
- Reduce unnecessary re-renders
- Optimize React rendering lifecycle
- Use memoization only where beneficial
- Lazy load heavy components
- Split large bundles
- Remove render-blocking logic
- Optimize animations
- Reduce hydration overhead
- Optimize state subscriptions
- Reduce DOM complexity
- Eliminate layout shifts
- Optimize large lists/tables
- Reduce JS bundle size
- Remove expensive computations from render cycles

### Backend:
- Optimize API response times
- Remove duplicate DB calls
- Add caching where appropriate
- Optimize queries
- Remove blocking operations
- Improve concurrency handling
- Optimize middleware flow

---

## 4. DEPENDENCY AUDIT

Perform a complete dependency audit.

### Remove:
- Unused packages
- Duplicate libraries
- Heavy packages with lighter alternatives
- Deprecated libraries
- Vulnerable packages

### Then:
- Update outdated dependencies safely
- Improve dependency consistency
- Reduce node_modules size
- Improve build speed

Provide a report of:
- Removed packages
- Updated packages
- Why each change was made
- Estimated impact

---

## 5. IMAGE & ASSET OPTIMIZATION

Optimize ALL assets.

### Compress:
- PNG
- JPG
- JPEG
- SVG
- WebP

### Goals:
- Reduce project size
- Preserve visual quality
- Improve load times

### Also:
- Convert large images to WebP/AVIF where beneficial
- Remove unused assets
- Lazy load media
- Optimize font loading
- Remove duplicate assets
- Reduce icon bundle sizes

---

## 6. CSS / STYLING CLEANUP

Clean all styling systems.

### Remove:
- Unused styles
- Duplicate styles
- Overlapping utilities
- Redundant Tailwind classes
- Dead CSS modules
- Unused animations

### Improve:
- Responsive consistency
- Maintainable design tokens
- Shared styling patterns
- Theme consistency
- Accessibility contrast issues

---

## 7. FILE STRUCTURE & ORGANIZATION

Reorganize the project into a scalable production structure.

### Improve:
- Folder hierarchy
- Naming consistency
- Shared utilities
- Component boundaries
- Feature grouping
- Route organization
- API separation
- Asset management

Avoid breaking imports.

---

## 8. SECURITY & STABILITY

Audit for:
- Exposed secrets
- Unsafe environment handling
- Hardcoded credentials
- Unsafe API patterns
- XSS risks
- Injection risks
- Insecure auth flows
- Improper validation
- Error leakage

Add:
- Validation
- Sanitization
- Safer error handling
- Production-safe defaults

---

## 9. ACCESSIBILITY (A11Y)

Improve:
- Semantic HTML
- Keyboard navigation
- Focus states
- ARIA usage
- Color contrast
- Screen reader compatibility
- Accessible forms/buttons

---

## 10. SEO & WEB OPTIMIZATION

Improve:
- Metadata
- OpenGraph tags
- Structured data
- Semantic structure
- Page speed
- Lighthouse score
- Core Web Vitals
- Indexability

---

## 11. DEV EXPERIENCE

Improve:
- Build speed
- Hot reload speed
- Linting
- Formatting
- Type checking
- Error messages
- Scripts
- Documentation
- Environment setup
- CI/CD readiness

Add or improve:
- ESLint
- Prettier
- Husky
- lint-staged
- Type safety
- Path aliases

---

## 12. TESTING & RELIABILITY

Add/improve:
- Unit tests
- Component tests
- API tests
- Error boundary coverage
- Edge-case handling
- Validation coverage

Ensure no functionality breaks.

---

## 13. FINAL DELIVERABLES

After optimization, provide:

### A COMPLETE REPORT INCLUDING:
1. What was removed
2. What was optimized
3. What was refactored
4. Performance improvements
5. Bundle size reduction
6. Dependency reduction
7. Security improvements
8. Accessibility improvements
9. File structure improvements
10. Any remaining issues
11. Recommended next steps

Also provide:
- Before vs after metrics
- Estimated performance gains
- Largest bottlenecks found
- Technical debt summary

---

## IMPORTANT RULES

- Preserve all existing features and business logic
- Do NOT break UI/UX unless improving performance or consistency
- Maintain current design language
- Avoid overengineering
- Keep code scalable and maintainable
- Prefer readability over cleverness
- Prefer lightweight solutions
- Remove tech debt aggressively but safely
- Validate every optimization before finalizing
- Do not silently remove functionality

---

## EXECUTION STRATEGY

Follow this order:

1. Audit project
2. Detect redundancies
3. Remove dead code
4. Clean dependencies
5. Refactor architecture
6. Optimize performance
7. Optimize assets
8. Improve accessibility
9. Improve security
10. Improve DX/tooling
11. Run final validation
12. Generate optimization report

---

## OUTPUT FORMAT

For every major change:
- Explain WHY it was needed
- Explain IMPACT
- Explain RISK LEVEL
- Explain PERFORMANCE BENEFIT

Do not make random stylistic changes without justification.

Focus on:
- performance
- scalability
- maintainability
- production readiness
- clean architecture
- minimal bundle size
- fast UX
- long-term maintainability

---

You can also add this at the end for even better Cursor behavior:

> “Think like a principal engineer preparing this project for production deployment at scale.”
