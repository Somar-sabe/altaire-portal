"use client";
/**
 * @file /app/modules/company/components/DeptDetailHeader.tsx
 * @purpose Renders the header and description for a department's detail page.
 */

import React from 'react';
import { ArrowLeft, BadgeInfo } from 'lucide-react';
import { Department } from '../types';

interface DeptDetailHeaderProps {
  department: Department;
  onBack: () => void;
}

export default function DeptDetailHeader({ department, onBack }: DeptDetailHeaderProps) {
  return (
    <>
      <div className="flex flex-row items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 flex-nowrap w-full overflow-hidden">
        <button onClick={onBack} className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 rounded-[8px] cursor-pointer shrink-0 transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-705 dark:text-slate-300" />
        </button>
        <div className="min-w-0 flex-1 text-left">
          <span className="hidden sm:block text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-widest">Department Structure</span>
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight truncate">{department.name}</h2>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-[12px] shadow-sm flex items-start gap-3 text-left">
        <BadgeInfo className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold uppercase tracking-wider">
          {department.description || 'No structural objectives registered yet.'}
        </p>
      </div>
    </>
  );
}
