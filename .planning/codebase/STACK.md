# Technology Stack

**Analysis Date:** 2026-01-27

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (`package.json`)

**Secondary:**
- JavaScript - React runtime, Node.js execution

## Runtime

**Environment:**
- Node.js 20 (Alpine) - `Dockerfile`
- Browser environment for client-side React

**Package Manager:**
- npm (Node Package Manager)
- Lockfile: `package-lock.json` present (248KB)

## Frameworks

**Core:**
- Next.js 16.0.10 - `package.json` (React framework with SSR/SSG, App Router)
- React 19.2.0 - `package.json` (UI library)
- React DOM 19.2.0 - `package.json` (DOM rendering)

**Styling:**
- Tailwind CSS 3.4.17 - `package.json` (utility-first CSS framework)
- PostCSS 8.5.6 - `postcss.config.js` (CSS processing)
- Autoprefixer 10.4.22 - `package.json` (CSS vendor prefixing)

**Build/Dev:**
- TypeScript 5.9.3 - `package.json` (type safety and compilation)
- ESLint 9.39.1 - `package.json` (code linting)
- Turbopack - Next.js dev mode bundler (`npm run dev --turbopack`)

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.89.0 - `package.json` (Backend-as-a-Service, authentication, file storage)
- Zod 3.22.4 - `package.json` (Schema validation)
- jose 5.2.0 - `package.json` (JWT handling)

**UI Components:**
- Radix UI Components - `package.json` (@radix-ui/react-*)
  - react-collapsible 1.1.12
  - react-scroll-area 1.2.10
  - react-slot 1.2.4
- Lucide React 0.511.0 - `package.json` (Icon library)
- Framer Motion 12.26.1 - `package.json` (Animation library)
- Motion 12.26.2 - `package.json` (Motion primitives)

**Utilities:**
- Date-fns 3.3.0 - `package.json` (Date utilities)
- React Day Picker 9.13.0 - `package.json` (Date picker component)
- Tailwind Merge 2.6.0 - `package.json` (CSS class merging)
- Class Variance Authority 0.7.1 - `package.json` (CSS-in-JS utilities)
- Clsx 2.1.0 - `package.json` (Conditional classname utility)

## Configuration

**Environment:**
- `.env` files for configuration
- Required vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `JWT_SECRET`, `NODE_ENV`
- Database: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- JWT: `JWT_SECRET`, `JWT_ACCESS_EXPIRY`, `JWT_REFRESH_EXPIRY`

**Build:**
- `next.config.js` - Next.js configuration with image optimization for Supabase
- `tsconfig.json` - TypeScript strict mode, ES2017 target, path aliases
- `tailwind.config.ts` - Tailwind theme customization
- `eslint.config.mjs` - ESLint flat config with Next.js rules

## Platform Requirements

**Development:**
- Any platform with Node.js 20+
- Docker for containerized development (optional)
- PostgreSQL 16 for local database (via Docker)

**Production:**
- Docker container deployment (`Dockerfile` multi-stage build)
- Node.js 20-Alpine base image
- Non-root user (nextjs) for security
- Next.js standalone output optimization
- PostgreSQL 16-Alpine database container

---

*Stack analysis: 2026-01-27*
*Update after major dependency changes*
