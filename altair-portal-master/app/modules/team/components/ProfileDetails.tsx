"use client";
/**
 * @file /app/modules/team/components/ProfileDetails.tsx
 * @purpose Renders the professional details section of the user profile.
 */

import React from "react";
import type { Department, Role, UserStatus } from "../types";

interface ProfileDetailsProps {
  user: any;
  allUsers: any[];
  isEditing: boolean;
  canEditInfo: boolean;
  canEditPermissionsAndRole: boolean;
  formData: any;
  setFormData: (data: any) => void;
  onRoleChange: (role: string) => void;
}

export default function ProfileDetails({
  user,
  allUsers,
  isEditing,
  canEditInfo,
  canEditPermissionsAndRole,
  formData,
  setFormData,
  onRoleChange,
}: ProfileDetailsProps) {
  return (
    <section className="text-left">
      <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 uppercase tracking-widest">Details</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Job Title</label>
          {isEditing && canEditInfo ? (
            <input type="text" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          ) : (
            <div className="text-sm font-medium text-slate-900">{user.jobTitle || "Not provided"}</div>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Location</label>
          {isEditing && canEditInfo ? (
            <div className="flex flex-col sm:flex-row gap-2">
               <input type="text" placeholder="City..." value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full sm:w-1/2 px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
               <input type="text" placeholder="Timezone..." value={formData.timezone} onChange={e => setFormData({...formData, timezone: e.target.value})} className="w-full sm:w-1/2 px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
          ) : (
            <div className="text-sm font-medium text-slate-900">
              {user.location || "Default City"} / {user.timezone || "UTC"}
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Department</label>
          {isEditing && canEditPermissionsAndRole ? (
            <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value as Department})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
              {["Executive", "Operations", "Sales", "Engineering", "Marketing", "Customer Support"].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          ) : (
            <div className="text-sm font-medium text-slate-900">{user.department}</div>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Role</label>
          {isEditing && canEditPermissionsAndRole ? (
            <select value={formData.role} onChange={e => onRoleChange(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
              {["Super Admin", "Admin", "Manager", "Sales Agent", "Marketing Agent", "Guest"].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          ) : (
            <div className="text-sm font-medium text-slate-900">{user.role}</div>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Account Status</label>
          {isEditing && canEditInfo ? (
            <select 
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value as UserStatus})} 
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Active">Active / Online</option>
              <option value="Offline">Offline</option>
              <option value="Suspended">Suspended</option>
              <option value="Deleted">Deactivated / Deleted</option>
            </select>
          ) : (
            <div className="text-sm font-medium text-slate-900">{user.status}</div>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-bold text-slate-500">Direct Manager</label>
          {isEditing && canEditPermissionsAndRole ? (
            <select
              value={formData.managerId || ""}
              onChange={e => setFormData({ ...formData, managerId: e.target.value || null })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">No Direct Manager</option>
              {allUsers
                .filter(u => u.id !== user.id && u.status !== 'INACTIVE')
                .map(u => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.role})
                  </option>
                ))}
            </select>
          ) : (
            <div className="text-sm font-medium text-slate-900">
              {(() => {
                const manager = allUsers.find(u => u.id === user.managerId);
                return manager ? `${manager.firstName} ${manager.lastName} (${manager.role})` : "None";
              })()}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
