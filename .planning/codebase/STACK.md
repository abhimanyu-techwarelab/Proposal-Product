# Technology Stack

**Analysis Date:** 2026-01-14

## Languages

**Primary:**
- TypeScript 5.3.3 - All application code (`package.json`, strict mode in `tsconfig.json`)

**Secondary:**
- JavaScript - Configuration files (`next.config.js`, `postcss.config.js`)
- CSS - Tailwind CSS with custom extensions (`globals.css`, `tailwind.config.ts`)

## Runtime

**Environment:**
- Node.js 20 (LTS) - Specified in `Dockerfile` (node:20-alpine)
- No .nvmrc file - Version specified in container

**Package Manager:**
- npm 10.x
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 14.2.0 - Full-stack React framework with App Router (`package.json`)
- React 18.2.0 - UI library (`package.json`)
- React DOM 18.2.0 - React rendering (`package.json`)

**Testing:**
- Not configured - No test framework installed

**Build/Dev:**
- TypeScript 5.3.3 - Compilation (`package.json`)
- PostCSS 8.4.33 - CSS processing (`postcss.config.js`)
- Autoprefixer 10.4.17 - CSS vendor prefixing (`postcss.config.js`)
- Tailwind CSS 3.4.1 - Utility-first styling (`tailwind.config.ts`)

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.89.0 - Database, auth, storage client (`src/lib/api/supabaseClient.ts`)
- jose 5.2.0 - JWT token handling (`src/lib/jwt-auth.ts`)
- zod 3.22.4 - Schema validation (`src/lib/validations/`)

**UI/UX:**
- lucide-react 0.316.0 - Icon library (`package.json`)
- framer-motion 12.26.1 - Animations (`package.json`)
- clsx 2.1.0 + tailwind-merge 2.2.0 - Class utilities (`src/lib/utils/index.ts`)
- date-fns 3.3.0 - Date formatting (`src/lib/utils/index.ts`)

**Infrastructure:**
- Next.js built-ins - API routes, middleware, server components

## Configuration

**Environment:**
- `.env` - Development configuration (localhost API, Supabase credentials)
- `.env.docker.example` - Production template with PostgreSQL, pgAdmin
- Key variables:
  - `NEXT_PUBLIC_API_URL` - Backend API endpoint
  - `JWT_SECRET` - JWT signing key
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public key

**Build:**
- `tsconfig.json` - TypeScript with path aliases (`@/*` → `./src/*`)
- `next.config.js` - Next.js with CORS headers for API routes
- `tailwind.config.ts` - Custom color schemes (primary, success, warning, danger)
- `postcss.config.js` - PostCSS plugins

## Platform Requirements

**Development:**
- Any platform with Node.js 20+
- No external dependencies required for local dev

**Production:**
- Docker containerized (multi-stage build in `Dockerfile`)
- Port 3000 for frontend (Next.js)
- Requires backend API service (port 3001)
- PostgreSQL via Supabase cloud or Docker (`docker-compose.yml`)

---

*Stack analysis: 2026-01-14*
*Update after major dependency changes*
