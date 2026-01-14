# Codebase Structure

**Analysis Date:** 2026-01-14

## Directory Layout

```
Proposal-Product/
├── src/                    # Source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── lib/               # Business logic & utilities
│   ├── types/             # TypeScript type definitions
│   ├── contexts/          # React Context providers
│   ├── constants/         # App constants
│   └── middleware.ts      # Route protection
├── public/                # Static assets
├── .planning/             # Planning documents
├── Dockerfile             # Container configuration
├── docker-compose*.yml    # Orchestration configs
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind CSS config
└── next.config.js         # Next.js config
```

## Directory Purposes

**src/app/**
- Purpose: Next.js App Router pages and API routes
- Contains: Page components, layouts, route handlers
- Key files: `layout.tsx`, `page.tsx`, `middleware.ts`
- Subdirectories:
  - `(auth)/` - Public auth pages (login, register)
  - `(dashboard)/` - Protected dashboard pages
  - `api/auth/` - Auth API routes

**src/components/**
- Purpose: Reusable React components
- Contains: UI primitives and feature components
- Key files: `ui/index.ts` (barrel export)
- Subdirectories:
  - `ui/` - Reusable UI components (Button, Input, Modal, etc.)
  - `layout/` - Layout components (Header, Sidebar)
  - `forms/` - Form components (ProposalForm)
  - `proposals/` - Proposal-specific components

**src/lib/**
- Purpose: Business logic, utilities, and integrations
- Contains: API clients, auth utils, validation schemas
- Key files: `jwt-auth.ts`, `api/client.ts`
- Subdirectories:
  - `api/` - API client and service modules
  - `auth/` - Authentication utilities
  - `validations/` - Zod validation schemas
  - `storage/` - Supabase storage operations
  - `utils/` - Helper functions

**src/types/**
- Purpose: TypeScript type definitions
- Contains: All shared types and interfaces
- Key files: `index.ts` (User, Proposal, Auth types, enums)

**src/contexts/**
- Purpose: React Context providers for global state
- Contains: Auth, navigation, and UI contexts
- Key files: `AuthContext.tsx`, `SidebarContext.tsx`

**src/constants/**
- Purpose: Application constants and configuration
- Contains: API endpoints, role configs, status transitions
- Key files: `index.ts`

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx` - Root layout with AuthLayoutWrapper
- `src/app/page.tsx` - Home page
- `src/middleware.ts` - Route protection middleware

**Configuration:**
- `tsconfig.json` - TypeScript with `@/*` path alias
- `tailwind.config.ts` - Custom color schemes
- `next.config.js` - CORS headers configuration
- `.env` - Environment variables (not committed)

**Core Logic:**
- `src/lib/api/client.ts` - HTTP client with error handling
- `src/lib/jwt-auth.ts` - JWT decode/validate utilities
- `src/contexts/AuthContext.tsx` - Global auth state
- `src/lib/api/proposals.ts` - Proposal CRUD operations

**Testing:**
- Not configured - No test files present

**Documentation:**
- `README.md` - Project overview and setup guide

## Naming Conventions

**Files:**
- PascalCase for components: `Button.tsx`, `ProposalForm.tsx`
- kebab-case for utilities: `jwt-auth.ts`
- lowercase for pages: `page.tsx`, `layout.tsx`
- lowercase for API routes: `route.ts`

**Directories:**
- lowercase with hyphens: `src/lib/api/`
- Route groups in parentheses: `(auth)`, `(dashboard)`
- Plural for collections: `components/`, `contexts/`

**Special Patterns:**
- `index.ts` for barrel exports
- `[id]` for dynamic route segments
- `*.test.ts` for tests (not yet implemented)

## Where to Add New Code

**New Feature:**
- Primary code: `src/app/(dashboard)/{feature}/`
- Components: `src/components/{feature}/`
- API service: `src/lib/api/{feature}.ts`
- Types: Add to `src/types/index.ts`

**New Component/Module:**
- UI primitive: `src/components/ui/{Component}.tsx`
- Feature component: `src/components/{feature}/{Component}.tsx`
- Page component: `src/app/(dashboard)/{feature}/components/{Component}.tsx`

**New Route/Command:**
- Page: `src/app/(dashboard)/{route}/page.tsx`
- API route: `src/app/api/{route}/route.ts`
- Layout: `src/app/(dashboard)/{route}/layout.tsx`

**Utilities:**
- Shared helpers: `src/lib/utils/`
- Type definitions: `src/types/index.ts`
- Constants: `src/constants/index.ts`
- Validation schemas: `src/lib/validations/{domain}.ts`

## Special Directories

**.planning/**
- Purpose: Planning and documentation files
- Source: Created by planning workflows
- Committed: Yes

**public/**
- Purpose: Static assets (images, fonts)
- Source: Manual placement
- Committed: Yes

**node_modules/**
- Purpose: npm dependencies
- Source: `npm install`
- Committed: No (gitignored)

**.next/**
- Purpose: Next.js build output
- Source: `npm run build`
- Committed: No (gitignored)

---

*Structure analysis: 2026-01-14*
*Update when directory structure changes*
