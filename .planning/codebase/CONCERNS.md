# Codebase Concerns

**Analysis Date:** 2026-01-16

## Tech Debt

**Large Monolithic Components:**
- Issue: Several components exceed 200+ lines, mixing concerns
- Files:
  - `src/components/forms/ProposalForm.tsx` (1416 lines) - Form state, validation, file upload, API calls all in one component
  - `src/components/ui/signup.tsx` (1222 lines) - Signup UI with complex form handling
  - `src/app/(dashboard)/roles/[id]/page.tsx` (782 lines) - Role editing with permission matrix logic
  - `src/app/(dashboard)/layout.tsx` (559 lines) - Dashboard layout with multiple providers
  - `src/app/(dashboard)/roles/new/page.tsx` (544 lines) - Role creation with state management
  - `src/components/ui/login.tsx` (540 lines) - Login form with multiple states
- Why: Rapid development without refactoring
- Impact: Hard to test, maintain, and reuse; performance issues with large component re-renders
- Fix approach: Break into smaller, focused components; extract logic into custom hooks; separate concerns (UI, state, API)

**Duplicate API Token Fetching:**
- Issue: Token fetching from `/api/auth/token` duplicated 4+ times across API service files
- Files:
  - `src/lib/api/permissions.ts` (lines 43-62, 88-107, 156-175, 211-230)
  - `src/lib/api/proposals.ts` (similar pattern)
  - Multiple other API service files
- Why: Copy-paste pattern during feature development
- Impact: Maintenance burden, inconsistent error handling
- Fix approach: Extract into shared utility function `getAuthToken()` in `src/lib/utils/auth.ts`

**Backend URL Derivation Logic:**
- Issue: URL manipulation `.replace(/\/api$/, '')` duplicated across files
- Files:
  - `src/app/api/auth/login/route.ts` (line 19)
  - `src/lib/api/proposals.ts` (line 89)
  - `src/lib/api/permissions.ts` (line 43)
- Why: No centralized configuration for backend URL
- Impact: Fragile, hard to change backend URL format
- Fix approach: Centralize in `src/constants/index.ts` as `BACKEND_BASE_URL`

**Mixed Validation Logic:**
- Issue: Manual validation in `ProposalForm` duplicates Zod schema validation
- Files:
  - `src/components/forms/ProposalForm.tsx` (lines 399-423) - Manual `validateField()` function
  - `src/lib/validations/proposal.ts` - Zod schemas
- Why: Form component predates Zod integration
- Impact: Validation logic out of sync, harder to maintain
- Fix approach: Remove manual validation, use Zod schemas exclusively

## Known Bugs

**TODO: Missing Feature Implementations:**
- Symptoms: Placeholder comments in code
- Trigger: User attempts to use unimplemented features
- Files:
  - `src/app/(auth)/login/page.tsx` (line 61) - `// TODO: Implement Google sign-in`
  - `src/app/(auth)/login/page.tsx` (line 66) - `// TODO: Implement password reset`
  - `src/app/(dashboard)/users/components/UsersTable.tsx` (line 284) - `// TODO: Handle permissions/access action`
  - `src/app/(dashboard)/users/components/UsersTable.tsx` (line 296) - `// TODO: Handle edit action`
- Workaround: None - features not implemented
- Root cause: Features planned but not yet built
- Fix: Implement missing features or remove UI elements that suggest they exist

## Security Considerations

**Hardcoded JWT Secret in .env:**
- Risk: JWT secret `hv64ytgt65ruykhndivugdgd` exposed in `.env` file
- Files: `/usr/src/app/Proposal/Proposal-Product/.env`
- Current mitigation: None - secret is weak and visible in git status (modified file)
- Recommendations:
  - Add `.env` to `.gitignore` (if not already)
  - Use strong, randomly generated secrets (32+ characters)
  - Store secrets in secure secrets management (e.g., Vercel env vars, AWS Secrets Manager)
  - Rotate secrets immediately

**Weak Fallback JWT Secret:**
- Risk: Code uses placeholder secret if env var not set
- Files: `src/lib/auth/server.ts` (line 12) - `process.env.JWT_SECRET || 'your-secret-key-change-in-production'`
- Current mitigation: None
- Recommendations: Throw error if `JWT_SECRET` not set; never use placeholder in production

**Missing Input Validation on File Uploads:**
- Risk: No file type or size validation before upload
- Files: `src/lib/storage/index.ts` - Upload functions lack validation
- Current mitigation: None at client level
- Recommendations:
  - Validate file MIME types (e.g., only allow PDFs, images)
  - Enforce file size limits (e.g., 10MB max)
  - Implement virus scanning for production
  - Add validation to `uploadFileToStorage()` function

