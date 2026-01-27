# Testing Patterns

**Analysis Date:** 2026-01-27

## Test Framework

**Status:** ⚠️ **No test framework currently configured**

**Runner:**
- Not detected (no Jest, Vitest, or other test framework in `package.json`)

**Assertion Library:**
- Not detected

**Run Commands:**
- No test scripts in `package.json`
- `npm run lint` available for code quality checks
- TypeScript type checking via `tsc --noEmit` (not scripted)

## Test File Organization

**Location:**
- No test files found in codebase
- No `__tests__/` directories
- No `*.test.ts` or `*.spec.ts` files

**Recommended Structure (if tests were added):**
- Co-located: `src/lib/api/__tests__/proposals.test.ts`
- Or separate: `src/lib/api/proposals.test.ts` alongside source

## Quality Tools

**Linting:**
- ESLint 9.39.1 configured via `eslint.config.mjs`
- Extends: Next.js core web vitals config
- Run: `npm run lint`

**Type Checking:**
- TypeScript 5.9.3 with strict mode enabled
- Config: `tsconfig.json`
- No dedicated type-check script in package.json

**Code Organization:**
Despite no tests, the codebase has excellent architecture for testing:
- API clients isolated in `src/lib/api/` (easily mockable)
- Validation schemas in `src/lib/validations/` (pure functions)
- Utilities in `src/lib/utils/` (pure functions)
- Business logic separated from components
- Types centralized in `src/types/`

## Testable Modules

**High-value test targets (when testing is added):**

**API Client Layer:**
- `src/lib/api/client.ts` - HTTP wrapper with error handling
  - `ApiRequestError` class
  - `buildUrl()` function
  - `request<T>()` method
  - `serverFetch<T>()` method

**Utility Functions:**
- `src/lib/utils/index.ts` - Pure functions
  - `formatCurrency()`
  - `isValidStatusTransition()`
  - `canApproveProposals()`
  - `getStatusVariant()`

**Validation Schemas:**
- `src/lib/validations/auth.ts` - Zod schemas
- `src/lib/validations/proposal.ts` - Validation rules

**Auth Logic:**
- `src/lib/auth/server.ts` - JWT verification
  - `verifyToken()`
  - `getServerSession()`
  - `requireAuth()`
  - `hasPermission()`

## Recommended Testing Strategy

**If testing were to be implemented:**

**1. Unit Testing:**
- Framework: Vitest (modern, fast, TypeScript-native)
- Alternative: Jest with `ts-jest`
- Coverage goal: 85%+ for utilities and services

**2. Component Testing:**
- React Testing Library (user behavior testing)
- Focus on forms, buttons, modals
- Coverage goal: 60-70%

**3. Integration Testing:**
- API route handlers (`src/app/api/`)
- Service layer with mocked backend
- Coverage goal: 70%+

**4. E2E Testing:**
- Playwright or Cypress
- Test critical flows: login, create proposal, approve proposal
- Coverage: Key user journeys

**5. Test Organization:**
```
src/
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── client.test.ts        # Co-located tests
│   │   ├── proposals.ts
│   │   └── proposals.test.ts
```

## Current Test Coverage

**Status:** 0% - No tests found

**High-Risk Areas (need tests most):**
- Authentication flow (`src/lib/auth/`, `src/app/api/auth/`)
- Proposal creation and approval (`src/lib/api/proposals.ts`)
- Permission checks (`src/lib/api/permissions.ts`)
- Form validation (`src/lib/validations/`)
- File upload (`src/lib/storage/`)

---

*Testing analysis: 2026-01-27*
*Update when test patterns are established*
