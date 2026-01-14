# Coding Conventions

**Analysis Date:** 2026-01-14

## Naming Patterns

**Files:**
- PascalCase for components: `Button.tsx`, `ProposalForm.tsx`, `AuthContext.tsx`
- kebab-case for utilities: `jwt-auth.ts`
- lowercase for Next.js pages: `page.tsx`, `layout.tsx`, `route.ts`
- Barrel exports: `index.ts` in component and lib directories

**Functions:**
- camelCase for all functions: `formatCurrency`, `hasPermission`, `fetchProposalPreview`
- Prefix with `handle` for event handlers: `handleSubmit`, `handleClick`
- Prefix with `is` or `has` for boolean returns: `isLoading`, `hasPermission`, `isAuthenticated`

**Variables:**
- camelCase for variables: `user`, `proposalId`, `htmlContent`
- UPPER_SNAKE_CASE for constants: `API_ENDPOINTS`, `CURRENCY_CONFIG`, `STORAGE_BUCKETS`
- No underscore prefix for private members

**Types:**
- PascalCase for interfaces: `User`, `Proposal`, `AuthContextValue`
- PascalCase for type aliases: `ProposalFilters`, `ApiResponse`
- Suffix with `Props` for component props: `ButtonProps`, `InputProps`, `HeaderProps`
- PascalCase for enums: `ProposalStatus`, `UserRole`, `Currency`

## Code Style

**Formatting:**
- 2-space indentation
- Single quotes for strings: `'text'`
- Semicolons required
- No explicit Prettier config (consistent manual style)

**Linting:**
- ESLint with `eslint-config-next` preset
- Run: `npm run lint`
- No custom rules beyond Next.js defaults

## Import Organization

**Order:**
1. React and Next.js imports: `import { useState } from 'react'`
2. External packages: `import { z } from 'zod'`
3. Internal modules with `@/` alias: `import { Button } from '@/components/ui'`
4. Relative imports: `import { helper } from './utils'`
5. Type imports last: `import type { User } from '@/types'`

**Grouping:**
- Blank line between groups
- Related imports together

**Path Aliases:**
- `@/` maps to `src/` (from `tsconfig.json`)

## Error Handling

**Patterns:**
- Throw errors with descriptive messages
- Catch at component boundaries (page level)
- Custom `ApiRequestError` class extends Error (`src/lib/api/client.ts`)
- try/catch for all async operations

**Error Types:**
- Throw on invalid API responses, network failures
- Return error state for UI display
- Log errors to console (should use structured logging in production)

## Logging

**Framework:**
- Console.log for debugging (temporary)
- Custom auth logger: `src/lib/utils/logger.ts`
- Levels: info for auth events

**Patterns:**
- Log state transitions (login, logout)
- Log errors with context
- Should minimize console.log for production

## Comments

**When to Comment:**
- Section headers with visual separators:
  ```typescript
  // ============================================================================
  // Types
  // ============================================================================
  ```
- Explain business logic and non-obvious code
- JSDoc for exported functions

**JSDoc/TSDoc:**
- Required for API service methods
- Optional for internal utilities
- Use `@param`, `@returns` tags

**TODO Comments:**
- Format: `// TODO: description`
- Used for planned features: Google sign-in, password reset

## Function Design

**Size:**
- Keep under 50 lines when possible
- Extract helpers for complex logic
- Some large components exist (ProposalForm.tsx 1093 lines - needs refactoring)

**Parameters:**
- Max 3 parameters preferred
- Use options object for more: `function create(options: CreateOptions)`
- Destructure in parameter list: `function process({ id, name }: Props)`

**Return Values:**
- Explicit return statements
- Return early for guard clauses
- Typed return values with `Promise<ApiResponse<T>>`

## Module Design

**Exports:**
- Named exports preferred: `export const proposalsApi = { ... }`
- Default exports for React components
- Barrel files re-export public API: `src/components/ui/index.ts`

**Barrel Files:**
- `index.ts` in `src/components/ui/` exports all UI components
- `src/lib/api/index.ts` exports all API services
- Avoid circular dependencies

## Component Patterns

**React Components:**
- Functional components only (no class components)
- `forwardRef` for UI primitives that need ref access
- `displayName` set on forwardRef components

**Client vs Server:**
- `'use client'` directive for interactive components
- Server Components by default in App Router
- Suspense boundaries for async data

**Props:**
- TypeScript interfaces for all props
- Variant patterns for styling options:
  ```typescript
  interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
  }
  ```

## State Management

**Patterns:**
- React Context for global state (auth, sidebar)
- useState for component-local state
- No external state libraries

**Context Structure:**
- Provider wraps app in layout
- Custom hook exports: `useAuth()`, `useSidebar()`
- Type-safe context values

---

*Convention analysis: 2026-01-14*
*Update when patterns change*
