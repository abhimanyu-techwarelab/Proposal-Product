# External Integrations

**Analysis Date:** 2026-01-27

## APIs & External Services

**Backend API:**
- Custom REST API - `src/lib/api/client.ts`
  - Base URL: `NEXT_PUBLIC_API_URL` (production: `https://abhimanyu-4200.tl-workspace.techwarelab.com`, dev: `http://localhost:3000`)
  - Integration method: Custom HTTP client with GET/POST/PUT/PATCH/DELETE methods
  - Auth: Bearer token in Authorization header from HTTP-only cookies
  - Error handling: Custom `ApiRequestError` class
  - Endpoints: `/auth/*`, `/product/proposals/*`, `/templates/*`, `/users/*`, `/roles/*`, `/organizations/*`, `/subscriptions/*`

**External APIs:**
- None detected (no OpenAI, Anthropic, third-party payment processors)

## Data Storage

**Databases:**
- PostgreSQL 16-Alpine - `docker-compose.yml`
  - Connection: via `DATABASE_URL` or individual `DB_*` env vars
  - Client: Accessed via backend API (not directly from Next.js)
  - Container: `postgres:16-alpine` with health checks

**File Storage:**
- Supabase Storage - `src/lib/storage/index.ts`
  - SDK/Client: @supabase/supabase-js v2.89.0
  - Auth: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Buckets: `proposal-documents`, `proposal-audio`
  - Operations: Upload single/multiple files, generate signed URLs (1 hour expiration), delete files, public URLs
  - File path structure: `{folderId}/{generatedId}.{ext}`
  - URL: `https://yoxtsymyhtuhdnaszkzq.supabase.co/`

**Caching:**
- None detected (no Redis, Memcached)

## Authentication & Identity

**Auth Provider:**
- Supabase Auth + Custom JWT - `src/lib/auth/server.ts`, `src/lib/jwt-auth.ts`
  - Implementation: Supabase client SDK + jose library for JWT handling
  - Token storage: HTTP-only cookies (`product_auth_token`, `proposal_access_token`)
  - Session management: JWT with claims (user_id, organization_id, permissions, has_admin_access, iat, exp)
  - Verification: Server-side JWT verification using jose v5.2.0

**OAuth Integrations:**
- Not detected (no Google, GitHub, or other OAuth providers configured)

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry, Rollbar)

**Analytics:**
- Not detected (no Mixpanel, Segment, Google Analytics)

**Logs:**
- Console-based logging - `src/lib/utils/logger.ts`
  - Auth events logged (login success/failure, logout)
  - No external log aggregation service

## CI/CD & Deployment

**Hosting:**
- Docker containerization - `Dockerfile`
  - Multi-stage build (base, deps, builder, runner, development)
  - Node 20-Alpine base image
  - Next.js standalone output
  - Non-root user (nextjs) for security

**CI Pipeline:**
- Not detected (no .github/workflows, .gitlab-ci.yml, etc.)

**Orchestration:**
- Docker Compose - `docker-compose.yml`, `docker-compose.dev.yml`, `docker-compose.prod.yml`
  - Services: PostgreSQL (database), Backend (API), Frontend (Next.js), pgAdmin (database management)
  - Networking: `proposal-network` bridge network
  - Health checks configured for PostgreSQL
  - Volume management for persistent data

## Environment Configuration

**Development:**
- Required env vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `JWT_SECRET`
- Secrets location: `.env` file (gitignored)
- Mock/stub services: Supabase configured for both dev and prod

**Staging:**
- Not explicitly configured (same as production)

**Production:**
- Secrets management: Environment variables via Docker Compose
- Docker `.env.docker.example` template provided
- CORS configured via `next.config.js` for API routes

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

---

*Integration audit: 2026-01-27*
*Update when adding/removing external services*
