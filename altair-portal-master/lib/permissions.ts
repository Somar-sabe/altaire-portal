import { Permission, Role } from "@prisma/client";

export const DEFAULT_ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "view_leads", "create_lead", "edit_lead", "delete_lead", "assign_lead", "export_leads",
    "view_feed", "publish_to_feed", "edit_feed_posts", "delete_feed_posts", "react_to_feed", "comment_on_feed", "delete_feed_comments",
    "view_workspace", "create_space",
    "view_team", "invite_users", "manage_roles", "edit_users", "delete_users",
    "send_messages", "view_all_messages",
    "manage_campaigns", "view_campaigns",
    "view_reports", "export_reports",
    "view_overview",
    "manage_company_settings", "manage_billing"
  ],
  ADMIN: [
    "view_leads", "create_lead", "edit_lead", "assign_lead", "export_leads",
    "view_feed", "publish_to_feed", "edit_feed_posts", "react_to_feed", "comment_on_feed", "delete_feed_comments",
    "view_workspace", "create_space",
    "view_team", "invite_users", "manage_roles", "edit_users",
    "send_messages", "view_all_messages",
    "manage_campaigns", "view_campaigns",
    "view_reports", "export_reports",
    "view_overview"
  ],
  MANAGER: [
    "view_leads", "create_lead", "edit_lead", "assign_lead",
    "view_feed", "publish_to_feed", "edit_feed_posts", "react_to_feed", "comment_on_feed",
    "view_workspace",
    "view_team",
    "send_messages",
    "view_reports", "export_reports",
    "view_overview"
  ],
  AGENT: [
    "view_leads", "create_lead", "edit_lead",
    "view_feed", "publish_to_feed", "edit_feed_posts", "react_to_feed", "comment_on_feed",
    "view_workspace",
    "view_team",
    "send_messages",
    "view_overview"
  ]
};

type PermissionSubject = {
  role: Role;
  permissions?: Permission[] | null;
};

export function resolveEffectivePermissions(user: PermissionSubject): Permission[] {
  return user.permissions?.length ? user.permissions : DEFAULT_ROLE_PERMISSIONS[user.role] ?? [];
}

export function hasEffectivePermission(user: PermissionSubject, permission: Permission): boolean {
  return resolveEffectivePermissions(user).includes(permission);
}
