"use client";
/**
 * @file /app/modules/team/components/InviteUserModal.tsx
 * @purpose Renders the modal to invite new users to the platform.
 */

import React from "react";
import { X, Plus } from "lucide-react";
import type { Department, Role } from "../types";
import { ROLE_LABELS } from "../types";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  inviteDepartment: Department;
  setInviteDepartment: (dept: Department) => void;
  inviteRole: Role;
  setInviteRole: (role: Role) => void;
  inviteManagerId: string;
  setInviteManagerId: (id: string) => void;
  users: any[];
  onSubmit: (e: React.FormEvent) => void;
}

export default function InviteUserModal({
  isOpen,
  onClose,
  inviteEmail,
  setInviteEmail,
  inviteDepartment,
  setInviteDepartment,
  inviteRole,
  setInviteRole,
  inviteManagerId,
  setInviteManagerId,
  users,
  onSubmit,
}: InviteUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-black text-slate-900 uppercase tracking-tight">Invite Member</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20"
              placeholder="e.g. member@company.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Department</label>
              <select
                value={inviteDepartment}
                onChange={(e) => setInviteDepartment(e.target.value as Department)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20"
              >
                {["Operations", "Sales", "Marketing", "Engineering", "Legal", "Finance", "Executive"].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Initial Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as Role)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20"
              >
                {Object.entries(ROLE_LABELS).filter(([v]) => v !== 'SUPER_ADMIN').map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Reports To (Manager)</label>
            <select
              value={inviteManagerId}
              onChange={(e) => setInviteManagerId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20"
            >
              <option value="">No Direct Manager</option>
              {users.filter(u => u.role !== 'GUEST').map(u => (
                <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({ROLE_LABELS[u.role as Role] || u.role})</option>
              ))}
            </select>
          </div>
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-[12px] text-sm font-black hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-black text-white rounded-[12px] text-sm font-black hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Send Invite</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
