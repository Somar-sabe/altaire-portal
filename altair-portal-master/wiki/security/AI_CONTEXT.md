# AI_CONTEXT — @security / @authz / @ratelimit / @errors
<!-- TIER 1 | Load this BEFORE touching security libs | <=500 lines -->
<!-- SYNC: code=2026-06-08 wiki=2026-06-08 status=synced -->

## Purpose
Security layer wrapping dashboard auth and API routes. Provides: server dashboard gating, typed auth errors, per-endpoint permission gates, rate limiting, sanitized error envelopes, trusted-proxy IP extraction. Phase 1 foundation is in progress; Vercel runtime gate pending.

## Owner Team
⊕S

## Key Files

| File | Purpose |
|------|---------|
| `lib/authz.ts` | `requirePermission(perm)` — loads persisted user permissions and throws typed `AuthError`/`ForbiddenError` |
| `lib/permissions.ts` | `DEFAULT_ROLE_PERMISSIONS`, `resolveEffectivePermissions`, and `hasEffectivePermission` |
| `lib/ratelimit.ts` | Upstash sliding-window limiters: `authLimiter`, `aiLimiter`, `bulkLimiter`; fail-closed in prod (UPSTASH_* env required) |
| `lib/errors.ts` | `sanitizedError(e)` — returns safe envelope; no `error.message` / stack in response |
| `lib/client-ip.ts` | Trusted-proxy IP extraction for Vercel (`x-forwarded-for` first hop) |
| `lib/lead-rotation.ts` | Lead assignment rotation logic |
| `auth.ts` | Auth.js v5 config; argon2id; dev-bypass REMOVED |
| `app/(dashboard)/layout.tsx` | Server dashboard gate; calls `auth()` and redirects unauthenticated users to `/` |
| `app/(dashboard)/DashboardShell.tsx` | Client dashboard chrome/state after server auth passes |
| `middleware.ts` | Pass-through middleware only; avoids Prisma-backed Auth.js in edge middleware |

## Business Rules

- §S-01 : Every mutating route must call `requirePermission(session, perm)` before any DB write
- §S-02 : All audit-log identity fields (`actorId`, `actorName`) sourced from session — never client body
- §S-03 : `passwordHash` never returned in any API response
- §S-04 : Rate limiters fail-closed in prod; fail-open only in dev/test (prevents lockout on missing Upstash keys)
- §S-05 : IDOR — AGENT role limited to own leads; ownership check before PATCH/DELETE
- §S-06 : IP sourced via `lib/client-ip.ts` for rate-limit key; raw `x-forwarded-for` not trusted directly
- §S-07 : `AUDIT_ALERT_EMAIL` from env only — no hardcoded fallback
- §S-08 : Effective backend permissions come from `User.permissions`; role defaults are only fallback/templates when stored permissions are empty
- §S-09 : Role, permission, password, status, and deactivation updates bump `User.tokenVersion`
- §S-10 : Dashboard pages are protected in the server layout before hydration; `localStorage` is not an auth source

## DEFAULT_ROLE_PERMISSIONS Matrix (abbreviated)

| Role | Key Permissions |
|------|----------------|
| SUPER_ADMIN | all permissions |
| ADMIN | all except manage_roles for other admins |
| MANAGER | view_all_leads, assign_lead, import_leads, export_leads, edit_users |
| AGENT | view_leads, create_lead, edit_lead (own), comment_on_feed, send_messages |

Full matrix in `lib/permissions.ts`.

## Design Decisions (documented defaults — not bugs)

- User status change: under `edit_users` permission

## Dependencies

- →@auth : session source for all identity
- ◈Upstash : rate limit storage (env: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)

## Residual Backlog

- Vercel runtime gate: verify 401/403/422/429 on Vercel preview
- Dependency CVE scan (`npm audit` / Snyk)
- Split `lib/mailer.ts` (257 lines) — SRP violation
- Split `app/api/leads/[id]/route.ts` (>200 lines) — SRP violation
- Add route-level integration tests for persisted permission changes after the package test script exists

## Deep Docs

Security audit history → `.agent-os/context/wiki/SECURITY_LOG.md`
