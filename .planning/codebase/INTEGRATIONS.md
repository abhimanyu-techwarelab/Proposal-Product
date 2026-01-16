# External Integrations

**Analysis Date:** 2026-01-16

## APIs & External Services

**Backend REST API:**
- Custom REST API at `NEXT_PUBLIC_API_URL` (default: http://localhost:3001)
  - SDK/Client: Custom fetch-based client - `src/lib/api/client.ts`
  - Auth: JWT Bearer tokens in Authorization header
  - Endpoints: Authentication, Proposals, Users, Roles, Templates, Subscriptions, Organizations, Dashboard
  - Integration: Server-side and client-side fetch with automatic token injection

**External APIs:**
- None detected (self-contained SaaS application)

## Data Storage

**Databases:**
- Supabase (PostgreSQL) - Primary data store
  - Connection: Via `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars
  - Client: @supabase/supabase-js v2.89.0 - `src/lib/api/supabaseClient.ts`
  - Tables: `proposals`, `organizations`, `product_users`
  - Direct table access: `src/lib/api/supabaseProposals.ts`, `src/lib/api/auth.ts`

**File Storage:**
- Supabase Storage - User uploads (documents, audio files)
  - SDK/Client: @supabase/supabase-js Storage API
  - Auth: Supabase anon key (with RLS policies)
  - Buckets: `proposal-documents`, `proposal-audio` - `src/lib/storage/index.ts`
  - Upload functions: `uploadFileToStorage()`, `uploadFilesToStorage()`, `generateSignedUrl()`
  - Used in: `src/components/forms/ProposalForm.tsx` for file uploads

**Caching:**
- Not detected - No Redis or external caching layer

## Authentication & Identity

**Auth Provider:**
- Dual authentication system:
  1. JWT-based custom auth - `src/lib/jwt-auth.ts`
     - Implementation: HTTP-only cookies (`product_auth_token`)
     - Token storage: Cookies managed via API routes
     - Session management: JWT decoding client-side, verification server-side
  2. Supabase Auth - Email/password - `src/lib/api/auth.ts`
     - Implementation: Supabase client SDK with email/password
     - Token storage: Supabase session management
     - Integration: `src/lib/api/supabaseClient.ts`

**OAuth Integrations:**
- None currently integrated
  - TODO: Google sign-in mentioned in `src/app/(auth)/login/page.tsx` (line 61)

## Monitoring & Observability

**Error Tracking:**
- None configured
  - Custom logger utility: `src/lib/utils/logger.ts`
  - Auth event logging: loginSuccess, loginFailure, registerSuccess, registerFailure, logout

**Analytics:**
- Not detected

**Logs:**
- Console-based logging only (development)
  - Custom logger: `src/lib/utils/logger.ts`
  - No centralized log aggregation

## CI/CD & Deployment

**Hosting:**
- Not specified in code
  - Next.js application (can deploy to Vercel, Docker, or any Node.js host)
  - Environment vars: Configured externally

**CI Pipeline:**
- Not detected
  - No GitHub Actions, GitLab CI, or similar configuration files found

## Environment Configuration

**Development:**
- Required env vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `JWT_SECRET`
- Secrets location: `.env.local` (gitignored) or `.env` (template in `.env.example`)
- Mock/stub services: Supabase development project (via env vars)

**Staging:**
- Not explicitly configured
  - Same env var pattern with staging-specific values

**Production:**
- Secrets management: Environment variables (platform-specific: Vercel, Docker env, etc.)
- Database: Supabase production project

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## Backend API Endpoints

**Authentication:**
- `/api/auth/login` - Login with email/password - `src/app/api/auth/login/route.ts`
- `/api/auth/logout` - Logout and clear cookies - `src/app/api/auth/logout/route.ts`
- `/api/auth/token` - Retrieve JWT from cookies - `src/app/api/auth/token/route.ts`
- `/api/auth/me` - Get current user details - `src/app/api/auth/me/route.ts`

**Product Endpoints** (Backend API):
- `/product/proposals` - List/create proposals - `src/lib/api/proposals.ts`
- `/product/proposals/{id}` - Get/update/delete proposal
- `/product/proposals/generate` - Generate proposal with signed documents
- `/product/proposals/{id}/render` - Render proposal HTML preview
- `/product/permissions` - Get permissions list - `src/lib/api/permissions.ts`
- `/dashboard/summary` - Dashboard stats - `src/lib/api/dashboard.ts`
- `/users`, `/users/{id}` - User management - `src/lib/api/users.ts`
- `/roles`, `/roles/{id}` - Role management - `src/lib/api/roles.ts`
- `/templates`, `/templates/{id}` - Template management - `src/lib/api/templates.ts`
- `/subscriptions` - Subscription management - `src/lib/api/subscriptions.ts`
- `/organizations` - Organization management

---

*Integration audit: 2026-01-16*
*Update when adding/removing external services*
