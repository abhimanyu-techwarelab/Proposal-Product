# Coding Conventions

**Analysis Date:** 2026-01-16

## Naming Patterns

**Files:**
- `PascalCase.tsx` for React components - `Button.tsx`, `Modal.tsx`, `ProposalPreviewModal.tsx`
- `camelCase.ts` for utilities and modules - `index.ts`, `logger.ts`, `jwt-auth.ts`
- `page.tsx` for Next.js pages (Next.js convention)
- `route.ts` for Next.js API routes (Next.js convention)
- `layout.tsx` for Next.js layouts (Next.js convention)
- Test files: (Not currently used - no test files found)

**Functions:**
- camelCase for all functions - `fetchCurrentUser()`, `generateSignedUrl()`, `handleSubmit()`
- No special prefix for async functions - `async function fetchData()`
- Event handlers: `handleEventName` - `handleClick`, `handleSubmit`, `handleFileUpload`
- API methods: Verb-based - `list()`, `getById()`, `create()`, `update()`, `delete()`, `approve()`, `reject()`

**Variables:**
- camelCase for variables - `isLoading`, `proposalData`, `selectedFile`
- Boolean flags: `is*`, `has*`, `can*` - `isAuthenticated`, `hasPermission`, `canApprove`
- UPPER_SNAKE_CASE for constants - `API_BASE_URL`, `APPROVAL_ROLES`, `STORAGE_BUCKETS`

**Types:**
- PascalCase for interfaces and types - `Proposal`, `User`, `Role`, `Permission`
- No `I` prefix for interfaces - `interface User` (not `IUser`)
- PascalCase for type aliases - `UserRole`, `ProposalStatus`, `ApiResponse<T>`
- PascalCase for enums - `enum ProposalStatus`, `enum Currency`, `enum BillingType`
- UPPER_CASE for enum values - `ProposalStatus.PENDING`, `Currency.USD`

## Code Style

**Formatting:**
- Indentation: 2 spaces (TypeScript/Next.js default)
- Line length: Generally under 100 characters
- Single quotes for imports and strings - `import React from 'react';`
- Double quotes for JSX attributes - `className="..."`
- Semicolons: Required at end of statements
- No Prettier config found - ESLint handles formatting via Next.js

**Linting:**
- ESLint with `eslint.config.mjs`
- Extends: `next/core-web-vitals` (Next.js recommended rules)
- Ignored paths: `.next/**`, `out/**`, `build/**`
- Run: `npm run lint`

## Import Organization

**Order:**
1. External packages - `import React from 'react'`
2. Next.js imports - `import { useRouter } from 'next/navigation'`
3. Internal modules with `@/` alias - `import { cn } from '@/lib/utils'`
4. Relative imports - `import { Button } from './Button'`
5. Type imports - `import type { User } from '@/types'`

**Grouping:**
- Blank lines between groups (not consistently enforced)
- Alphabetical within each group (not enforced)

**Path Aliases:**
- `@/*` maps to `./src/*` - configured in `tsconfig.json`
- Example: `import { Button } from '@/components/ui'`

## Error Handling

**Patterns:**
- Throw errors, catch at boundaries (route handlers, component level)
- Custom error class: `ApiRequestError` extends `Error` - `src/lib/api/client.ts`
- Async functions use try/catch - no `.catch()` chains
- Error responses include status code and message

**Error Types:**
- Throw on invalid input, missing dependencies, API failures
- Return error objects for expected failures - `{ error: string | null }`
- Client components display user-friendly error messages
- 401 responses trigger automatic redirect to `/login`

## Logging

**Framework:**
- Custom logger: `src/lib/utils/logger.ts`
- Levels: Auth events only (loginSuccess, loginFailure, registerSuccess, registerFailure, logout)
- Console-based logging

**Patterns:**
- Excessive `console.log` statements in development (15+ instances)
- Examples: `src/app/api/auth/me/route.ts`, `src/contexts/AuthContext.tsx`
- Log state transitions, external API calls, errors
- **Issue**: Need to remove console.log before production

## Comments

**When to Comment:**
- Section headers with ASCII box style:
  ```typescript
  // ============================================================================
  // Types
  // ============================================================================
  ```
- JSDoc for exported functions and utilities
- Inline comments for non-obvious logic only
- Avoid obvious comments

**JSDoc/TSDoc:**
- Required for public API functions
- Optional for internal functions if signature is self-explanatory
- Pattern:
  ```typescript
  /**
   * Upload a single file to Supabase Storage
   * @param file - The file to upload
   * @param bucket - The storage bucket name
   * @param folderId - The folder ID within the bucket
   */
  ```

**TODO Comments:**
- Format: `// TODO: description`
- Examples:
  - `src/app/(auth)/login/page.tsx` (line 61): `// TODO: Implement Google sign-in`
  - `src/app/(auth)/login/page.tsx` (line 66): `// TODO: Implement password reset`

## Function Design

**Size:**
- Keep under 50-100 lines (not strictly enforced)
- Extract helpers for complex logic
- **Issue**: Some functions exceed 200 lines (e.g., form components)

**Parameters:**
- Max 3-4 parameters preferred
- Use options object for more parameters:
  ```typescript
  function create(options: CreateOptions)
  ```
- Destructure in parameter list:
  ```typescript
  function process({ id, name }: ProcessParams)
  ```

**Return Values:**
- Explicit return statements
- Return early for guard clauses
- Type-safe returns with TypeScript
- Use `Promise<T>` for async functions

## Module Design

**Exports:**
- Named exports preferred - `export const Button`
- Default exports for Next.js pages - `export default function Page()`
- Barrel exports from `index.ts` for public APIs

**Barrel Files:**
- `index.ts` re-exports public API
- Example: `src/components/ui/index.ts` exports all UI components
- Keep internal helpers private (don't export from index)
- Avoid circular dependencies

## Component Patterns

**Component Structure:**
```typescript
// ============================================================================
// Types
// ============================================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

// ============================================================================
// Styles
// ============================================================================

const variantStyles: Record<ButtonVariant, string> = { ... }

// ============================================================================
// Component
// ============================================================================

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, ...props }, ref) => {
    return <button ref={ref} {...props} />;
  }
);

Button.displayName = 'Button';
```

**Props:**
- Extend native HTML attributes when possible
- Use optional props with sensible defaults
- Spread operator for flexible props: `{...props}`
- Forwarding refs with `React.forwardRef()`

**State Management:**
- `useState` for local component state
- `useCallback` for memoized handlers
- `useEffect` with dependency arrays
- Context for global state

## Validation Pattern

**Zod Schemas:**
- Separate schema files: `src/lib/validations/*.ts`
- Type inference: `export type LoginInput = z.infer<typeof loginSchema>;`
- Custom refinements for complex validation
- Shared schemas for nested objects - `deliverableSchema`, `teamMemberSchema`

**Usage:**
```typescript
import { loginSchema, type LoginInput } from '@/lib/validations/auth';

const result = loginSchema.safeParse(formData);
if (!result.success) {
  // Handle validation errors
}
```

---

*Convention analysis: 2026-01-16*
*Update when patterns change*
