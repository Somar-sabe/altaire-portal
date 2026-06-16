# AI_CONTEXT — @data
<!-- TIER 1 | Load this BEFORE touching schema / migrations | <=500 lines -->
<!-- SYNC: code=2026-06-08 wiki=2026-06-08 status=synced -->

## Purpose
Data layer: Prisma ORM + Supabase Postgres 17. Owns all schema definitions, migrations, and DB connection config. 17 tables, 10 enums. Phase 0 complete.

## Owner Team
⊕D

## DB Config

| Key | Value |
|-----|-------|
| Engine | Supabase Postgres 17 |
| Project ref | `yicnsgcgzysgzavazfdk` |
| Region | `ap-south-1` |
| Pooler (IPv4, txn) | `aws-0-ap-south-1.pooler.supabase.com:6543` |
| Pooler (IPv4, session) | `aws-0-ap-south-1.pooler.supabase.com:5432` |
| User | `postgres.<ref>` |
| RLS | enabled on all tables |
| Prisma role | `postgres` (bypasses RLS) |
| Anon/PostgREST | blocked (defense-in-depth) |

## Key Files

| File | Purpose |
|------|---------|
| `basic-crm/prisma/schema.prisma` | Canonical schema — 17 models, 10 enums |
| `basic-crm/prisma/migrations/0_init/migration.sql` | Initial migration (all tables) |
| `basic-crm/prisma/migrations/20260608_add_missing_permission_values/migration.sql` | Corrective Permission enum migration |
| `basic-crm/prisma/migrations/20260608_split_lead_activity_fields/migration.sql` | Splits lead activity timestamp/display fields |
| `basic-crm/prisma/migrations/migration_lock.toml` | Lock file — provider=postgresql |
| `basic-crm/.env` | DATABASE_URL (txn pooler) + DIRECT_URL (session pooler) |

## Entity Groups

- Auth: `User` `Account` `Session` `VerificationToken`
- CRM: `LrmLead` `LeadComment` `LeadActivity`
- Workspace: `WorkspaceSpace` `SpaceMember` `SpaceInvitation` `Message` `MessageReaction`
- Feed: `FeedPost` `FeedComment` `FeedReaction` `FeedPollOption`
- Audit: `AuditLog`

## Business Rules

- §D-01 : Migration applied via Supabase Management API — local sandbox cannot route pooler (tenant-routing; DB host IPv6-only). Vercel deployment reaches pooler normally.
- §D-02 : `passwordHash` field exists on `User` — must never be included in API response (enforced in all route handlers)
- §D-03 : `AuditLog` is append-only; `actorId`/`actorName` sourced from session — never client body
- §D-04 : `User.permissions` (Permission[]) overrides role defaults when set
- §D-05 : Bulk import capped at 1000 rows + wrapped in `$transaction`

## Migration Notes

- T-0.3 SQLite backfill: N/A — no `dev.db` existed
- Local prisma migrate dev: blocked (pooler unreachable); use `prisma db push` against Supabase via MCP
- Schema was applied once via `apply_migration` (Supabase MCP) — subsequent changes should use `prisma migrate deploy`
- 2026-06-08 corrective migration `20260608_add_missing_permission_values` adds `view_feed`, `view_workspace`, and `create_space` to the Postgres `Permission` enum. These values already existed in `schema.prisma` and authz code but were missing from `0_init/migration.sql`.
- 2026-06-08 migration `20260608_split_lead_activity_fields` replaces ambiguous `LrmLead.lastActivity` with `lastActivityAt` (`DateTime?`) and `lastActivitySummary` (`String?`). Use `lastActivityAt` for ordering/timestamps and `lastActivitySummary` for labels shown to users.

## Dependencies

- ◈Supabase : DB host, RLS, Realtime
- ◈Prisma : ORM + migration tooling (`prisma` and `@prisma/client` pinned to compatible 5.x range, currently `^5.22.0`)

## Deep Docs

Full entity definitions + relations → `.agent-os/context/wiki/DATA_MODELS.md`
