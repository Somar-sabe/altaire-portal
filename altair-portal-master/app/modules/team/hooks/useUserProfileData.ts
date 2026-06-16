/**
 * @file /app/modules/team/hooks/useUserProfileData.ts
 * @purpose Custom hook to handle user profile data, state, and permissions.
 */

import React, { useState, useEffect } from "react";
import { useTeamStore } from "../store";
import { useAuthStore } from "../authStore";
import type { Permission, Department, Role, UserStatus, TeamUser } from "../types";
import { ROLE_RANKS, DEFAULT_ROLE_PERMISSIONS } from "../types";

export function useUserProfileData(userId: string) {
  const updateUser = useTeamStore((s) => s.updateUser);
  const fetchUsers = useTeamStore((s) => s.fetchUsers);
  const isLoadingUsers = useTeamStore((s) => s.isLoading);
  const allUsers = useTeamStore((s) => s.users);
  const currentUser = useAuthStore((s) => s.currentUser);

  // Profile lookup
  const storeUser = allUsers.find((u) => u.id === userId) ||
                    allUsers.find((u) => currentUser && u.email === currentUser.email && (userId === currentUser.id || u.id === userId));

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details');

  const isPrivate = !!(currentUser?.id === userId || (currentUser && storeUser && currentUser.email === storeUser.email));
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (allUsers.length === 0 && !isLoadingUsers) fetchUsers();
  }, [allUsers.length, fetchUsers, isLoadingUsers]);

  const currentUserRank = ROLE_RANKS.indexOf(currentUser?.role || 'GUEST');
  const targetUserRank = storeUser ? ROLE_RANKS.indexOf(storeUser.role) : 5;
  const canManageTarget = !isPrivate && currentUserRank < targetUserRank;

  const canEditInfo = isPrivate || canManageTarget || isSuperAdmin;
  const canEditPermissionsAndRole = (canManageTarget && (currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN')) || isSuperAdmin;
  const canEditAnything = canEditInfo || canEditPermissionsAndRole;

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", mobileNumber: "", department: "Operations" as Department,
    role: "GUEST" as Role, jobTitle: "", linkedInUrl: "", location: "", timezone: "",
    bio: "", permissions: [] as Permission[], managerId: null as string | null, status: "ACTIVE" as UserStatus,
  });

  useEffect(() => {
    if (storeUser) {
      setFormData({
        firstName: storeUser.firstName || "",
        lastName: storeUser.lastName || "",
        email: storeUser.email || "",
        mobileNumber: storeUser.mobileNumber || "",
        department: storeUser.department,
        role: storeUser.role,
        jobTitle: storeUser.jobTitle || "",
        linkedInUrl: storeUser.linkedInUrl || "",
        location: storeUser.location || "",
        timezone: storeUser.timezone || "",
        bio: storeUser.bio || "",
        permissions: storeUser.permissions || [],
        managerId: storeUser.managerId || null,
        status: storeUser.status,
      });
    }
  }, [storeUser]);

  const handleSave = () => {
    if (!storeUser) return;
    updateUser(storeUser.id, formData);
    setIsEditing(false);
  };

  const handleRoleChange = (newRole: string) => {
    const role = newRole as Role;
    setFormData(prev => ({
      ...prev,
      role,
      permissions: DEFAULT_ROLE_PERMISSIONS[role] || []
    }));
  };

  const togglePermission = (perm: Permission) => {
    setFormData(prev => {
      const perms = new Set(prev.permissions);
      if (perms.has(perm)) perms.delete(perm);
      else perms.add(perm);
      return { ...prev, permissions: Array.from(perms) };
    });
  };

  const handleStatusChange = (newStatus: 'ACTIVE' | 'SUSPENDED') => {
    if (!storeUser) return;
    updateUser(storeUser.id, { status: newStatus });
  };

  return {
    user: storeUser,
    isLoadingUsers,
    isEditing,
    setIsEditing,
    activeTab,
    setActiveTab,
    isPrivate,
    canEditInfo,
    canEditPermissionsAndRole,
    canEditAnything,
    canManageTarget,
    formData,
    setFormData,
    handleSave,
    handleRoleChange,
    togglePermission,
    handleStatusChange,
    allUsers,
    currentUser
  };
}
