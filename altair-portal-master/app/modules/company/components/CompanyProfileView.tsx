"use client";
/**
 * @file /app/modules/company/components/CompanyProfileView.tsx
 * @description Simplified profile block for viewing and editing corporate details.
 * @dependencies react, ../types, lucide-react (Building, FileText, Mail, Phone, MapPin, Edit2, Check)
 */

'use client';

import React, { useState } from 'react';
import { Building, FileText, Mail, Phone, MapPin, Edit2, Check } from 'lucide-react';
import { CompanyProfile } from '../types';

interface ProfileViewProps {
  initialProfile: CompanyProfile;
  onSave: (p: CompanyProfile) => void;
}

export default function CompanyProfileView({ initialProfile, onSave }: ProfileViewProps) {
  const [profile, setProfile] = useState<CompanyProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[12px] p-6 space-y-5" id="profile-card">
      <div className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-nowrap w-full overflow-hidden gap-4">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider block truncate">Information & HQ</span>
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight truncate">Corporate General Profile</h3>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-[8px] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="legal-name">Legal Name of EnterpriseLabel</label>
              <input
                id="legal-name"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label>Commercial Registration No.</label>
              <input
                type="text"
                value={profile.registrationNo}
                onChange={(e) => setProfile({ ...profile, registrationNo: e.target.value })}
                className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono font-bold"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label>Official Contact Email</label>
              <input
                type="email"
                value={profile.contactEmail}
                onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
                className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono font-bold"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label>Direct Core Phone Number</label>
              <input
                type="text"
                value={profile.contactPhone}
                onChange={(e) => setProfile({ ...profile, contactPhone: e.target.value })}
                className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono font-bold"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label>Registered Headquarters Address</label>
              <input
                type="text"
                value={profile.baseAddress}
                onChange={(e) => setProfile({ ...profile, baseAddress: e.target.value })}
                className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => { setProfile(initialProfile); setIsEditing(false); }}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-[8px] tracking-wider cursor-pointer font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-950 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-[8px] flex items-center gap-1.5 cursor-pointer transition-all font-bold"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-705 dark:text-slate-300">
          <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/60 rounded-[8px] flex items-center gap-3">
            <Building className="w-4 h-4 text-indigo-500 shrink-0" />
            <div className="text-left min-w-0 flex-1">
              <span className="text-xs text-slate-400 block pb-0.5">Company Legal Name</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold block truncate">{profile.name}</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/60 rounded-[8px] flex items-center gap-3">
            <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
            <div className="text-left min-w-0 flex-1">
              <span className="text-xs text-slate-400 block pb-0.5">Commercial Registration No.</span>
              <span className="text-slate-900 dark:text-slate-100 font-mono font-bold block truncate">{profile.registrationNo || 'Not Specified'}</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/60 rounded-[8px] flex items-center gap-3">
            <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
            <div className="text-left min-w-0 flex-1">
              <span className="text-xs text-slate-400 block pb-0.5">Contact Email</span>
              <span className="text-slate-900 dark:text-slate-100 font-mono font-bold block truncate">{profile.contactEmail}</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/60 rounded-[8px] flex items-center gap-3">
            <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
            <div className="text-left min-w-0 flex-1">
              <span className="text-xs text-slate-400 block pb-0.5">Contact Phone</span>
              <span className="text-slate-900 dark:text-slate-100 font-mono font-bold block truncate">{profile.contactPhone || 'Not Specified'}</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/60 rounded-[8px] flex items-center gap-3 sm:col-span-2">
            <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
            <div className="text-right min-w-0 flex-1 text-left">
              <span className="text-xs text-slate-400 block pb-0.5">Headquarter Address</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold block truncate">{profile.baseAddress || 'Not Specified'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