**Missing .env.example Documentation:**
- Risk: Developers won't know which Supabase env vars are required
- Files: `.env.example` missing `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Current mitigation: None
- Recommendations: Update `.env.example` with all required variables and comments

## Performance Bottlenecks

**Potential N+1 Query Pattern in Users Table:**
- Problem: Roles fetched independently in useEffect, may trigger multiple API calls
- Files: `src/app/(dashboard)/users/components/UsersTable.tsx` (lines 47-103)
- Measurement: Not measured, potential issue
- Cause: Separate API calls for roles and users
- Improvement path: Batch fetch or include roles in users API response

**No Pagination on Roles Fetch:**
- Problem: Loads all roles into memory without pagination
- Files: `src/app/(dashboard)/users/components/UsersTable.tsx` (line 82) - `rolesApi.list()`
- Measurement: Could load thousands of roles
- Cause: No limit parameter in API call
- Improvement path: Add pagination to roles API, implement limit/offset

**Large Components Load Synchronously:**
- Problem: No code splitting for large components
- Files: `src/components/forms/ProposalForm.tsx` (1416 lines)
- Measurement: Bundle size impact not measured
- Cause: No dynamic imports
- Improvement path: Use `React.lazy()` and `Suspense` for code splitting

## Fragile Areas

**Type Safety Bypass with `as any`:**
- Why fragile: 33 instances of `as any` and type assertions bypass TypeScript safety
- Common failures: Runtime errors from unexpected data shapes
- Files:
  - `src/components/proposals/ProposalPreviewModal.tsx` (line 49) - `(response as any).html`
  - `src/app/(dashboard)/proposals/components/ProposalsTable.tsx` (lines 98-99)
  - `src/app/(dashboard)/approvals/components/ApprovalsTable.tsx` (lines 101-102)
  - `src/app/(dashboard)/roles/[id]/page.tsx` (lines 116-118)
  - `src/components/ui/pulse-beams.tsx` (line 67)
- Safe modification: Replace `as any` with proper TypeScript types; create interfaces for API responses
- Test coverage: No tests to catch type-related errors

**Error Handling Gaps:**
- Why fragile: Missing try/catch blocks in critical paths
- Common failures:
  - `src/lib/api/client.ts` (line 193-194) - JSON parsing can fail silently
  - `src/app/(dashboard)/users/components/UsersTable.tsx` (lines 52-60) - Token fetch fails with only console.error
  - Multiple `.catch(() => ({}))` swallow errors without logging
- Safe modification: Add comprehensive error handling with user feedback
- Test coverage: No tests for error scenarios

## Scaling Limits

**No Request Deduplication:**
- Current capacity: Multiple components independently fetch same data
- Limit: Wasted bandwidth and backend load
- Symptoms at limit: Slow page loads, high API usage
- Scaling path: Implement request caching or React Query for deduplication

**Missing Code Splitting:**
- Current capacity: All code loaded on initial page load
- Limit: Large bundle sizes slow down initial load
- Symptoms at limit: Slow Time to Interactive (TTI)
- Scaling path: Implement lazy loading with `React.lazy()`, route-based code splitting

## Dependencies at Risk

**Outdated or Missing Dependency Audits:**
- Risk: No regular `npm audit` runs visible
- Impact: Potential security vulnerabilities
- Migration plan: Run `npm audit` regularly, update dependencies with security patches

## Missing Critical Features

**No Testing Infrastructure:**
- Problem: Zero test files or test framework configured
- Current workaround: Manual testing only
- Blocks: Confident refactoring, automated regression detection, CI/CD quality gates
- Implementation complexity: Medium (set up Vitest + test files for critical paths)

**No Error Boundary:**
- Problem: No global error boundary for React component errors
- Current workaround: Errors crash individual components
- Blocks: Graceful error handling, error reporting
- Implementation complexity: Low (add Error Boundary wrapper in root layout)

**No Structured Logging:**
- Problem: Excessive `console.log` statements (15+ instances)
- Current workaround: Console logging in development
- Blocks: Production debugging, log aggregation, monitoring
- Files: `src/app/api/auth/me/route.ts`, `src/contexts/AuthContext.tsx`, etc.
- Implementation complexity: Low (replace with structured logger like pino or winston)

## Test Coverage Gaps

**Untested Critical Paths:**
- What's not tested: Authentication, API client, validation, CRUD operations
- Risk: Breaking changes undetected until production
- Priority: High
- Difficulty to test: Medium (need to set up test framework first)

**Specific Untested Areas:**
- `src/lib/jwt-auth.ts` - Token parsing and validation
- `src/lib/api/client.ts` - Error handling and retry logic
- `src/app/api/auth/**/route.ts` - Authentication flow
- `src/lib/validations/*.ts` - Validation schemas
- `src/components/forms/ProposalForm.tsx` - Form validation and submission

---

## Priority Summary

**🔴 Critical (Fix Immediately):**
1. Hardcoded JWT secret in `.env` - Security risk
2. Excessive `as any` type assertions (33 instances) - Runtime errors
3. Missing error handling in fetch responses - Silent failures
4. Missing input validation on file uploads - Security risk

**🟠 High Priority:**
1. Refactor large monolithic components (1400+ lines)
2. Add comprehensive error handling with user feedback
3. Remove console.log statements for production
4. Implement testing infrastructure (Vitest)

**🟡 Medium Priority:**
1. Extract duplicate API token fetching logic
2. Centralize backend URL configuration
3. Add global error boundary
4. Implement code splitting for large components

**🔵 Low Priority (Technical Debt):**
1. Break large components into smaller units
2. Implement structured logging
3. Add E2E tests
4. Optimize N+1 query patterns

---

*Concerns audit: 2026-01-16*
*Update as issues are fixed or new ones discovered*
