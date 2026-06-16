"use client";
/**
 * @file /app/components/LandingNav.tsx
 * @purpose Renders the navigation bar for the landing screen.
 */

import React from 'react';

interface LandingNavProps {
  onGoToLogin: () => void;
}

export default function LandingNav({ onGoToLogin }: LandingNavProps) {
  return (
    <nav className="fixed top-0 w-full px-6 sm:px-12 py-5 flex items-center justify-between z-50 backdrop-blur-xl border-b border-slate-200/40 bg-white/70">
      <div className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-0.5">
        altair<span className="text-emerald-500 font-extrabold">:</span>
      </div>
      
      <button 
        onClick={onGoToLogin}
        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-[8px] hover:scale-102 active:scale-98 transition-all shadow-sm cursor-pointer"
      >
        Workspace Login
      </button>
    </nav>
  );
}
