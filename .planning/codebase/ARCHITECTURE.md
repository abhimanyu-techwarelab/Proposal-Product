# Architecture

**Analysis Date:** 2026-01-27

## Pattern Overview

**Overall:** Next.js Full-Stack SaaS Application with Layered Architecture

**Key Characteristics:**
- Frontend-focused Next.js application bridging to separate backend API
- Multi-tenant SaaS platform (proposal generation system)
- Server Components for data fetching, Client Components for interactivity
- JWT-based authentication with HTTP-only cookies
- File storage via Supabase

## Layers

**Presentation Layer:**
- Purpose: UI rendering and user interaction
- Contains: React components, pages, forms, layouts
- Location: `src/components/`, `src/app/`
- Depends on: Service layer for data, Context for global state
- Used by: End users via browser

**Page/Route Layer:**
- Purpose: Next.js App Router pages and API routes
- Contains: Server Components (pages), Client Components (interactive), API route handlers
- Location: `src/app/(auth)/*`, `src/app/(dashboard)/*`, `src/app/api/*`
- Depends on: Service layer, Auth utilities
- Used by: Next.js router

**Service/API Layer:**
- Purpose: Business logic and backend communication
- Contains: API clients (proposals, auth, users, roles, templates, subscriptions, permissions, dashboard)
- Location: `src/lib/api/*.ts`
- Depends on: HTTP client (`src/lib/api/client.ts`), Auth utilities
- Used by: Pages and components

**HTTP Client Layer:**
- Purpose: Standardized HTTP communication with backend API
- Contains: `apiClient` (client-side), `serverFetch` (server-side)
- Location: `src/lib/api/client.ts`
- Depends on: Auth utilities for token retrieval
- Used by: Service layer

**Authentication Layer:**
- Purpose: JWT verification, session management, permission checks
- Contains: Token verification, session extraction, auth guards
- Location: `src/lib/auth/server.ts`, `src/lib/jwt-auth.ts`
- Depends on: jose library, cookies
- Used by: API routes, service layer, page guards

**Utility Layer:**
- Purpose: Shared helpers and cross-cutting concerns
- Contains: Storage (Supabase), logging, validation (Zod schemas), general utils
- Location: `src/lib/storage/`, `src/lib/utils/`, `src/lib/validations/`
- Depends on: External libraries (Supabase, Zod)
- Used by: Service layer, components

**State Management:**
- Purpose: Global application state
- Contains: React Context providers (Auth, Sidebar, Navigation)
- Location: `src/contexts/`
- Depends on: Service layer for data operations
- Used by: Components via hooks

## Data Flow

**Proposal Viewing Flow (Server-Side):**

1. User navigates to `/dashboard/proposals`
2. Next.js loads `src/app/(dashboard)/proposals/page.tsx` (Server Component)
3. Server Component calls `proposalsServerApi.list()` from `src/lib/api/proposals.ts`
4. `serverFetch()` in `src/lib/api/client.ts` makes authenticated request to backend API
5. Backend returns proposal data
6. Server Component renders `ProposalsTable` with data
7. HTML sent to browser

**Form Submission Flow (Client-Side):**

1. User fills form in Client Component (e.g., `ProposalForm`)
2. Form handler calls `apiClient.post()` from `src/lib/api/client.ts`
3. Client fetches auth token from `/api/auth/token` route
4. Request sent to backend API with Authorization header
5. Backend validates, processes, and responds
6. Component updates state and re-renders

**Authentication Flow:**

1. User submits login form at `/login`
2. Form calls `src/app/api/auth/login/route.ts` API route
3. API route proxies to backend `/auth/login`
4. Backend validates credentials, returns JWT tokens
5. API route sets HTTP-only cookies (`product_auth_token`, `proposal_access_token`)
6. User redirected to `/dashboard`
7. AuthGuard component verifies token on protected routes

