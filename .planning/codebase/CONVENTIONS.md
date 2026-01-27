# Coding Conventions

**Analysis Date:** 2026-01-27

## Naming Patterns

**Files:**
- PascalCase for components: `Button.tsx`, `ProposalForm.tsx`, `Header.tsx`
- kebab-case for utility components: `gradient-button.tsx`, `shader-lines.tsx`, `glitchy-404.tsx`
- camelCase for utilities/services: `client.ts`, `logger.ts`, `proposals.ts`
- `page.tsx` for Next.js pages
- `layout.tsx` for Next.js layouts
- `route.ts` for API route handlers
- `index.ts` for barrel exports

**Functions:**
- camelCase for all functions: `formatCurrency()`, `formatDate()`, `canApproveProposals()`
- No special prefix for async functions
- Verb-based naming: `getById()`, `create()`, `approve()`, `list()`
- Event handlers: `handleEventName` (e.g., `handleClick`, `handleSubmit`)

**Variables:**
- camelCase for variables: `userData`, `proposalList`, `statusVariant`
- UPPER_SNAKE_CASE for constants: `API_BASE_URL`, `CURRENCY_CONFIG`, `APPROVAL_ROLES`
- No underscore prefix for private members

**Types:**
- PascalCase for interfaces (no I prefix): `User`, `Proposal`, `ButtonProps`
- PascalCase for type aliases: `UserConfig`, `ResponseData`, `ButtonVariant`
- Enum names in PascalCase: `ProposalStatus`, `UserRole`, `Currency`
- Component props: `{ComponentName}Props` (e.g., `ButtonProps`, `InputProps`)

## Code Style

**Formatting:**
- 2-space indentation (standard Next.js)
- Single quotes for strings in TypeScript/JavaScript
- Double quotes in JSX attributes
- Semicolons used consistently
- Line breaks between logical sections
- Section dividers: `// ============================================================================`

**Linting:**
- ESLint 9.39.1 with flat config format (`eslint.config.mjs`)
- Extends Next.js core web vitals config
- Run: `npm run lint`
- Ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`

**TypeScript:**
- Strict mode enabled in `tsconfig.json`
- No implicit any
- Explicit return types for exported functions (recommended)
- Type definitions at file top in sections

## Import Organization

**Order:**
1. React imports
2. Next.js imports
3. UI/Component library imports (Radix UI, Lucide icons)
4. Local utility imports (sorted by path)
5. Type imports (if separate)

**Example:**
```typescript
import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn, appendCacheBust } from "@/lib/utils";
import { LayoutDashboard, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
```

**Path Aliases:**
- `@/*` maps to `./src/*` (defined in `tsconfig.json`)

## Error Handling

**Patterns:**
- Throw errors from services and utilities
- Catch at boundaries (route handlers, components)
- Custom error class: `ApiRequestError` - `src/lib/api/client.ts`
- Async functions use try/catch (no .catch() chains in modern code)

**Error Types:**
- Throw on invalid input, missing dependencies, API failures
- Custom error transformation: `ApiRequestError.fromApiError()`
- Include context in error messages

**Logging:**
- Console-based logging via `src/lib/utils/logger.ts`
- Structured logging with methods: `authLogger.loginSuccess()`, `authLogger.loginFailure()`
- Log at service boundaries, not in utilities
- Remove console statements before production (currently many present)

## Comments

**When to Comment:**
- Explain why, not what
- Document business logic and edge cases
- Complex algorithms or workarounds
- Section headers with dividers

**Section Headers:**
```typescript
// ============================================================================
// Types
// ============================================================================
```

**JSDoc/TSDoc:**
- Used for public API functions
```typescript
/**
 * Get paginated list of proposals with optional filters
 */
list: async (filters?: ProposalFilters) => { ... }
```

**TODO Comments:**
- Format: `// TODO: description`
- Many TODO comments present in codebase (see CONCERNS.md)

## Function Design

**Size:**
- Keep functions focused and under 50 lines (ideal)
- Extract helpers for complex logic
- Note: Some large components exist (ProposalForm: 2,516 lines - needs refactoring)

**Parameters:**
- Max 3 parameters (recommended)
- Use options object for 4+ parameters
- Destructure in parameter list: `function process({ id, name }: ProcessParams)`

**Return Values:**
- Explicit return statements
- Return early for guard clauses
- Generic type parameters for API calls: `get<T>()`, `post<T>()`

## Module Design

**Exports:**
- Named exports preferred
- Default exports for Next.js pages (required by framework)
- Barrel files for public APIs: `src/lib/api/index.ts`, `src/components/ui/index.ts`

**API Service Pattern:**
```typescript
export const proposalsApi = {
  list: async (filters) => { ... },
  getById: async (id) => { ... },
  create: async (data) => { ... },
  // ... other methods
}
```

**Component Patterns:**
- Functional components (no React.FC)
- ForwardRef for form components: `React.forwardRef<HTMLInputElement, InputProps>()`
- Display names: `Button.displayName = 'Button'`
- `"use client"` directive for interactive components
- Props spreading with destructuring: `{ className, variant = 'primary', ...props }`

**Validation:**
- Zod schemas for validation: `z.object()`, `z.string().min()`
- Type inference: `type LoginInput = z.infer<typeof loginSchema>`
- Schemas in `src/lib/validations/`

---

*Convention analysis: 2026-01-27*
*Update when patterns change*
