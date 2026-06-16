/**
 * @file emit-admin-sql.mjs
 * @purpose Generate an idempotent INSERT SQL for the initial SUPER_ADMIN user.
 *          Reads INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD from .env,
 *          hashes the password with argon2id, then prints a single SQL statement
 *          to stdout. G applies the output via MCP — this script never connects
 *          to the database.
 * @deps argon2, dotenv (both in package.json)
 */

import { createHash, randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import argon2 from 'argon2';

// ── Load .env manually (avoid dotenv dep tree issues in .mjs) ───────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
const envLines = readFileSync(envPath, 'utf8').split('\n');
const env = {};
for (const line of envLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let val = trimmed.slice(eqIdx + 1).trim();
  // Strip surrounding quotes
  if ((val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  env[key] = val;
}

const adminEmail = env.INITIAL_ADMIN_EMAIL;
const adminPassword = env.INITIAL_ADMIN_PASSWORD;

if (!adminEmail) {
  console.error('ERROR: INITIAL_ADMIN_EMAIL not set in .env');
  process.exit(1);
}

if (!adminPassword) {
  console.error('ERROR: INITIAL_ADMIN_PASSWORD not set in .env');
  process.exit(1);
}

// ── All permissions for SUPER_ADMIN ─────────────────────────────────────────
const SUPER_ADMIN_PERMISSIONS = [
  'view_leads', 'create_lead', 'edit_lead', 'delete_lead', 'assign_lead',
  'export_leads', 'view_feed', 'publish_to_feed', 'delete_feed_posts',
  'comment_on_feed', 'view_workspace', 'create_space', 'view_team',
  'invite_users', 'manage_roles', 'edit_users', 'delete_users', 'send_messages',
  'view_all_messages', 'manage_campaigns', 'view_campaigns', 'view_reports',
  'export_reports', 'view_overview', 'manage_company_settings', 'manage_billing'
];

// ── Hash password with argon2id (same params as init-auth.ts) ───────────────
const passwordHash = await argon2.hash(adminPassword, { type: argon2.argon2id });

// ── Build a cuid-like id (no external dep) ──────────────────────────────────
// Format: c + timestamp-base36 + random-hex-base36 — collision-safe for seeding
const ts = Date.now().toString(36);
const rnd = randomBytes(8).toString('hex');
const adminId = `c${ts}${rnd}`;

// ── Build permissions array literal for PostgreSQL ──────────────────────────
const permLiteral = `ARRAY[${SUPER_ADMIN_PERMISSIONS.map(p => `'${p}'::"Permission"`).join(', ')}]`;

// ── Emit idempotent INSERT ───────────────────────────────────────────────────
const sql = `INSERT INTO "User" (
  "id",
  "firstName",
  "lastName",
  "mobileNumber",
  "email",
  "department",
  "role",
  "status",
  "passwordHash",
  "permissions",
  "failedLoginAttempts",
  "twoFactorEnabled",
  "tokenVersion",
  "createdAt",
  "updatedAt"
) VALUES (
  '${adminId}',
  'Admin',
  'User',
  '0000000000',
  '${adminEmail}',
  'Management',
  'SUPER_ADMIN'::"Role",
  'ACTIVE'::"UserStatus",
  '${passwordHash}',
  ${permLiteral},
  0,
  false,
  0,
  now(),
  now()
) ON CONFLICT ("email") DO NOTHING;`;

process.stdout.write(sql + '\n');
