"use client";
/**
 * @file /app/modules/team/components/TeamListGrid.tsx
 * @purpose Renders the grid of user cards.
 */

import React from "react";
import { Search } from "lucide-react";
import UserCard from "./UserCard";
import UserListItem from "./UserListItem";

interface TeamListGridProps {
  users: any[];
  selectedUsers: Set<string>;
  onSelectUser: (id: string) => void;
  onToggleSelect: (e: React.MouseEvent, id: string) => void;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  canManageTarget: (role: any, id: string) => boolean;
  renderUserMenu: (user: any, isManageable: boolean) => React.ReactNode;
  viewMode?: 'grid' | 'list';
}

export default function TeamListGrid({
  users,
  selectedUsers,
  onSelectUser,
  onToggleSelect,
  openMenuId,
  setOpenMenuId,
  canManageTarget,
  renderUserMenu,
  viewMode = 'grid',
}: TeamListGridProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-slate-200/60 rounded-[12px] flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <p className="text-slate-600 font-medium">No members found</p>
        <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters.</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
        {users.map((user) => {
          const isManageable = canManageTarget(user.role, user.id);
          return (
            <UserListItem
              key={user.id}
              user={user}
              isManageable={isManageable}
              isSelected={selectedUsers.has(user.id)}
              onSelect={(e) => onToggleSelect(e, user.id)}
              onClick={() => onSelectUser(user.id)}
              onToggleMenu={(e) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === user.id ? null : user.id);
              }}
              isMenuOpen={openMenuId === user.id}
              renderMenu={() => renderUserMenu(user, isManageable)}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => {
        const isManageable = canManageTarget(user.role, user.id);
        return (
          <UserCard
            key={user.id}
            user={user}
            isManageable={isManageable}
            isSelected={selectedUsers.has(user.id)}
            onSelect={(e) => onToggleSelect(e, user.id)}
            onClick={() => onSelectUser(user.id)}
            onToggleMenu={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === user.id ? null : user.id);
            }}
            isMenuOpen={openMenuId === user.id}
            renderMenu={() => renderUserMenu(user, isManageable)}
          />
        );
      })}
    </div>
  );
}
