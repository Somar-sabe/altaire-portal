"use client";
/**
 * @file /app/components/InviteVerifyStep.tsx
 * @purpose Renders the email verification step for the invitation flow.
 */

import React from 'react';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';

interface InviteVerifyStepProps {
  email: string;
  setEmail: (val: string) => void;
  authLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function InviteVerifyStep({
  email,
  setEmail,
  authLoading,
  onSubmit,
}: InviteVerifyStepProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-[10px] flex items-start gap-2.5 mb-2 text-left">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
        <div className="text-left">
          <span className="text-xs font-bold text-slate-900 block font-sans">Verification Hub</span>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed mt-0.5">
            Enter your email to verify your access invitation.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
          Invited Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="email"
            required
            placeholder="invited-email@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/5 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={authLoading}
        className="w-full py-2.5 mt-2 bg-slate-900 hover:bg-slate-800 text-white rounded-[10px] text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm animate-pulse"
      >
        Verify Access Invitation
        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
      </button>
    </form>
  );
}
