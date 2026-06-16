"use client";
/**
 * @file /app/modules/team/components/ProfileBio.tsx
 * @purpose Renders the biography section of the user profile.
 */

import React from "react";

interface ProfileBioProps {
  user: any;
  isEditing: boolean;
  canEditInfo: boolean;
  formData: any;
  setFormData: (data: any) => void;
}

export default function ProfileBio({
  user,
  isEditing,
  canEditInfo,
  formData,
  setFormData,
}: ProfileBioProps) {
  return (
    <section className="text-left">
      <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 uppercase tracking-widest">Bio</h4>
      <div>
        {isEditing && canEditInfo ? (
          <textarea 
            rows={3} 
            value={formData.bio} 
            onChange={e => setFormData({...formData, bio: e.target.value})} 
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
          />
        ) : (
          <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-[10px] border border-slate-100">
            {user.bio || "No biography provided."}
          </div>
        )}
      </div>
    </section>
  );
}
