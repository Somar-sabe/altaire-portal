"use client";
/**
 * @file /app/modules/team/components/UserMenu.tsx
 * @purpose Renders the dropdown menu for a user in the team list.
 */

import React from "react";
import { MoreHorizontal, Edit, Check, Trash2 } from "lucide-react";

interface UserMenuProps {
  user: any;
  isManageable: boolean;
  onCopyInvite: () => void;
  onEdit: () => void;
  onRestore: () => void;
  onDelete: () => void;
}

export default function UserMenu({
  user,
  isManageable,
  onCopyInvite,
  onEdit,
  onRestore,
  onDelete,
}: UserMenuProps) {
  return (
    <div className="absolute right-0 top-9 mt-1 w-44 bg-white rounded-[10px] shadow-lg border border-slate-200 py-1 z-50 text-left">
      {user.status === "Invited" && (
        <button
          onClick={(e) => { e.stopPropagation(); onCopyInvite(); }}
          className="w-full text-left px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 border-b border-slate-50"
        >
          <MoreHorizontal className="w-4 h-4 text-indigo-500" />
          Copy Invite Link
        </button>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
        className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
      >
        <Edit className="w-4 h-4 text-slate-400" />
        Edit User
      </button>
      {user.status === 'INACTIVE' ? (
        <button
          onClick={(e) => { e.stopPropagation(); onRestore(); }}
          className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${isManageable ? 'text-indigo-600 hover:bg-indigo-50 font-semibold' : 'text-slate-400 opacity-50 cursor-not-allowed'}`}
        >
          <Check className={`w-4 h-4 ${isManageable ? 'text-indigo-400' : 'text-slate-400'}`} />
          Restore Account
        </button>
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${isManageable ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-400 opacity-50 cursor-not-allowed'}`}
        >
          <Trash2 className={`w-4 h-4 ${isManageable ? 'text-rose-400' : 'text-slate-400'}`} />
          Delete User
        </button>
      )}
    </div>
  );
}
