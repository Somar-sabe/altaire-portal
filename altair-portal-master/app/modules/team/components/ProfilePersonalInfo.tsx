"use client";
/**
 * @file /app/modules/team/components/ProfilePersonalInfo.tsx
 * @purpose Renders the personal information section of the user profile.
 */

import React from "react";
import { Mail, Phone } from "lucide-react";

interface ProfilePersonalInfoProps {
  user: any;
  isEditing: boolean;
  canEditInfo: boolean;
  formData: any;
  setFormData: (data: any) => void;
}

export default function ProfilePersonalInfo({
  user,
  isEditing,
  canEditInfo,
  formData,
  setFormData,
}: ProfilePersonalInfoProps) {
  return (
    <section className="text-left">
      <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 uppercase tracking-widest">Personal</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">First Name</label>
          {isEditing && canEditInfo ? (
            <input 
              type="text" 
              value={formData.firstName} 
              onChange={e => setFormData({...formData, firstName: e.target.value})} 
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
            />
          ) : (
            <div className="text-sm font-medium text-slate-900">{user.firstName}</div>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Last Name</label>
          {isEditing && canEditInfo ? (
            <input 
              type="text" 
              value={formData.lastName} 
              onChange={e => setFormData({...formData, lastName: e.target.value})} 
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
            />
          ) : (
            <div className="text-sm font-medium text-slate-900">{user.lastName}</div>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
          {isEditing && canEditInfo ? (
            <input 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
            />
          ) : (
            <div className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" /> {user.email}
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mobile</label>
          {isEditing && canEditInfo ? (
            <input 
              type="tel" 
              value={formData.mobileNumber} 
              onChange={e => setFormData({...formData, mobileNumber: e.target.value})} 
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
            />
          ) : (
            <div className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" /> {user.mobileNumber || "Not provided"}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
