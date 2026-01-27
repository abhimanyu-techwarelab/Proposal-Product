# Codebase Structure

**Analysis Date:** 2026-01-27

## Directory Layout

```
Proposal-Product/
├── src/
│   ├── app/                    # Next.js App Router (pages + API routes)
│   │   ├── (auth)/            # Auth route group (login, register)
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   └── api/               # API route handlers
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components
│   │   ├── layout/            # Layout components (Sidebar, Header)
│   │   ├── proposals/         # Proposal-specific components
│   │   ├── templates/         # Template components
│   │   └── forms/             # Complex forms
│   ├── lib/                   # Core utilities & business logic
│   │   ├── api/               # API service layer
│   │   ├── auth/              # Authentication utilities
│   │   ├── storage/           # File storage (Supabase)
│   │   ├── utils/             # General utilities
│   │   └── validations/       # Zod validation schemas
│   ├── contexts/              # React Context providers
│   ├── types/                 # TypeScript type definitions
│   └── constants/             # Global constants
├── public/                    # Static assets
├── .next/                     # Next.js build output (gitignored)
├── Dockerfile                 # Container definition
├── docker-compose*.yml        # Docker orchestration
├── package.json               # Project manifest
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS config
├── next.config.js             # Next.js configuration
└── eslint.config.mjs          # ESLint configuration
```

## Directory Purposes

