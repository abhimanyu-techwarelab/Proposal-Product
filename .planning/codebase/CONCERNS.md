# Codebase Concerns

**Analysis Date:** 2026-01-14

## Security Issues

**Exposed JWT Secret in Code:**
- Issue: Default JWT secret embedded as fallback in code
- Files: `src/lib/auth/server.ts` (line 12)
- Impact: Tokens can be forged if env var is missing
- Fix: Remove fallback secret entirely; require JWT_SECRET in production

**Unsafe HTML Rendering:**
- Issue: Uses `dangerouslySetInnerHTML` without sanitization
- Files: `src/components/proposals/ProposalPreviewModal.tsx` (line 117)
- Impact: XSS vulnerability if backend generates untrusted HTML
- Fix: Add DOMPurify library to sanitize `htmlContent` before rendering

**Credentials in .env File:**
- Issue: Supabase credentials and JWT secret should not be committed
- Files: `.env` (should be gitignored)
- Impact: Secrets exposed if repo is public
- Fix: Add `.env` to `.gitignore`, use `.env.example` template

## Tech Debt

**Hardcoded Role IDs for Authorization:**
- Issue: Role-based approval uses hardcoded role IDs `[1, 2, 3]`
- Files: `src/app/(dashboard)/proposals/[id]/page.tsx` (lines 20-24)
- Why: Quick implementation without dynamic permission system
- Impact: Role structure changes won't propagate
- Fix: Use `hasPermission()` from AuthContext instead of hardcoded IDs

**Repeated Token Fetching Pattern:**
- Issue: Multiple files fetch token from `/api/auth/token` independently
- Files: `src/lib/api/permissions.ts`, `src/app/(dashboard)/roles/components/RolesTable.tsx`, `src/app/(dashboard)/users/components/UsersTable.tsx`, `src/app/(dashboard)/users/components/UsersFilters.tsx`
- Why: No centralized token utility
- Impact: Duplicated logic, potential race conditions
- Fix: Create `getAuthToken()` utility or `useAuthToken()` hook

**Loose Type Safety with `any`:**
- Issue: Using `any` type bypasses TypeScript safety
- Files: `src/contexts/AuthContext.tsx` (lines 27, 29), `src/components/proposals/ProposalPreviewModal.tsx` (line 49)
- Why: Quick implementation
- Impact: Type errors not caught at compile time
- Fix: Define proper interfaces for user, session, API responses

**Mock Data in Production Code:**
- Issue: Proposal detail page uses hardcoded mock data
- Files: `src/app/(dashboard)/proposals/[id]/page.tsx` (lines 31-85)
- Why: Feature incomplete
- Impact: Feature non-functional; not integrated with backend
- Fix: Replace mock data with `proposalsApi.getById(id)` call

## Known Bugs

**No significant bugs detected**
- Codebase is in early stage (initial commit)
- Most features appear functional based on code review

## Performance Bottlenecks

**Large Component Files:**
- Problem: Several components exceed recommended size
- Files:
  - `src/components/ui/signup.tsx` - 1222 lines
  - `src/components/forms/ProposalForm.tsx` - 1093 lines
  - `src/app/(dashboard)/roles/[id]/page.tsx` - 782 lines
- Measurement: Not applicable (code complexity, not runtime)
- Cause: All functionality in single file instead of extracted components
- Fix: Break into smaller components; extract state to custom hooks

**Excessive Console Logging:**
- Problem: 103 console.log statements throughout codebase
- Impact: Performance overhead in production; noisy logs
- Fix: Remove debug logs or use structured logging with log levels

## Fragile Areas

**Authentication Middleware Chain:**
- Files: `src/middleware.ts`
- Why fragile: Token validation with multiple redirect paths
- Common failures: Missing token handling, race conditions
- Safe modification: Add tests before changes
- Test coverage: No tests

**Form State Management:**
- Files: `src/components/forms/ProposalForm.tsx`
- Why fragile: Complex nested state (deliverables, team members, links)
- Common failures: Array state updates, validation for nested items
- Safe modification: Extract to custom hooks, add field-level validation
- Test coverage: No tests

## Test Coverage Gaps

**Authentication Flows:**
- What's not tested: Login, register, logout, token refresh
- Risk: Auth bugs silently break user access
- Priority: High
- Files: `src/lib/api/auth.ts`, `src/contexts/AuthContext.tsx`

**Permission Checks:**
- What's not tested: RBAC middleware, hasPermission logic
- Risk: Authorization bypass
- Priority: High
- Files: `src/middleware.ts`, `src/lib/jwt-auth.ts`

**Form Validation:**
- What's not tested: Zod schema validation
- Risk: Invalid data submitted to backend
- Priority: Medium
- Files: `src/lib/validations/proposal.ts`, `src/lib/validations/auth.ts`

**API Error Handling:**
- What's not tested: Error states, retry logic, 401 redirects
- Risk: Poor user experience on failures
- Priority: Medium
- Files: `src/lib/api/client.ts`

## Missing Critical Features

**No Test Infrastructure:**
- Problem: Zero test coverage
- Current workaround: Manual testing
- Blocks: Safe refactoring, CI/CD
- Complexity: Low (add Vitest setup)

**No Error Boundaries:**
- Problem: Unhandled errors crash entire app
- Current workaround: None
- Blocks: Graceful error recovery
- Complexity: Low (add ErrorBoundary components)

**Incomplete Google OAuth:**
- Problem: Login page has Google sign-in TODO
- Current workaround: Email/password only
- Blocks: Social login feature
- Complexity: Medium

## Dependencies at Risk

**No significant dependency risks detected**
- All major dependencies are current stable versions
- TypeScript 5.3.3 could update to 5.6+ when ready
- Consider adding DOMPurify for HTML sanitization

## Documentation Gaps

**Missing inline documentation:**
- Files: `src/components/forms/ProposalForm.tsx` - complex logic undocumented
- Files: `src/lib/storage/index.ts` - error scenarios not explained

**No CONTRIBUTING.md:**
- Problem: No contributor guidelines
- Impact: Harder for new developers to maintain consistency

---

*Concerns audit: 2026-01-14*
*Update as issues are fixed or new ones discovered*
