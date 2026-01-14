# Testing Patterns

**Analysis Date:** 2026-01-14

## Test Framework

**Runner:**
- Not configured - No test framework installed

**Assertion Library:**
- Not detected

**Run Commands:**
```bash
# No test commands available
# package.json scripts: dev, build, start, lint
```

## Test File Organization

**Location:**
- No test files present in codebase
- No `*.test.ts`, `*.spec.ts`, or `__tests__/` directories

**Naming:**
- Not established (recommend: `*.test.ts` alongside source)

**Structure:**
```
# Recommended structure (not yet implemented)
src/
  lib/
    api/
      proposals.ts
      proposals.test.ts  # Co-located tests
  components/
    ui/
      Button.tsx
      Button.test.tsx
```

## Current Testing Status

**Unit Tests:** Not implemented
**Integration Tests:** Not implemented
**E2E Tests:** Not implemented
**Test Coverage:** 0%

## Recommended Setup

**Framework Options:**
- Vitest - Fast, Vite-native, good for Next.js (recommended)
- Jest - Mature ecosystem, more configuration needed

**Installation:**
```bash
# Recommended Vitest setup
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Configuration:**
```typescript
// vitest.config.ts (to be created)
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
})
```

## Recommended Test Patterns

**Suite Organization:**
```typescript
// Recommended pattern
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ModuleName', () => {
  describe('functionName', () => {
    beforeEach(() => {
      // reset state
    });

    it('should handle valid input', () => {
      // arrange
      // act
      // assert
    });

    it('should throw on invalid input', () => {
      expect(() => functionCall()).toThrow();
    });
  });
});
```

**Patterns:**
- Use beforeEach for per-test setup
- Use afterEach to restore mocks
- Arrange/Act/Assert structure
- One assertion focus per test

## Recommended Mocking

**Framework:**
- Vitest built-in mocking (vi)
- Mock modules at top of test file

**What to Mock:**
- Supabase client (`src/lib/api/supabaseClient.ts`)
- Fetch/API calls (`src/lib/api/client.ts`)
- Environment variables
- Browser APIs (localStorage, cookies)

**What NOT to Mock:**
- Pure utility functions (`src/lib/utils/`)
- Type definitions
- React components (test behavior instead)

## Priority Test Areas

**Critical Paths (should test first):**
1. Authentication flows
   - `src/lib/api/auth.ts` - login, register, logout
   - `src/contexts/AuthContext.tsx` - state management
   - `src/middleware.ts` - route protection

2. API client error handling
   - `src/lib/api/client.ts` - request/response handling
   - Error state propagation

3. Form validation
   - `src/lib/validations/auth.ts` - login/register schemas
   - `src/lib/validations/proposal.ts` - proposal schemas

4. Permission checks
   - `src/lib/jwt-auth.ts` - token validation
   - `hasPermission()` function

**Medium Priority:**
- UI component rendering
- Utility function correctness
- Context provider behavior

## Test Coverage Goals

**Requirements:**
- No enforced coverage target (new project)
- Recommend: Start with critical paths

**Suggested Initial Targets:**
- `src/lib/api/` - 80% coverage
- `src/lib/validations/` - 100% coverage
- `src/lib/jwt-auth.ts` - 90% coverage
- `src/middleware.ts` - 80% coverage

## Test Types to Implement

**Unit Tests:**
- Scope: Individual functions/components in isolation
- Mocking: Mock all external dependencies
- Speed: < 100ms per test
- Priority: High for utility functions and validation

**Integration Tests:**
- Scope: Multiple modules together
- Mocking: Mock external services only
- Examples: Auth flow, form submission flow

**E2E Tests:**
- Framework: Playwright or Cypress (not yet configured)
- Scope: Full user flows
- Location: Separate `e2e/` directory

## Common Patterns to Test

**Async Testing:**
```typescript
it('should handle async operation', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});
```

**Error Testing:**
```typescript
it('should throw on invalid input', () => {
  expect(() => parse(null)).toThrow('Cannot parse null');
});

// Async error
it('should reject on failure', async () => {
  await expect(asyncCall()).rejects.toThrow('error');
});
```

**API Mocking:**
```typescript
import { vi } from 'vitest';

vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));
```

---

*Testing analysis: 2026-01-14*
*Update when test infrastructure is added*
