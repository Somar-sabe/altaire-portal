"use client";
/**
 * @file /app/modules/team/components/ProfileAvatarRow.tsx
 * @purpose Renders the avatar, name, and action buttons in the user profile.
 */

import React from "react";
import { Edit2 } from "lucide-react";

interface ProfileAvatarRowProps {
  user: any;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  canEditAnything: boolean;
  canManageTarget: boolean;
  activeTab: string;
  currentUser: any;
  onStatusChange: (status: 'ACTIVE' | 'SUSPENDED') => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function ProfileAvatarRow({
  user,
  isEditing,
  setIsEditing,
  canEditAnything,
  canManageTarget,
  activeTab,
  currentUser,
  onStatusChange,
  onCancel,
  onSave,
}: ProfileAvatarRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-2xl overflow-hidden">
            {user.photoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</>
            )}
          </div>
          <span 
            className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm shrink-0 ${
              user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
          />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-slate-900">{user.firstName} {user.lastName}</h3>
            {canEditAnything && !isEditing && activeTab === 'details' && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-slate-500 mt-1">
            <span className={`w-2 h-2 rounded-full shrink-0 ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-450'}`} />
            <p className="text-sm text-slate-500">{user.jobTitle ? `${user.jobTitle} • ` : ""}{user.role}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {!isEditing && activeTab === 'details' && user.id !== currentUser?.id && canManageTarget && user.status !== 'ACTIVE' && user.status !== 'Offline' && (
          <button
            onClick={() => onStatusChange('ACTIVE')}
            className={`px-4 py-2 text-sm font-semibold rounded-[10px] transition-colors border ${
              user.status === 'INACTIVE' 
                ? 'text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-200' 
                : 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200 border-emerald-200'
            }`}
          >
            {user.status === 'INACTIVE' ? 'Re-activate Account' : 'Activate Account'}
          </button>
        )}

        {isEditing && (
          <>
            <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Cancel
            </button>
            <button onClick={onSave} className="bg-black text-white px-4 py-2 rounded-[10px] text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
              Save Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
}
