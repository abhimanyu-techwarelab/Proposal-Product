# External Integrations

**Analysis Date:** 2026-01-14

## APIs & External Services

**Backend API:**
- Custom Node.js backend - Business logic, permissions, CRUD operations
  - Base URL: `NEXT_PUBLIC_API_URL` environment variable
  - Client: `src/lib/api/client.ts` (typed HTTP client)
  - Endpoints: `/auth/*`, `/dashboard/*`, `/product/proposals/*`, `/users`, `/roles`, `/organizations`
  - Auth: JWT Bearer token in Authorization header

**Payment Processing:**
- Not detected

**Email/SMS:**
- Not detected

**External APIs:**
- Not detected

## Data Storage

**Databases:**
- PostgreSQL on Supabase - Primary data store
  - Connection: via `NEXT_PUBLIC_SUPABASE_URL` env var
  - Client: @supabase/supabase-js v2.89.0 (`src/lib/api/supabaseClient.ts`)
  - Tables: `organizations`, `product_users`, `proposals`

**File Storage:**
- Supabase Storage - User uploads (proposal documents, audio files)
  - Client: `src/lib/storage/index.ts`
  - Buckets: `proposal-documents`, `proposal-audio`
  - Operations: upload, download, signed URLs, delete

**Caching:**
- Not detected (no Redis or similar)

## Authentication & Identity

**Auth Provider:**
- Supabase Auth + Custom JWT - Email/password authentication
  - Implementation: `src/lib/api/auth.ts`, `src/contexts/AuthContext.tsx`
  - Token storage: HTTP-only cookies via Next.js API routes
  - Session management: JWT tokens with client-side refresh

**OAuth Integrations:**
- Google OAuth - Planned but not yet implemented (TODO in login page)

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry or similar)

**Analytics:**
- Not detected (no Mixpanel, Amplitude, etc.)

**Logs:**
- Custom auth logger: `src/lib/utils/logger.ts` (tracks login/register/logout events)
- Console logging throughout (103 console.log statements)

## CI/CD & Deployment

**Hosting:**
- Docker - Containerized deployment
  - `Dockerfile` - Multi-stage build for production
  - `docker-compose.yml` - Development/production setup
  - `docker-compose.prod.yml` - Production variant
  - `docker-compose.dev.yml` - Development variant

**CI Pipeline:**
- Not detected (no GitHub Actions or similar)

## Environment Configuration

**Development:**
- Required env vars: `NEXT_PUBLIC_API_URL`, `JWT_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Secrets location: `.env` file (gitignored recommended)
- Mock/stub services: Uses localhost API on port 3000

**Staging:**
- Not configured

**Production:**
- Docker Compose orchestration with:
  - PostgreSQL 16 (port 5432)
  - pgAdmin 4 (port 5050)
  - Backend API (port 3001)
  - Frontend (port 3000)

## Webhooks & Callbacks

**Incoming:**
- Not detected

**Outgoing:**
- Not detected

## API Route Structure

**Next.js API Routes:**
- `src/app/api/auth/login/route.ts` - Backend login proxy, sets HTTP-only cookies
- `src/app/api/auth/logout/route.ts` - Clears auth cookies
- `src/app/api/auth/token/route.ts` - Returns token for client-side requests

**Client API Services:**
- `src/lib/api/auth.ts` - Authentication (login, register, logout)
- `src/lib/api/proposals.ts` - Proposal CRUD, approval workflow
- `src/lib/api/users.ts` - User management
- `src/lib/api/roles.ts` - Role management
- `src/lib/api/dashboard.ts` - Dashboard statistics
- `src/lib/api/permissions.ts` - Permission queries

---

*Integration audit: 2026-01-14*
*Update when adding/removing external services*
