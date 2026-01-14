# Architecture

**Analysis Date:** 2026-01-14

## Pattern Overview

**Overall:** Multi-Tenant SaaS with Layered Architecture

**Key Characteristics:**
- Next.js App Router (Server + Client Components)
- API-first with JWT authentication
- Organization-scoped data isolation
- Role-based access control (RBAC)

## Layers

**Presentation Layer:**
- Purpose: UI rendering and user interaction
- Contains: React components, pages, layouts
- Location: `src/app/`, `src/components/`
- Depends on: API client layer, contexts
- Used by: End users via browser

**API Client Layer:**
- Purpose: HTTP communication with backend
- Contains: Typed API services, HTTP client wrapper
- Location: `src/lib/api/`
- Depends on: Auth tokens, constants
- Used by: Presentation layer components

**Authentication Layer:**
- Purpose: User identity and authorization
- Contains: JWT utilities, middleware, auth context
- Location: `src/lib/jwt-auth.ts`, `src/middleware.ts`, `src/contexts/AuthContext.tsx`
- Depends on: jose library, cookies
- Used by: All protected routes and API calls

**Business Logic Layer:**
- Purpose: Validation, formatting, utilities
- Contains: Zod schemas, utility functions, constants
- Location: `src/lib/validations/`, `src/lib/utils/`, `src/constants/`
- Depends on: Type definitions
- Used by: API client layer, presentation layer

**Data Layer:**
- Purpose: Direct database operations (Supabase)
- Contains: Supabase client, storage operations
- Location: `src/lib/api/supabaseClient.ts`, `src/lib/storage/`
- Depends on: Supabase SDK
- Used by: Auth operations, file uploads

## Data Flow

**Authentication Flow:**

1. User submits login form (`src/app/(auth)/login/page.tsx`)
2. AuthContext.login() calls `authApi.login()` (`src/lib/api/auth.ts`)
3. API client sends request to backend `/auth/login`
4. Backend returns JWT token
5. Token sent to `src/app/api/auth/login/route.ts`
6. Route sets HTTP-only cookie `product_auth_token`
7. Subsequent requests include token via `src/middleware.ts` validation

**Proposal Request Flow:**

1. User navigates to proposals (`src/app/(dashboard)/proposals/page.tsx`)
2. Component calls `proposalsApi.list()` (`src/lib/api/proposals.ts`)
3. `apiClient.get()` adds auth headers (`src/lib/api/client.ts`)
4. Middleware validates JWT token (`src/middleware.ts`)
5. Backend returns paginated proposal data
6. Component renders table with data

**State Management:**
- React Context for global state (auth, sidebar)
- Local useState for component state
- No external state library (Redux, Zustand)

## Key Abstractions

**API Service:**
- Purpose: Encapsulate domain-specific API operations
- Examples: `authApi`, `proposalsApi`, `usersApi`, `rolesApi`
- Location: `src/lib/api/*.ts`
- Pattern: Object with async methods returning typed responses

**Context Provider:**
- Purpose: Global state accessible across component tree
- Examples: `AuthContext`, `SidebarContext`, `AuthNavigationContext`
- Location: `src/contexts/`
- Pattern: React Context with custom hook (useAuth, useSidebar)

**Validation Schema:**
- Purpose: Runtime validation with type inference
- Examples: `loginSchema`, `proposalSchema`
- Location: `src/lib/validations/`
- Pattern: Zod schema with `z.infer<typeof schema>` for types

**UI Component:**
- Purpose: Reusable UI primitives
- Examples: Button, Input, Modal, Card, Table
- Location: `src/components/ui/`
- Pattern: forwardRef components with variant props

## Entry Points

**Application Root:**
- Location: `src/app/layout.tsx`
- Triggers: Every page render
- Responsibilities: Global HTML structure, AuthLayoutWrapper

**Authentication Entry:**
- Location: `src/app/(auth)/login/page.tsx`
- Triggers: Unauthenticated users
- Responsibilities: Login form, auth initiation

**Dashboard Entry:**
- Location: `src/app/(dashboard)/dashboard/page.tsx`
- Triggers: Authenticated users after login
- Responsibilities: Summary cards, recent proposals

**Middleware Entry:**
- Location: `src/middleware.ts`
- Triggers: Every request (configured routes)
- Responsibilities: Token validation, RBAC enforcement, redirects

## Error Handling

**Strategy:** Throw at boundary, catch in component

**Patterns:**
- Custom `ApiRequestError` class extends Error (`src/lib/api/client.ts`)
- try/catch in async operations
- Error state in components with user-friendly messages
- 401 responses trigger redirect to login

## Cross-Cutting Concerns

**Logging:**
- Auth logger utility: `src/lib/utils/logger.ts`
- Console.log throughout (should be reduced for production)

**Validation:**
- Zod schemas at form boundaries (`src/lib/validations/`)
- API response type checking via TypeScript

**Authentication:**
- JWT middleware on protected routes (`src/middleware.ts`)
- HTTP-only cookies for token storage
- Role hierarchy: SUPER_ADMIN > ADMIN > MANAGER > MEMBER > VIEWER

---

*Architecture analysis: 2026-01-14*
*Update when major patterns change*
