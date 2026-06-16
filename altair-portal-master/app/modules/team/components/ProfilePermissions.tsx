"use client";
/**
 * @file /app/modules/team/components/ProfilePermissions.tsx
 * @purpose Renders the permissions section of the user profile.
 */

import React from "react";
import { Check } from "lucide-react";
import type { Permission } from "../types";
import { PERMISSION_LABELS } from "../types";

interface ProfilePermissionsProps {
  user: any;
  isEditing: boolean;
  canEditPermissionsAndRole: boolean;
  formData: any;
  onTogglePermission: (perm: Permission) => void;
}

export default function ProfilePermissions({
  user,
  isEditing,
  canEditPermissionsAndRole,
  formData,
  onTogglePermission,
}: ProfilePermissionsProps) {
  return (
    <section className="text-left">
      <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 uppercase tracking-widest">Permissions</h4>
      {isEditing && canEditPermissionsAndRole ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 p-6 rounded-[10px] border border-slate-100">
          {Object.entries(PERMISSION_LABELS).map(([key, label]) => {
            const perm = key as Permission;
            const isChecked = formData.permissions.includes(perm);
            return (
              <label key={perm} className="flex items-start gap-3 cursor-pointer group">
                <div className={`mt-0.5 w-4 h-4 rounded border flex flex-shrink-0 items-center justify-center transition-colors ${isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white group-hover:border-emerald-400'}`}>
                  {isChecked && <Check className="w-3 h-3" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isChecked}
                  onChange={() => onTogglePermission(perm)}
                />
                <span className="text-xs font-medium text-slate-700 select-none group-hover:text-slate-900 leading-tight">
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {user.permissions.length > 0 ? (
              user.permissions.map((p: any) => (
                <span key={p} className="inline-flex items-center px-2.5 py-1 rounded-[10px] text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {PERMISSION_LABELS[p as Permission] || p}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">No special permissions assigned.</span>
            )}
          </div>
          {!canEditPermissionsAndRole && (
            <p className="text-xs text-slate-400 mt-3">Contact a Super Admin to request changes to your permissions.</p>
          )}
        </>
      )}
    </section>
  );
}
