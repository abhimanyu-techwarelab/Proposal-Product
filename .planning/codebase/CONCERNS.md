# Codebase Concerns

**Analysis Date:** 2026-01-27

## Security Considerations

**Hardcoded Secrets in .env (CRITICAL)**
- Risk: Sensitive credentials exposed in repository
- Files: `src/.env`
- Current mitigation: None (file should be gitignored but contains actual secrets)
- Recommendations:
  - Rotate JWT_SECRET immediately
  - Remove `src/.env` from repository
  - Use environment-specific secret management
  - Verify `.env` is in `.gitignore`

**Default JWT Secret Fallback**
- Risk: Falls back to known default secret if JWT_SECRET env var is missing
- File: `src/lib/auth/server.ts` (lines 11-13)
- Current mitigation: None (uses fallback `'your-secret-key-change-in-production'`)
- Recommendations: Throw error instead of falling back to default

**Incomplete .env.example**
- Risk: Developers won't know required Supabase configuration
- File: `.env.example` (lines 1-8)
- Current mitigation: `.env.docker.example` exists but main template incomplete
- Recommendations: Add all required Supabase variables to `.env.example`

**Admin Role Check Client-Side Only**
- Risk: Permission checks may only be UI-level (not verified in findings)
- Files: Components using permission checks
- Current mitigation: Backend API should enforce permissions (needs verification)
- Recommendations: Ensure server-side permission validation on all protected endpoints

## Error Handling Gaps

**Missing Error Handling in serverFetch()**
- Issue: No try/catch block for response parsing
- File: `src/lib/api/client.ts` (lines 217-224)
- Impact: If response.json() fails, error propagates uncaught
- Fix approach: Add try/catch consistent with main `request()` function

**Unhandled Supabase Client Initialization**
- Issue: Missing error check, only uses console.error
- File: `src/lib/api/supabaseClient.ts` (lines 6-8)
- Impact: Silently fails if Supabase env vars missing
- Fix approach: Throw Error to fail fast during initialization

**Console Errors in Production Code**
- Issue: Extensive console.log/error statements left in code
- Files:
  - `src/components/forms/ProposalForm.tsx` (multiple locations)
  - `src/lib/api/permissions.ts` (lines 206-265)
  - `src/app/api/auth/me/route.ts` (lines 47-48)
- Impact: Debug output in production, potential information leakage
- Fix approach: Remove or replace with proper logging service

## Type Safety Issues

**Loose Typing in AuthContext**
- Issue: Uses `any` type for user and session
- File: `src/contexts/AuthContext.tsx` (lines 29, 31)
  ```typescript
  user: any | null;
  session: any | null;
  ```
- Impact: No type safety for user/session data structure
- Fix approach: Define proper User and Session types in `src/types/index.ts`

## Tech Debt

**Extremely Large Component**
- Issue: ProposalForm.tsx is 2,516 lines
- File: `src/components/forms/ProposalForm.tsx`
- Why: File upload, form state, draft creation, extraction polling all in one component
- Impact: Hard to maintain, test, and debug
- Fix approach: Break into smaller components (FileUpload, FormFields, ExtractionPoller, etc.)

**Other Large Components Needing Refactoring:**
- `src/components/ui/signup.tsx` (1,685 lines)
- `src/app/(dashboard)/roles/[id]/page.tsx` (782 lines)
- `src/app/(dashboard)/proposals/[id]/edit/components/ProposalEditForm.tsx` (646 lines)
- `src/app/(dashboard)/layout.tsx` (559 lines)

**Code Duplication - Backend URL Construction**
- Issue: Manual backend URL derivation repeated across files
- Files:
  - `src/app/api/auth/me/route.ts` (lines 26-31)
  - `src/app/api/auth/login/route.ts` (lines 18-24)
  - `src/lib/api/permissions.ts` (lines 43-44, 88-89, 156-157)
- Impact: Inconsistent URL construction, maintenance burden
- Fix approach: Create shared utility function in `src/lib/utils/`

**Code Duplication - Manual Fetch vs API Client**
- Issue: Manual fetch with inline error handling repeated
- File: `src/lib/api/permissions.ts` (lines 43-82, 87+, 153+)
- Impact: Repeated token retrieval and error handling logic
- Fix approach: Use `apiClient` wrapper to avoid repetition

## Performance Bottlenecks

**Blocking Token Fetch on Every Request**
- Problem: Every API call makes synchronous fetch to `/api/auth/token`
- Files:
  - `src/lib/api/permissions.ts` (lines 47, 92, 160)
  - `src/lib/api/client.ts` (lines 102-107)