**State Management:**
- JWT tokens stored in HTTP-only cookies (secure, not accessible via JavaScript)
- User/session state managed via `AuthContext` (React Context)
- UI state (sidebar) managed via `SidebarContext`
- No global state library (Redux, Zustand) - uses React Context

## Key Abstractions

**API Service Objects:**
- Purpose: Domain-specific API operations
- Examples: `proposalsApi`, `usersApi`, `rolesApi`, `templatesApi`, `subscriptionsApi`
- Pattern: Object with methods (list, getById, create, update, delete, + domain-specific)
- Location: `src/lib/api/*.ts`, exported via `src/lib/api/index.ts`

**HTTP Client:**
- Purpose: Standardized request handling with auth and error management
- Examples: `apiClient.get<T>()`, `apiClient.post<T>()`, `serverFetch<T>()`
- Pattern: Generic type parameters, automatic token injection, error transformation
- Location: `src/lib/api/client.ts`

**Auth Guards:**
- Purpose: Protect routes and verify permissions
- Examples: `AuthGuard` component, `requireAuth()` utility, `hasPermission()`
- Pattern: HOC/wrapper component, server-side middleware functions
- Location: `src/components/AuthLayoutWrapper.tsx`, `src/lib/auth/server.ts`

**Context Providers:**
- Purpose: Global state distribution
- Examples: `AuthProvider`, `SidebarProvider`, `AuthNavigationProvider`
- Pattern: React Context with custom hooks (`useAuth()`, `useSidebar()`)
- Location: `src/contexts/*.tsx`

**Validation Schemas:**
- Purpose: Input validation and type inference
- Examples: `loginSchema`, `proposalSchema`, Zod schemas
- Pattern: Zod schema definitions with `z.infer<>` for TypeScript types
- Location: `src/lib/validations/*.ts`

## Entry Points

**Root Application:**
- Location: `src/app/layout.tsx`
- Triggers: Initial page load
- Responsibilities: Set metadata, wrap with `AuthLayoutWrapper`, load global styles

**Dashboard Entry:**
- Location: `src/app/(dashboard)/layout.tsx`
- Triggers: Any `/dashboard/*` route
- Responsibilities: Wrap with `AuthProvider`, `AuthGuard`, `SidebarProvider`, render sidebar + main content

**Authentication Entry:**
- Location: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`
- Triggers: User navigates to `/login` or `/register`
- Responsibilities: Render auth forms, handle submission to `/api/auth/*` routes

**API Middleware:**
- Location: `src/app/api/auth/*/route.ts`, `src/app/api/users/*/route.ts`, etc.
- Triggers: Client-side fetch or server-side calls
- Responsibilities: Bridge to backend API, manage cookies, handle errors

## Error Handling

**Strategy:** Centralized error handling with custom error class, bubble to boundaries

**Patterns:**
- HTTP client catches and transforms errors into `ApiRequestError` - `src/lib/api/client.ts`
- API routes return standardized error responses (status code + message)
- Components display error messages from caught errors
- Server Components handle errors with Next.js error boundaries (when configured)
- 401 responses trigger redirect to `/login`

## Cross-Cutting Concerns

**Logging:**
- Console-based logging with structured output
- Auth events logged via `src/lib/utils/logger.ts`
- Format: `authLogger.loginSuccess()`, `authLogger.loginFailure()`, etc.

**Validation:**
- Zod schemas at API boundaries - `src/lib/validations/`
- Type-safe validation with `z.infer<typeof schema>`
- Schemas for auth, proposals, forms

**Authentication:**
- JWT tokens in HTTP-only cookies
- Server-side verification on protected routes
- Permission checks via `hasPermission()` utility
- Token refresh mechanism (via backend)

**File Storage:**
- Supabase Storage integration - `src/lib/storage/index.ts`
- Signed URLs for secure file access (1 hour expiration)
- Upload/delete operations with error handling

---

*Architecture analysis: 2026-01-27*
*Update when major patterns change*
