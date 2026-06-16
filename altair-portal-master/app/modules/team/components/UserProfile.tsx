"use client";
/**
 * @file /app/modules/team/components/UserProfile.tsx
 * @purpose Renders the single user profile with Public and Private tabs.
 */

import React from "react";
import { useAuthStore } from "../authStore";

// Sub-components
import ProfileHeader from "./ProfileHeader";
import ProfileAvatarRow from "./ProfileAvatarRow";
import ProfilePersonalInfo from "./ProfilePersonalInfo";
import ProfileDetails from "./ProfileDetails";
import ProfileBio from "./ProfileBio";
import ProfilePermissions from "./ProfilePermissions";
import ProfileActivityLog from "./ProfileActivityLog";

// Hooks
import { useUserProfileData } from "../hooks/useUserProfileData";

interface UserProfileProps {
  userId: string;
  onBack: () => void;
}

export default function UserProfile({ userId, onBack }: UserProfileProps) {
  const {
    user, isLoadingUsers, isEditing, setIsEditing, activeTab, setActiveTab,
    isPrivate, canEditInfo, canEditPermissionsAndRole, canEditAnything, canManageTarget,
    formData, setFormData, handleSave, handleRoleChange, togglePermission, handleStatusChange,
    allUsers, currentUser
  } = useUserProfileData(userId);

  // Sync rehydrated session if needed
  React.useEffect(() => {
    if (user && currentUser && user.email === currentUser.email && user.id !== currentUser.id) {
      // GPT-Codex (G) BEGIN: keep profile rehydration in memory only; Auth.js owns persistent session state.
      useAuthStore.setState({ currentUser: user });
      // GPT-Codex (G) END: removed stale localStorage session mirror.
    }
  }, [user, currentUser]);

  if (!user && isLoadingUsers) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200/60 rounded-[10px] w-full max-w-3xl mx-auto h-64">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <span className="text-xs text-slate-500 font-bold tracking-widest uppercase mt-4 animate-pulse">Loading Profile...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200/60 rounded-[10px] w-full max-w-3xl mx-auto h-64 text-center">
        <span className="text-2xl mb-2">👤</span>
        <h3 className="text-base font-bold text-slate-800">User Profile Not Found</h3>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-[10px] text-xs font-bold transition-all shadow-sm">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white border border-slate-200/60 rounded-[10px] shadow-sm overflow-hidden w-full max-w-3xl mx-auto h-full">
      <ProfileHeader onBack={onBack} isPrivate={isPrivate} status={user.status} />

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="max-w-3xl space-y-8">
          <ProfileAvatarRow 
            user={user} isEditing={isEditing} setIsEditing={setIsEditing} canEditAnything={canEditAnything} 
            canManageTarget={canManageTarget} activeTab={activeTab} currentUser={currentUser} 
            onStatusChange={handleStatusChange} onCancel={() => setIsEditing(false)} onSave={handleSave} 
          />

          {user.status === 'INACTIVE' && (
            <div className="bg-rose-50 border border-rose-200 rounded-[10px] p-4 flex items-start gap-3 text-left">
              <span className="text-rose-500 font-bold mt-0.5">⚠️</span>
              <div>
                <h4 className="text-sm font-bold text-rose-800">Account Deactivated</h4>
                <p className="text-xs text-rose-700/80 mt-1">This user has been soft-deleted. Their records are kept for data integrity.</p>
              </div>
            </div>
          )}

          {user.status === 'SUSPENDED' && (
            <div className="bg-amber-50 border border-amber-200 rounded-[10px] p-4 flex items-start gap-3 text-left">
              <span className="text-amber-500 font-bold mt-0.5">⚠️</span>
              <div>
                <h4 className="text-sm font-bold text-amber-800">Account Suspended</h4>
                <p className="text-xs text-amber-700/80 mt-1">This user currently does not have access to the platform.</p>
              </div>
            </div>
          )}

          {currentUser && user.managerId === currentUser.id && (
            <div className="flex border-b border-slate-250 mb-6 gap-6">
              {['details', 'activity'].map(tab => (
                <button key={tab} onClick={() => { setActiveTab(tab as any); setIsEditing(false); }} className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer capitalize ${activeTab === tab ? 'border-emerald-500 text-slate-900 font-bold' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{tab === 'details' ? 'User Details' : 'Activity Log'}</button>
              ))}
            </div>
          )}

          <div className="space-y-8">
            {activeTab === 'details' ? (
              <>
                <ProfilePersonalInfo user={user} isEditing={isEditing} canEditInfo={canEditInfo} formData={formData} setFormData={setFormData} />
                <ProfileDetails user={user} allUsers={allUsers} isEditing={isEditing} canEditInfo={canEditInfo} canEditPermissionsAndRole={canEditPermissionsAndRole} formData={formData} setFormData={setFormData} onRoleChange={handleRoleChange} />
                <ProfileBio user={user} isEditing={isEditing} canEditInfo={canEditInfo} formData={formData} setFormData={setFormData} />
                <ProfilePermissions user={user} isEditing={isEditing} canEditPermissionsAndRole={canEditPermissionsAndRole} formData={formData} onTogglePermission={togglePermission} />
              </>
            ) : (
              <ProfileActivityLog currentUser={currentUser} user={user} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
