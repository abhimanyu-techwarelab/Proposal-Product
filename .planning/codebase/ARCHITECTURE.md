# Architecture

**Analysis Date:** 2026-01-16

## Pattern Overview

**Overall:** Next.js 16 App Router SaaS Frontend Application

**Key Characteristics:**
- Client-side SaaS frontend with separate backend API
- Layered monolithic architecture with clear separation of concerns
- Feature-based folder structure (proposals, roles, users, approvals, dashboard)
- Server-first design with React Server Components and Client Components
- Multi-tenant organization-scoped data isolation

## Layers

**Presentation Layer:**
- Purpose: UI rendering, user interaction, route handling
- Contains: Page components, UI components, forms, layouts
- Location: `src/app/*`, `src/components/*`
- Depends on: State management (contexts), API services
- Used by: End users via browser

**State Management Layer:**
- Purpose: Client-side application state, authentication state, UI state
- Contains: React Context providers, custom hooks
- Location: `src/contexts/*`, custom hooks in components
- Depends on: API services for data fetching
- Used by: Presentation layer components

**Service/API Layer:**
- Purpose: HTTP communication with backend API, data fetching
- Contains: API client, service modules (proposals, users, roles, auth, etc.)
- Location: `src/lib/api/*`
- Depends on: Auth utilities (JWT), type definitions
- Used by: Page components, contexts, server components

**Data Validation & Types:**
- Purpose: Input validation, type safety
- Contains: Zod schemas, TypeScript interfaces/enums
- Location: `src/lib/validations/*`, `src/types/*`
- Depends on: None (foundational layer)
- Used by: Forms, API services, components

**Utilities & Constants:**
- Purpose: Shared helper functions, configuration constants
- Contains: Formatting utilities, logger, JWT helpers, constants
- Location: `src/lib/utils/*`, `src/constants/*`
- Depends on: Types
- Used by: All layers

## Data Flow

**Authentication Flow:**

1. User submits credentials at `/login` or `/register` page
2. Form submission calls `src/app/api/auth/login/route.ts` (Next.js API route)
3. API route forwards request to backend API at `NEXT_PUBLIC_API_URL`
4. Backend returns JWT token
5. Token stored in HTTP-only cookie `product_auth_token`
6. Subsequent requests auto-include cookie via `credentials: 'include'`
7. Client-side JWT decoded (no verification) via `src/lib/jwt-auth.ts`

**Proposal CRUD Flow:**

1. Page component renders (e.g., `src/app/(dashboard)/proposals/page.tsx`)
2. Component calls service method: `proposalsApi.list()` from `src/lib/api/proposals.ts`
3. Service calls `apiClient.get()` from `src/lib/api/client.ts`
4. Client fetches auth token from `/api/auth/token` endpoint
5. Request sent to backend with `Authorization: Bearer {token}` header
6. Response validated against TypeScript types from `src/types/index.ts`
7. Data bound to React state and rendered in component

**Server Component Data Flow:**

1. Server component calls `serverFetch()` from `src/lib/api/client.ts`
2. Access token passed explicitly (from `src/lib/auth/server.ts`)
3. Uses Next.js revalidation tags for ISR cache control
4. Data rendered server-side before sending to client

**State Management:**
- Context-based for authentication and UI state
- `AuthContext` provides user state, permissions, authentication methods
- `SidebarContext` manages sidebar toggle state
- `AuthNavigationContext` handles auth page-specific navigation

## Key Abstractions

**API Client** (`src/lib/api/client.ts`):
- Purpose: Generic HTTP request wrapper with error handling
- Pattern: Singleton-like exports (`apiClient`, `serverFetch`)
- Methods: `get()`, `post()`, `put()`, `patch()`, `delete()`
- Error handling: Custom `ApiRequestError` class with status codes

**Service Modules** (`src/lib/api/*.ts`):
- Purpose: Endpoint-specific API wrappers
- Examples: `proposalsApi`, `usersApi`, `rolesApi`, `authApi`, `dashboardApi`
- Pattern: Object with CRUD methods (`list`, `getById`, `create`, `update`, `delete`)
- Type safety: Generic `ApiResponse<T>` wrapper

**Authentication** (`src/lib/auth/server.ts`, `src/lib/jwt-auth.ts`):
- Purpose: JWT token management, session handling, permission checking
- Server-side: `requireRole()`, `requireApprovalRole()`, `getSession()`, `hasPermission()`
- Client-side: `decodeJWT()`, `getTokenFromCookies()`, `isTokenValid()`, `canUserApprove()`
- Pattern: Functional utilities with jose library for JWT operations

**Validation** (`src/lib/validations/*.ts`):
- Purpose: Form input validation with Zod schemas
- Examples: `loginSchema`, `proposalSchema`, `deliverableSchema`, `teamMemberSchema`
- Pattern: Zod schema definitions with type inference via `z.infer<typeof schema>`
- Custom refinements for complex validation logic

**Contexts** (`src/contexts/*.tsx`):
- Purpose: Global client-side state management
- Examples: `AuthContext`, `SidebarContext`, `AuthNavigationContext`
- Pattern: Context + Provider + custom hook (`useAuth`, `useSidebar`)
- State: User data, authentication status, permissions, UI state

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page render
- Responsibilities: Global HTML structure, metadata, CSS imports, `AuthLayoutWrapper`

**Dashboard Layout:**
- Location: `src/app/(dashboard)/layout.tsx`
- Triggers: Dashboard route access
- Responsibilities: `AuthProvider`, `SidebarProvider`, sidebar rendering, pulse beam animations

**Auth Pages:**
- Location: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`
- Triggers: User navigates to `/login` or `/register`
- Responsibilities: Render auth forms, handle login/register submission

**API Routes:**
- Location: `src/app/api/auth/*/route.ts`
- Triggers: Client-side API requests to `/api/auth/*`
- Responsibilities: Server-side auth operations (login, logout, token retrieval, user info)

**Development Server:**
- Command: `npm run dev` (starts Next.js with Turbopack on port 82)
- Entry: Next.js dev server bootstraps application

## Error Handling

**Strategy:** Exception-based with centralized error classes

**Patterns:**
- API errors throw `ApiRequestError` with status code and message
- Client components catch errors and display user-friendly messages
- Server components handle errors via Next.js error boundaries
- 401 responses trigger automatic redirect to `/login`

## Cross-Cutting Concerns

**Logging:**
- Custom logger utility: `src/lib/utils/logger.ts`
- Auth events: loginSuccess, loginFailure, registerSuccess, registerFailure, logout
- Console-based (development), no centralized logging in production

**Validation:**
- Zod schemas at form boundary: `src/lib/validations/*.ts`
- TypeScript for compile-time type safety
- Runtime validation in API client before sending requests

**Authentication:**
- JWT tokens in HTTP-only cookies
- Token retrieval via `/api/auth/token` for client-side use
- Role-based access control: `requireRole()`, `hasPermission()`
- Permission checking: `canUserApprove()` based on role

**Authorization:**
- Role-based: SUPER_ADMIN, ADMIN, MANAGER, MEMBER, VIEWER
- Permission-based: Permission keys checked via `hasPermission()`
- Organization-scoped: All data filtered by `organization_id`

---

*Architecture analysis: 2026-01-16*
*Update when major patterns change*
