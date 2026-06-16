/**
 * @file /app/modules/team/types.ts
 * @description Zod schemas and TypeScript types for the Team & Users feature
 * @dependencies zod
 */
import { z } from 'zod';

export const ROLE_RANKS: Role[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'MANAGER',
  'AGENT',
  'GUEST'
];

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  AGENT: 'Agent',
  GUEST: 'Guest'
};

export const STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: 'Active',
  OFFLINE: 'Offline',
  SUSPENDED: 'Suspended',
  INVITED: 'Invited',
  INACTIVE: 'Inactive'
};

export const PermissionSchema = z.enum([
  // Leads Module
  'view_leads',
  'create_lead',
  'edit_lead',
  'delete_lead',
  'assign_lead',
  'export_leads',
  
  // Company Feed Module
  'view_feed',
  'publish_to_feed',
  'delete_feed_posts',
  'comment_on_feed',

  // Workspace Module
  'view_workspace',
  'create_space',
  
  // Team Module
  'view_team',
  'invite_users',
  'manage_roles',
  'edit_users',
  'delete_users',
  
  // Messages Module
  'send_messages',
  'view_all_messages',
  
  // Marketing Module
  'manage_campaigns',
  'view_campaigns',
  
  // Reports Module
  'view_reports',
  'export_reports',
  
  // Overview Module
  'view_overview',
  
  // Admin module mapping to settings
  'manage_company_settings',
  'manage_billing'
]);

export const RoleSchema = z.enum([
  'SUPER_ADMIN',
  'ADMIN',
  'MANAGER',
  'AGENT',
  'GUEST'
]);

export const DepartmentSchema = z.enum([
  'Executive',
  'Operations',
  'Sales',
  'Engineering',
  'Marketing',
  'Customer Support'
]);

export const UserStatusSchema = z.enum(['ACTIVE', 'OFFLINE', 'SUSPENDED', 'INVITED', 'INACTIVE']);

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  mobileNumber: z.string(),
  email: z.string().email('Invalid email address'),
  department: DepartmentSchema,
  role: RoleSchema,
  permissions: z.array(PermissionSchema),
  effectivePermissions: z.array(PermissionSchema).optional(),
  photoUrl: z.string().optional(),
  status: UserStatusSchema,
  lastActive: z.string(),

  // Professional Info
  jobTitle: z.string().optional(),
  linkedInUrl: z.string().url().optional().or(z.literal('')),
  location: z.string().optional(),
  timezone: z.string().optional(),
  bio: z.string().optional(),

  // System & Security Info
  joinedDate: z.string().optional(),
  lastLoginIp: z.string().optional(),
  failedLoginAttempts: z.number().int().min(0).optional(),
  twoFactorEnabled: z.boolean().optional(),
  managerId: z.string().optional().nullable(),
});

export type Permission = z.infer<typeof PermissionSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type Department = z.infer<typeof DepartmentSchema>;
export type UserStatus = z.infer<typeof UserStatusSchema>;
export type TeamUser = z.infer<typeof UserSchema>;

export const PERMISSION_LABELS: Record<Permission, string> = {
  view_leads: "View Leads",
  create_lead: "Create New Lead",
  edit_lead: "Edit Lead",
  delete_lead: "Delete Lead",
  assign_lead: "Assign Lead",
  export_leads: "Export Leads",
  view_feed: "View Feed",
  publish_to_feed: "Publish to Feed",
  delete_feed_posts: "Delete Feed Posts",
  comment_on_feed: "Comment on Feed",
  view_workspace: "View Workspace",
  create_space: "Create Space",
  view_team: "View Team",
  invite_users: "Invite Users",
  manage_roles: "Manage Roles",
  edit_users: "Edit Users",
  delete_users: "Delete Users",
  send_messages: "Send Messages",
  view_all_messages: "View All Messages",
  manage_campaigns: "Manage Campaigns",
  view_campaigns: "View Campaigns",
  view_reports: "View Reports",
  export_reports: "Export Reports",
  view_overview: "View Overview",
  manage_company_settings: "Manage Company Settings",
  manage_billing: "Manage Billing",
};

export const DEFAULT_ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  "SUPER_ADMIN": [
    "view_leads", "create_lead", "edit_lead", "delete_lead", "assign_lead", "export_leads",
    "view_feed",
    "publish_to_feed", "delete_feed_posts", "comment_on_feed",
    "view_workspace", "create_space",
    "view_team", "invite_users", "manage_roles", "edit_users", "delete_users",
    "send_messages", "view_all_messages",
    "manage_campaigns", "view_campaigns",
    "view_reports", "export_reports",
    "view_overview",
    "manage_company_settings", "manage_billing"
  ],
  "ADMIN": [
    "view_leads", "create_lead", "edit_lead", "assign_lead", "export_leads",
    "view_feed",
    "publish_to_feed", "comment_on_feed",
    "view_workspace", "create_space",
    "view_team", "invite_users", "manage_roles", "edit_users",
    "send_messages", "view_all_messages",
    "manage_campaigns", "view_campaigns",
    "view_reports", "export_reports",
    "view_overview"
  ],
  "MANAGER": [
    "view_leads", "create_lead", "edit_lead", "assign_lead",
    "view_feed",
    "publish_to_feed", "comment_on_feed",
    "view_workspace",
    "view_team",
    "send_messages",
    "view_reports", "export_reports",
    "view_overview"
  ],
  "AGENT": [
    "view_leads", "create_lead", "edit_lead",
    "view_feed",
    "publish_to_feed", "comment_on_feed",
    "view_workspace",
    "view_team",
    "send_messages",
    "view_overview"
  ],
  "GUEST": [
    "view_team",
    "view_overview"
  ]
};
