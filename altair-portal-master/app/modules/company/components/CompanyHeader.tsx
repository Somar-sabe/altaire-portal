"use client";
/**
 * @file /app/modules/company/components/CompanyHeader.tsx
 * @description Renders a high-end, professionally localized Arabic header block with deep design values, active badges, and glowing effects.
 * @dependencies react, lucide-react (Building2, Sparkles)
 */

'use client';

import React from 'react';
import { Building2 } from 'lucide-react';

interface CompanyHeaderProps {
  companyName: string;
}

export default function CompanyHeader({ companyName }: CompanyHeaderProps) {
  return (
    <header className="flex shrink-0 flex-row items-center justify-between flex-nowrap gap-4 pt-4 md:pt-6 pb-2 mb-2 w-full overflow-hidden" id="company-header-view">
      {/* Name and Description */}
      <div className="min-w-0 flex-1">
        <h1 className="text-sm font-black text-slate-950 dark:text-slate-50 uppercase tracking-widest font-sans truncate">Company & Organization</h1>
        <p className="hidden sm:block text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 truncate" title="Manage basic corporate profile, department roster, and dynamic organizational details.">
          Manage basic corporate profile, department roster, and dynamic organizational details.
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-2 bg-slate-950 dark:bg-slate-800 text-white px-3 py-1.5 rounded-[8px] text-xs font-black uppercase tracking-wider shadow-sm select-none border border-slate-900 dark:border-slate-700 shrink-0">
          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="truncate max-w-[120px] md:max-w-none">{companyName}</span>
        </div>
      </div>
    </header>
  );
}