**src/app/**
- Purpose: Next.js App Router (file-based routing)
- Contains: Pages, layouts, API routes
- Key files: `layout.tsx` (root), `page.tsx` (home)
- Subdirectories:
  - `(auth)/` - Authentication pages (login, register)
  - `(dashboard)/` - Protected dashboard pages
  - `api/` - Next.js API route handlers

**src/app/(auth)/**
- Purpose: Authentication flow pages
- Contains: Login, register pages with minimal layout
- Key files: `layout.tsx`, `login/page.tsx`, `register/page.tsx`
- Subdirectories: None (flat structure)

**src/app/(dashboard)/**
- Purpose: Protected application pages
- Contains: Dashboard home, proposals, approvals, users, roles, settings
- Key files: `layout.tsx` (with AuthGuard), `dashboard/page.tsx`
- Subdirectories: `dashboard/`, `proposals/`, `approvals/`, `users/`, `roles/`, `settings/`

**src/app/api/**
- Purpose: Next.js API routes (middleware layer)
- Contains: Route handlers for auth, users, organizations, storage
- Key files: `auth/login/route.ts`, `auth/logout/route.ts`, `auth/me/route.ts`, `auth/token/route.ts`
- Subdirectories: `auth/`, `users/`, `organizations/`, `storage/`

**src/components/**
- Purpose: Reusable React components
- Contains: UI primitives, layouts, feature components
- Key files: `AuthLayoutWrapper.tsx`
- Subdirectories: `ui/`, `layout/`, `proposals/`, `templates/`, `forms/`

**src/components/ui/**
- Purpose: Base UI component library
- Contains: Button, Input, Modal, Card, Table components (Radix UI + Tailwind)
- Key files: `Button.tsx`, `signup.tsx`, `login.tsx`, `gradient-button.tsx`
- Subdirectories: None

**src/components/layout/**
- Purpose: Layout and navigation components
- Contains: Sidebar, Header, PageHeader
- Key files: `Sidebar.tsx`, `Header.tsx`, `PageHeader.tsx`
- Subdirectories: None

**src/components/forms/**
- Purpose: Complex form components
- Contains: ProposalForm and other multi-field forms
- Key files: `ProposalForm.tsx` (2,516 lines - needs refactoring)
- Subdirectories: None

**src/lib/api/**
- Purpose: API service layer (backend communication)
- Contains: Domain-specific API clients, HTTP client
- Key files: `client.ts` (HTTP wrapper), `proposals.ts`, `auth.ts`, `users.ts`, `roles.ts`, `templates.ts`, `subscriptions.ts`, `permissions.ts`, `dashboard.ts`, `supabaseClient.ts`, `index.ts` (unified exports)
- Subdirectories: None

**src/lib/auth/**
- Purpose: Authentication and authorization utilities
- Contains: JWT verification, session management, auth guards
- Key files: `server.ts` (verifyToken, getServerSession, requireAuth, hasPermission)
- Subdirectories: None

**src/lib/storage/**
- Purpose: File storage operations (Supabase)
- Contains: Upload, delete, signed URL generation
- Key files: `index.ts`
- Subdirectories: None

**src/lib/utils/**
- Purpose: General utility functions
- Contains: Formatting, logging, helpers
- Key files: `logger.ts`, `index.ts`
- Subdirectories: None

**src/lib/validations/**
- Purpose: Zod validation schemas
- Contains: Input validation for forms and API
- Key files: `auth.ts`, `proposal.ts`, `index.ts`
- Subdirectories: None

**src/contexts/**
- Purpose: React Context providers for global state
- Contains: Auth, Sidebar, Navigation contexts
- Key files: `AuthContext.tsx`, `SidebarContext.tsx`, `AuthNavigationContext.tsx`
- Subdirectories: None

**src/types/**
- Purpose: Centralized TypeScript type definitions
- Contains: All domain types (User, Proposal, Organization, etc.)
- Key files: `index.ts`
- Subdirectories: None

**src/constants/**
- Purpose: Global constants and configuration
- Contains: API endpoints, status configs, validation rules
- Key files: `index.ts`
- Subdirectories: None

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx` - Root layout with metadata
- `src/app/page.tsx` - Home page (redirects to /dashboard)
- `src/app/(dashboard)/layout.tsx` - Dashboard layout with auth guards
- `src/app/(auth)/login/page.tsx` - Login page

**Configuration:**
- `next.config.js` - Next.js configuration (CORS, image optimization)
- `tsconfig.json` - TypeScript config (strict mode, path aliases)
- `tailwind.config.ts` - Tailwind CSS theme
- `eslint.config.mjs` - ESLint flat config
- `.env.example` - Environment variable template
- `.env.docker.example` - Docker environment template

**Core Logic:**
- `src/lib/api/` - All backend communication
- `src/lib/auth/server.ts` - Authentication/authorization
- `src/lib/storage/index.ts` - File storage operations
- `src/lib/validations/` - Input validation

**Testing:**
- No test files detected (testing not configured)

**Documentation:**
- `README.md` - Project documentation

## Naming Conventions

**Files:**
- `page.tsx` - Next.js pages
- `layout.tsx` - Next.js layouts
- `route.ts` - API route handlers
- `PascalCase.tsx` - React components (Button, Card, Header)
- `kebab-case.tsx` - Special effect/utility components (gradient-button, shader-lines)
- `camelCase.ts` - Utilities and services (client, logger, proposals)
- `index.ts` - Barrel exports

**Directories:**
- `kebab-case` - Standard directories (src, lib, components)
- `(group)` - Next.js route groups ((auth), (dashboard))
- Plural for collections - `components/`, `contexts/`, `types/`

**Special Patterns:**
- `index.ts` - Barrel exports for public API
- `*.tsx` - React components
- `*.ts` - TypeScript modules
- `route.ts` - API route handlers in `src/app/api/`

## Where to Add New Code

**New Page:**
- Primary code: `src/app/(dashboard)/{page-name}/page.tsx`
- Layout (if needed): `src/app/(dashboard)/{page-name}/layout.tsx`
- Components: `src/components/{feature}/`

**New Component:**
- UI primitive: `src/components/ui/{ComponentName}.tsx`
- Feature component: `src/components/{feature}/{ComponentName}.tsx`
- Export from: `src/components/{category}/index.ts`

**New API Endpoint:**
- Route handler: `src/app/api/{resource}/route.ts` or `src/app/api/{resource}/{action}/route.ts`
- Service client: `src/lib/api/{resource}.ts`
- Export from: `src/lib/api/index.ts`

**New API Service:**
- Implementation: `src/lib/api/{resource}.ts`
- Export as object: `export const {resource}Api = { ... }`
- Add to: `src/lib/api/index.ts`

**New Validation Schema:**
- Implementation: `src/lib/validations/{domain}.ts`
- Export from: `src/lib/validations/index.ts`

**New Utility:**
- Shared helpers: `src/lib/utils/index.ts`
- Domain-specific: `src/lib/{domain}/{utility}.ts`

**New Type:**
- Add to: `src/types/index.ts`
- Group by domain (User types, Proposal types, etc.)

**New Constant:**
- Add to: `src/constants/index.ts`

## Special Directories

**.next/**
- Purpose: Next.js build output and cache
- Source: Auto-generated by Next.js
- Committed: No (in .gitignore)

**node_modules/**
- Purpose: npm package dependencies
- Source: Installed via `npm install`
- Committed: No (in .gitignore)

**public/**
- Purpose: Static assets (images, fonts, etc.)
- Source: Manually added
- Committed: Yes

---

*Structure analysis: 2026-01-27*
*Update when directory structure changes*
