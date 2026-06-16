"use client";
/**
 * @file /app/modules/team/components/TeamList.tsx
 * @purpose Renders the list of users in the team module.
 */

import React, { useState, useCallback } from "react";
import { Check } from "lucide-react";
import { useTeamStore } from "../store";
import type { Department, Role } from "../types";
import { DEFAULT_ROLE_PERMISSIONS, ROLE_RANKS } from "../types";
import { useAuthStore } from "../authStore";

// Sub-components
import InviteUserModal from "./InviteUserModal";
import TeamFilters from "./TeamFilters";
import BulkActionsBar from "./BulkActionsBar";
import TeamHeader from "./TeamHeader";
import TeamSearch from "./TeamSearch";
import TeamListGrid from "./TeamListGrid";
import UserMenu from "./UserMenu";

// Hooks
import { useTeamFilters } from "../hooks/useTeamFilters";
import { useBulkActions } from "../hooks/useBulkActions";

export default function TeamList({ onSelectUser }: { onSelectUser: (id: string) => void }) {
  const users = useTeamStore((s) => s.users);
  const deleteUser = useTeamStore((s) => s.deleteUser);
  const addUser = useTeamStore((s) => s.addUser);
  const updateUser = useTeamStore((s) => s.updateUser);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteDepartment, setInviteDepartment] = useState<Department>("Operations");
  const [inviteRole, setInviteRole] = useState<Role>("GUEST");
  const [inviteManagerId, setInviteManagerId] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const canManageTarget = useCallback((targetRole: Role, targetId: string) => {
    if (!currentUser) return false;
    return currentUser.id !== targetId && ROLE_RANKS.indexOf(currentUser.role) < ROLE_RANKS.indexOf(targetRole);
  }, [currentUser]);

  const requireSuperAdminApproval = useCallback(() => {
    if (currentUser?.role !== 'SUPER_ADMIN') {
      window.alert("Action requested! This change requires approval from a Super Admin and has been queued.");
      return true;
    }
    return false;
  }, [currentUser]);

  const { searchQuery, setSearchQuery, filterDepartment, setFilterDepartment, filterRole, setFilterRole, filterStatus, setFilterStatus, filteredUsers, isFilterActive } = useTeamFilters(users);
  const { selectedUsers, setSelectedUsers, toggleSelectUser, clearSelection, handleBulkAction } = useBulkActions(users, canManageTarget, requireSuperAdminApproval);

  const handleDelete = (user: any) => {
    if (requireSuperAdminApproval()) return setOpenMenuId(null);
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(user.id);
      setOpenMenuId(null);
      const newSelected = new Set(selectedUsers);
      newSelected.delete(user.id);
      setSelectedUsers(newSelected);
    }
  };

  const submitInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    addUser({
      id: `u${Date.now()}`, firstName: "Invited", lastName: "User", email: inviteEmail, mobileNumber: "", department: inviteDepartment, role: inviteRole, status: "INVITED", lastActive: "Never", permissions: DEFAULT_ROLE_PERMISSIONS[inviteRole] || [],
      jobTitle: "", linkedInUrl: "", location: "", timezone: "", bio: "", managerId: inviteManagerId || null,
    });
    setInviteEmail(""); setInviteDepartment("Operations"); setInviteRole("GUEST"); setInviteManagerId(""); setIsInviteModalOpen(false);
    window.alert(`Invitation sent to ${inviteEmail}`);
  };

  const exportData = () => {
    const csv = "ID,Name,Email,Role,Status,Department,Last Active\n" + users.map(u => `${u.id},${u.firstName} ${u.lastName},${u.email},${u.role},${u.status},${u.department},${u.lastActive}`).join("\n");
    const link = document.createElement("a"); link.href = "data:text/csv;charset=utf-8," + encodeURI(csv); link.download = "altair_team_members_export.csv"; link.click();
  };

  const manageableUsers = filteredUsers.filter(u => canManageTarget(u.role, u.id));
  const allManageableSelected = manageableUsers.length > 0 && manageableUsers.every(u => selectedUsers.has(u.id));

  const selectAll = () => {
    if (allManageableSelected) {
      const newSelected = new Set(selectedUsers); manageableUsers.forEach(u => newSelected.delete(u.id)); setSelectedUsers(newSelected);
    } else {
      const newSelected = new Set(selectedUsers); manageableUsers.forEach(u => newSelected.add(u.id)); setSelectedUsers(newSelected);
    }
  };

  return (
    <div className="flex flex-col relative">
      <TeamHeader onExport={exportData} onInvite={() => setIsInviteModalOpen(true)} />
      <BulkActionsBar selectedCount={selectedUsers.size} onAction={handleBulkAction} onClear={clearSelection} />
      <TeamSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} onOpenFilters={() => setIsFilterModalOpen(true)} isFilterActive={isFilterActive} viewMode={viewMode} setViewMode={setViewMode} />

      <div className="flex items-center justify-between mb-4 px-2">
        {manageableUsers.length > 0 ? (
          <label className="flex items-center gap-2 cursor-pointer group select-none text-left">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${allManageableSelected ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>{allManageableSelected && <Check className="w-3 h-3" />}</div>
            <input type="checkbox" className="hidden" checked={allManageableSelected} onChange={selectAll} />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select All</span>
          </label>
        ) : <span className="text-xs font-medium text-slate-400 italic">No manageable users in current view</span>}
        <span className="text-xs font-semibold text-slate-400">Showing {filteredUsers.length} users</span>
      </div>

      <div className="flex-1 flex flex-col pb-8">
        <TeamListGrid 
          users={filteredUsers} selectedUsers={selectedUsers} onSelectUser={onSelectUser} onToggleSelect={(e, id) => { e.stopPropagation(); toggleSelectUser(id); }} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} canManageTarget={canManageTarget} viewMode={viewMode}
          renderUserMenu={(user, isManageable) => (
            <UserMenu 
              user={user} isManageable={isManageable} 
              onCopyInvite={() => { navigator.clipboard.writeText(`${window.location.origin}/?inviteToken=demo-token-${user.id}&inviteEmail=${encodeURIComponent(user.email)}`); alert("Invite link copied!"); setOpenMenuId(null); }}
              onEdit={() => { setOpenMenuId(null); onSelectUser(user.id); }}
              onRestore={() => { if (!isManageable || requireSuperAdminApproval()) return; updateUser(user.id, { status: 'ACTIVE' }); setOpenMenuId(null); }}
              onDelete={() => { if (isManageable) handleDelete(user); else window.alert("No permission."); }}
            />
          )}
        />
      </div>

      <TeamFilters isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} filterDepartment={filterDepartment} setFilterDepartment={setFilterDepartment} filterRole={filterRole} setFilterRole={setFilterRole} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
      <InviteUserModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} inviteEmail={inviteEmail} setInviteEmail={setInviteEmail} inviteDepartment={inviteDepartment} setInviteDepartment={setInviteDepartment} inviteRole={inviteRole} setInviteRole={setInviteRole} inviteManagerId={inviteManagerId} setInviteManagerId={setInviteManagerId} users={users} onSubmit={submitInvite} />
    </div>
  );
}
