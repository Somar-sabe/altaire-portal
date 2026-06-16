/**
 * @file lib/validations.ts
 * @purpose Zod schemas for request body validation at every system boundary.
 * @dependencies zod, @prisma/client
 *
 * userSchema          — full user shape (used for POST/invite)
 * userUpdateSchema    — edit_users path: excludes role + permissions
 * userRoleSchema      — manage_roles path: only role + permissions (additive)
 * leadSchema          — lead create/update fields
 */

import { z } from 'zod';
import { LeadStage, LeadStatus, Role, UserStatus, Permission, FeedPostType } from '@prisma/client';

// ---------------------------------------------------------------------------
// Lead schema
// ---------------------------------------------------------------------------

export const leadSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  targetProject: z.string().optional(),
  value: z.union([z.string(), z.number()]).optional(),
  stage: z.nativeEnum(LeadStage).optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  altPhone: z.string().nullable().optional(),
  workPhone: z.string().nullable().optional(),
  workEmail: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  telegram: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  aiScore: z.union([z.string(), z.number()]).optional(),
  notes: z.string().optional(),
  avatarColor: z.string().optional(),
  lang: z.string().optional(),
  country: z.string().optional(),
  assignedAgentId: z.string().nullable().optional(),
  adminInChargeId: z.string().nullable().optional(),
  assignedById: z.string().nullable().optional(),
  details: z.string().optional(),
  dateCreated: z.string().optional(),
  lastActivityAt: z.union([z.string(), z.date()]).optional(),
  lastActivitySummary: z.string().optional(),
  lastInteractionDate: z.string().optional(),
  creatorName: z.string().optional(),
}).strict();

// GPT-Codex (G) BEGIN: Wave 5A feed post request contract for schema-backed API validation.
export const feedPostSchema = z.object({
  type: z.nativeEnum(FeedPostType).default(FeedPostType.UPDATE),
  title: z.string().trim().min(1).optional(),
  content: z.string().trim().min(1),
  eventDate: z.string().trim().min(1).optional(),
  pollOptions: z.array(z.string().trim().min(1)).max(10).optional(),
}).strict().superRefine((value, ctx) => {
  if (['EVENT', 'POLL', 'STAR'].includes(value.type) && !value.title) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['title'],
      message: 'title is required for this post type',
    });
  }

  if (value.type === FeedPostType.POLL && (!value.pollOptions || value.pollOptions.length < 2)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['pollOptions'],
      message: 'pollOptions must include at least two options for poll posts',
    });
  }
});
// GPT-Codex (G) END: feed POST no longer relies on ad-hoc body checks or silent type coercion.

// ---------------------------------------------------------------------------
// User schemas
// ---------------------------------------------------------------------------

/** Full user shape — used for POST (invite) only. */
export const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  mobileNumber: z.string().optional(),
  department: z.string().optional(),
  role: z.nativeEnum(Role),
  status: z.nativeEnum(UserStatus).optional(),
  photoUrl: z.string().nullable().optional(),
  jobTitle: z.string().nullable().optional(),
  linkedInUrl: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  managerId: z.string().nullable().optional(),
  password: z.string().optional(),
  permissions: z.array(z.nativeEnum(Permission)).optional(),
  joinedDate: z.union([z.string(), z.date()]).optional(),
  lastActive: z.union([z.string(), z.date()]).optional()
}).strict();

/**
 * edit_users path — EXCLUDES role and permissions.
 * Callers with only edit_users may not elevate privileges.
 */
export const userUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  mobileNumber: z.string().optional(),
  department: z.string().optional(),
  status: z.nativeEnum(UserStatus).optional(),
  photoUrl: z.string().nullable().optional(),
  jobTitle: z.string().nullable().optional(),
  linkedInUrl: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  managerId: z.string().nullable().optional(),
  password: z.string().optional(),
  joinedDate: z.union([z.string(), z.date()]).optional(),
  lastActive: z.union([z.string(), z.date()]).optional()
}).strict();

/**
 * manage_roles path — ONLY role and permissions fields.
 * Used as an additive patch on top of the base update.
 */
export const userRoleSchema = z.object({
  role: z.nativeEnum(Role).optional(),
  permissions: z.array(z.nativeEnum(Permission)).optional(),
}).strict();

// GPT-Codex (G) BEGIN: Wave 5B shared request types derived from the validation schemas.
export type LeadRequestInput = z.infer<typeof leadSchema>;
export type FeedPostRequestInput = z.infer<typeof feedPostSchema>;
export type UserCreateRequestInput = z.infer<typeof userSchema>;
export type UserUpdateRequestInput = z.infer<typeof userUpdateSchema>;
export type UserRolePatchRequestInput = z.infer<typeof userRoleSchema>;
// GPT-Codex (G) END: API handlers can consume schema-derived types instead of parallel mirrors.
