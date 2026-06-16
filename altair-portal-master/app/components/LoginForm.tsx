"use client";
/**
 * @file /app/components/LoginForm.tsx
 * @purpose Renders the registered user login form.
 */

import React from 'react';
import { Mail, Key, ArrowRight } from 'lucide-react';

interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  authLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  authLoading,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
          Operating Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="email"
            required
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/5 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
          Password Key
        </label>
        <div className="relative">
          <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/5 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={authLoading}
        className="w-full py-2.5 mt-2 bg-slate-900 hover:bg-slate-800 text-white rounded-[10px] text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
      >
        Sign In to Workspace
        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
      </button>
    </form>
  );
}
