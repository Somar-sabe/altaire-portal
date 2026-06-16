/**
 * @file /app/modules/team/hooks/useBulkActions.ts
 * @purpose Custom hook to handle bulk actions on team members.
 */

import { useState } from "react";
import { useTeamStore } from "../store";

export function useBulkActions(
  users: any[],
  canManageTarget: (role: any, id: string) => boolean,
  requireSuperAdminApproval: () => boolean
) {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const deleteUser = useTeamStore((s) => s.deleteUser);
  const updateUser = useTeamStore((s) => s.updateUser);

  const toggleSelectUser = (id: string) => {
    const newSet = new Set(selectedUsers);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedUsers(newSet);
  };

  const clearSelection = () => setSelectedUsers(new Set());

  const handleBulkAction = (action: 'Suspend' | 'Activate' | 'Delete') => {
    let unauthorized = false;
    selectedUsers.forEach(id => {
      const u = users.find(x => x.id === id);
      if (u && !canManageTarget(u.role, u.id)) unauthorized = true;
    });

    if (unauthorized) {
      window.alert("You do not have permission to manage one or more selected users.");
      return;
    }

    if (requireSuperAdminApproval()) {
      clearSelection();
      return;
    }

    if (action === 'Delete') {
      if (window.confirm(`Are you sure you want to delete ${selectedUsers.size} users?`)) {
        selectedUsers.forEach(id => deleteUser(id));
        clearSelection();
      }
    } else {
      const newStatus = action === 'Suspend' ? 'SUSPENDED' : 'ACTIVE';
      selectedUsers.forEach(id => updateUser(id, { status: newStatus }));
      clearSelection();
    }
  };

  return {
    selectedUsers,
    setSelectedUsers,
    toggleSelectUser,
    clearSelection,
    handleBulkAction
  };
}
