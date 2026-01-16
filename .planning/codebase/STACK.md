# Technology Stack

**Analysis Date:** 2026-01-16

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (`package.json`)

**Secondary:**
- JavaScript/JSX - Configuration files, build scripts

## Runtime

**Environment:**
- Node.js (managed by Next.js 16.0.10) - ES2017 target
- Browser runtime for client components

**Package Manager:**
- npm - Node Package Manager
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.0.10 - Full-stack React framework with App Router (`package.json`)
- React 19.2.0 - UI library
- React DOM 19.2.0 - DOM rendering

**Testing:**
- Not detected - No test framework configured

**Build/Dev:**
- Turbopack - Build system (dev mode with `--turbopack` flag) - `package.json` scripts
- TypeScript 5.9.3 - Type checking and compilation
- PostCSS 8.5.6 - CSS processing (`postcss.config.js`)
- Autoprefixer 10.4.22 - CSS vendor prefixing

## Key Dependencies

**Critical:**
- zod 3.22.4 - TypeScript-first schema validation (`package.json`)
- jose 5.2.0 - JWT handling and token management
- @supabase/supabase-js 2.89.0 - Supabase client for database and storage

**Infrastructure:**
- Tailwind CSS 3.4.17 - Utility-first CSS framework (`tailwind.config.ts`)
- Tailwind Merge 2.6.0 - Class merging utility
- Class Variance Authority 0.7.1 - CSS variant management
- clsx 2.1.0 - Conditional class names

**UI Components:**
- Radix UI components - Headless UI primitives:
  - @radix-ui/react-collapsible 1.1.12
  - @radix-ui/react-scroll-area 1.2.10
  - @radix-ui/react-slot 1.2.4
- Lucide React 0.511.0 - Icon library

**Animation:**
- Framer Motion 12.26.1 - React animation library
- Motion 12.26.2 - Motion primitives

**Date & Time:**
- date-fns 3.3.0 - Date manipulation and formatting
- React Day Picker 9.13.0 - Date picker component

## Configuration

**Environment:**
- `.env.example` - Template for environment variables
- `.env.docker.example` - Docker environment configuration
- Required env vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `JWT_SECRET`

**Build:**
- `next.config.js` - Next.js configuration with CORS headers for `/api/*` routes
- `tsconfig.json` - TypeScript strict mode, ES2017 target, path alias `@/*` → `./src/*`
- `tailwind.config.ts` - Custom dark theme with primary/success/warning/danger colors
- `postcss.config.js` - PostCSS with tailwindcss + autoprefixer
- `eslint.config.mjs` - ESLint with Next.js core-web-vitals preset

## Platform Requirements

**Development:**
- Any platform with Node.js 18+
- npm for package management
- Backend API running at `NEXT_PUBLIC_API_URL` (default: http://localhost:3001)

**Production:**
- Deployment target: Next.js compatible platforms (Vercel, Docker, etc.)
- Node.js runtime environment
- Environment variables configured externally

---

*Stack analysis: 2026-01-16*
*Update after major dependency changes*