- Measurement: Adds latency to every API call
- Improvement path: Implement token caching or prefetching strategy

**Polling Without Cleanup**
- Problem: Extraction status polling may continue indefinitely
- File: `src/components/forms/ProposalForm.tsx`
- Impact: Potential memory leaks if component unmounts during polling
- Improvement path: Implement cleanup/unsubscribe mechanism

**N+1 Query Pattern in Permissions**
- Problem: Makes parallel Promise.all() calls to separate endpoints
- File: `src/lib/api/permissions.ts` (lines 109-126)
- Impact: Multiple API calls instead of one combined endpoint
- Improvement path: Create single combined endpoint in backend

## Missing Tests

**No Test Framework Configured**
- Problem: Zero test coverage across entire codebase
- Impact: No automated verification of functionality, high regression risk
- Priority: High
- Fix approach:
  - Add Vitest or Jest
  - Start with critical paths (auth, proposal creation, permissions)
  - Add E2E tests for key user flows

**Critical Untested Code:**
- `src/components/forms/ProposalForm.tsx` - Complex business logic
- `src/lib/api/client.ts` - HTTP error handling
- `src/lib/auth/server.ts` - Authentication/authorization
- `src/lib/jwt-auth.ts` - JWT encoding/decoding
- API route handlers in `src/app/api/`

## Documentation Gaps

**JWT Handling Lacks Documentation**
- File: `src/lib/jwt-auth.ts` (lines 12-46)
- Issue: Complex base64url decoding workaround undocumented
- Impact: Hard to maintain or debug
- Fix approach: Add comments explaining browser vs Node.js handling

**Extraction Polling Logic Undocumented**
- File: `src/components/forms/ProposalForm.tsx`
- Issue: State transitions (pending → processing → completed) not documented
- Impact: Hard to understand workflow
- Fix approach: Add comments or flowchart documentation

**API Client Error Handling**
- File: `src/lib/api/client.ts` (lines 37-59)
- Issue: Complex error response parsing from multiple backend formats
- Impact: Hard to understand expected error shapes
- Fix approach: Document expected backend error formats

## Edge Cases & Race Conditions

**Register Rollback Incomplete**
- File: `src/lib/api/auth.ts` (lines 105-110)
- Issue: If org creation fails, user deletion uses .catch() that silently fails
- Impact: User exists in auth system but not in product_users table
- Fix approach: Use proper error handling and cleanup in transaction

**Duplicate Org Creation Risk**
- File: `src/lib/api/auth.ts`
- Issue: No transaction or idempotency key for registration
- Impact: Retried requests could create duplicate organizations
- Fix approach: Add idempotency tokens or database constraints

**Hardcoded Role ID Without Validation**
- File: `src/lib/api/auth.ts` (line 123)
- Issue: Hardcoded role_id `"e7c6a2d4-9b3f-4a21-8c5f-0b9f6e2a4d31"`
- Impact: No validation this role exists
- Fix approach: Fetch available roles or use constants with validation

## Configuration & Validation Issues

**Missing Environment Validation**
- Files: `src/constants/index.ts` (lines 13-14)
- Issue: API_BASE_URL falls back to "http://localhost:3000" silently
- Impact: No validation that required env vars are set in production
- Fix approach: Add environment validation at application startup

**Hardcoded Defaults Scattered**
- Files:
  - `src/app/api/auth/me/route.ts` (lines 26-31) - "http://localhost:3000"
  - `src/lib/api/permissions.ts` (lines 43-44) - "http://localhost:3001"
- Impact: Inconsistent fallback behavior
- Fix approach: Use centralized constants from `src/constants/index.ts`

---

## Summary by Severity

| Severity | Count | Primary Areas |
|----------|-------|---------------|
| **CRITICAL** | 2 | Hardcoded secrets, default JWT fallback |
| **HIGH** | 8 | Error handling gaps, type safety, large components, missing tests |
| **MEDIUM** | 12 | Code duplication, performance, documentation |
| **LOW** | 6 | Configuration, edge cases |

**Immediate Actions Required:**
1. **CRITICAL**: Rotate JWT_SECRET and secure .env file
2. **HIGH**: Add try/catch to serverFetch() in `src/lib/api/client.ts`
3. **HIGH**: Type AuthContext properly (remove `any`)
4. **HIGH**: Add test framework and critical test coverage
5. **MEDIUM**: Refactor ProposalForm.tsx into smaller components
6. **MEDIUM**: Remove console statements from production code
7. **MEDIUM**: Create shared utility for backend URL construction

---

*Concerns audit: 2026-01-27*
*Update as issues are fixed or new ones discovered*
