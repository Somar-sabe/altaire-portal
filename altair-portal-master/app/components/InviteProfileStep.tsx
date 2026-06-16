"use client";
/**
 * @file /app/components/InviteProfileStep.tsx
 * @purpose Renders the profile setup step for the invitation flow.
 */

import React from 'react';
import { Key, ArrowRight, CheckCircle } from 'lucide-react';

interface InviteProfileStepProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  authLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function InviteProfileStep({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  newPassword,
  setNewPassword,
  authLoading,
  onSubmit,
}: InviteProfileStepProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-[10px] flex items-start gap-2.5 mb-2 text-left">
        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-left">
          <span className="text-xs font-bold text-slate-900 block font-sans">Invitation Verified!</span>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed mt-0.5">
            Please finalize your profile details to create your account.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">First Name</label>
          <input
            type="text"
            required
            placeholder="Jane"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/5 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex-1">
          <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Last Name</label>
          <input
            type="text"
            required
            placeholder="Smith"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/5 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
          Create Password
        </label>
        <div className="relative">
          <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="password"
            required
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/5 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={authLoading}
        className="w-full py-2.5 mt-2 bg-slate-900 hover:bg-slate-800 text-white rounded-[10px] text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
      >
        Complete Registration
        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
      </button>
    </form>
  );
}
