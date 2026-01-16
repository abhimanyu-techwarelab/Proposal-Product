# Codebase Structure

**Analysis Date:** 2026-01-16

## Directory Layout

```
Proposal-Product/
├── src/
│   ├── app/                    # Next.js App Router structure
│   ├── components/             # React components
│   ├── lib/                    # Business logic and utilities
│   ├── contexts/               # React Context providers
│   ├── types/                  # TypeScript type definitions
│   ├── constants/              # Application constants
│   └── middleware.ts           # (Future) Route protection
├── public/                     # Static assets
├── .planning/                  # Project planning documents
├── docs/                       # Documentation
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── next.config.js              # Next.js configuration
├── eslint.config.mjs           # ESLint configuration
├── postcss.config.js           # PostCSS configuration
└── README.md                   # Project documentation
```

## Directory Purposes

**src/app/**
- Purpose: Next.js App Router pages and API routes
- Contains: Page components (page.tsx), layouts (layout.tsx), API routes (route.ts)
- Key files: Root layout, auth pages, dashboard pages, API endpoints
- Subdirectories:
  - `(auth)/` - Route group for authentication pages (login, register)
  - `(dashboard)/` - Route group for protected dashboard routes
  - `api/` - Next.js API routes (auth endpoints)

**src/components/**
- Purpose: Reusable React components
- Contains: UI components, forms, layout components, feature-specific components
- Key files: Button, Input, Modal, Card, Table, Badge, etc.
- Subdirectories:
  - `ui/` - Atomic UI components (buttons, inputs, modals)
  - `layout/` - Layout components (sidebar, header, navigation)
  - `forms/` - Form components (ProposalForm, etc.)
  - `proposals/` - Proposal-specific components
  - `templates/` - Template selection/preview components

**src/lib/**
- Purpose: Business logic, utilities, and helper functions
- Contains: API client, auth utilities, validation schemas, storage, utils
- Key files: API client, JWT auth, Zod schemas, logger
- Subdirectories:
  - `api/` - API client and service modules
  - `auth/` - Authentication utilities (server-side and client-side)
  - `validations/` - Zod validation schemas
  - `storage/` - File upload/download utilities for Supabase Storage
  - `utils/` - General utility functions

**src/contexts/**
- Purpose: React Context API providers for global state
- Contains: AuthContext, SidebarContext, AuthNavigationContext
- Key files: Context definitions and custom hooks
- Subdirectories: None (flat structure)

**src/types/**
- Purpose: TypeScript type definitions and interfaces
- Contains: Enums, interfaces, type aliases
- Key files: `index.ts` - All type definitions (Proposal, User, Role, Permission, etc.)
- Subdirectories: None (flat structure)

**src/constants/**
- Purpose: Application-wide constants and configuration
- Contains: API endpoints, validation rules, role configurations
- Key files: `index.ts` - Constants for API endpoints, approval roles, status configs
- Subdirectories: None (flat structure)

**.planning/**
- Purpose: Project planning and documentation
- Contains: Codebase maps (this document)
- Subdirectories: `codebase/` - Codebase analysis documents

**docs/**
- Purpose: Project documentation
- Contains: API contracts, future extensions, planning docs
- Key files: `api-contracts.md`, `future-extensions.md`

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx` - Root layout with global setup
- `src/app/(dashboard)/layout.tsx` - Dashboard layout with auth providers
- `src/app/(auth)/login/page.tsx` - Login page
- `src/app/(auth)/register/page.tsx` - Registration page
- `src/app/(dashboard)/dashboard/page.tsx` - Main dashboard page

**Configuration:**
- `tsconfig.json` - TypeScript configuration (strict mode, path alias `@/*`)
- `next.config.js` - Next.js configuration (CORS headers)
- `tailwind.config.ts` - Tailwind CSS custom theme
- `eslint.config.mjs` - ESLint with Next.js preset
- `postcss.config.js` - PostCSS with Tailwind + autoprefixer
- `.env.example` - Environment variable template

**Core Logic:**
- `src/lib/api/client.ts` - HTTP client with error handling
- `src/lib/api/proposals.ts` - Proposal service (CRUD operations)
- `src/lib/api/auth.ts` - Supabase auth service
- `src/lib/auth/server.ts` - Server-side auth utilities
- `src/lib/jwt-auth.ts` - JWT token management
- `src/contexts/AuthContext.tsx` - Authentication context and hook

**Testing:**
- Not detected - No test files or configuration

**Documentation:**
- `README.md` - Project overview and setup instructions
- `docs/api-contracts.md` - Backend API documentation
- `docs/future-extensions.md` - Planned features

## Naming Conventions

**Files:**
- `page.tsx` - Next.js page components (Next.js convention)
- `route.ts` - Next.js API routes (Next.js convention)
- `layout.tsx` - Next.js layouts (Next.js convention)
- `PascalCase.tsx` - React components (e.g., `Button.tsx`, `ProposalForm.tsx`)
- `camelCase.ts` - Utility files, modules (e.g., `jwt-auth.ts`, `logger.ts`)
- `index.ts` - Barrel exports for directory public APIs

**Directories:**
- `kebab-case` - All directories (e.g., `app-router`, `auth-pages`)
- `(route-group)` - Next.js route groups with parentheses (e.g., `(auth)`, `(dashboard)`)
- Plural for collections - `components/`, `contexts/`, `types/`
- Singular for modules - `lib/api/proposals.ts` (handles multiple operations)

**Special Patterns:**
- Route groups: `(auth)`, `(dashboard)` - Organize routes without affecting URL
- Barrel exports: `index.ts` files for clean imports
- Path alias: `@/*` maps to `./src/*` for absolute imports

## Where to Add New Code

**New Feature (e.g., invoices):**
- Primary code: `src/app/(dashboard)/invoices/page.tsx`, `src/components/invoices/`
- Service: `src/lib/api/invoices.ts`
- Types: Add to `src/types/index.ts`
- Validation: `src/lib/validations/invoice.ts`
- Tests: (Not currently set up)

**New Component/Module:**
- Implementation: `src/components/ui/` for reusable UI, `src/components/{feature}/` for feature-specific
- Types: Add interfaces to `src/types/index.ts` or component file
- Tests: (Not currently set up)

**New Route/Page:**
- Definition: `src/app/(dashboard)/{route}/page.tsx` for protected routes
- Layout: Use existing `src/app/(dashboard)/layout.tsx` or create nested layout
- API route: `src/app/api/{route}/route.ts` for server-side endpoints

**New Service/API Integration:**
- Service: `src/lib/api/{service}.ts` with methods like `list()`, `getById()`, `create()`, etc.
- Client integration: Use `apiClient` from `src/lib/api/client.ts`
- Types: Add response types to `src/types/index.ts`

**Utilities:**
- Shared helpers: `src/lib/utils/index.ts` or new file in `src/lib/utils/`
- Type definitions: `src/types/index.ts`
- Constants: `src/constants/index.ts`

**Context/State Management:**
- New context: `src/contexts/{Name}Context.tsx` with Provider and custom hook
- Pattern: Follow existing `AuthContext.tsx` or `SidebarContext.tsx` structure

## Special Directories

**.next/**
- Purpose: Next.js build output and cache
- Source: Generated by Next.js during build/dev
- Committed: No (in `.gitignore`)

**node_modules/**
- Purpose: npm dependencies
- Source: Installed by npm
- Committed: No (in `.gitignore`)

**.planning/**
- Purpose: Project planning and codebase documentation
- Source: Manual documentation
- Committed: Yes

**public/**
- Purpose: Static assets served directly
- Source: Manual uploads
- Committed: Yes (typically)

---

*Structure analysis: 2026-01-16*
*Update when directory structure changes*
