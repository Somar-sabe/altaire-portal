#!/bin/bash
mkdir -p app/\(dashboard\)/overview
mkdir -p app/\(dashboard\)/leads
mkdir -p app/\(dashboard\)/team
mkdir -p app/\(dashboard\)/settings
mkdir -p app/\(dashboard\)/feed
mkdir -p app/\(dashboard\)/workspace
mkdir -p app/\(dashboard\)/company
mkdir -p app/\(dashboard\)/marketing
mkdir -p app/\(dashboard\)/reports
mkdir -p app/\(dashboard\)/help

cat << 'PAGE' > app/\(dashboard\)/overview/page.tsx
'use client';
import React from 'react';
import { useAuthStore } from '@/app/modules/team/authStore';

export default function OverviewPage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  return (
    <div className="flex-1 h-full w-full flex flex-col items-center justify-center bg-transparent md:bg-white/50 rounded-none md:rounded-[10px] border-0 md:border md:border-slate-200/50 shadow-none md:shadow-sm">
      <div className="text-center px-4">
         <h2 className="text-2xl font-black text-slate-800 mb-2 capitalize">Overview Module</h2>
         <p className="text-slate-500 font-medium text-sm">Welcome to the Altair Unified Dashboard, {currentUser?.firstName || 'User'}!</p>
      </div>
    </div>
  );
}
PAGE

cat << 'PAGE' > app/\(dashboard\)/leads/page.tsx
import LeadsModule from '@/app/modules/leads/leads.module';
export default function LeadsPage() {
  return <div className="flex-1 w-full p-0 h-full overflow-y-auto scrollbar-thin"><LeadsModule /></div>;
}
PAGE

cat << 'PAGE' > app/\(dashboard\)/team/page.tsx
import TeamModule from '@/app/modules/team/team.module';
export default function TeamPage() {
  return <div className="flex-1 w-full p-2.5 sm:p-4 h-full overflow-y-auto"><TeamModule /></div>;
}
PAGE

cat << 'PAGE' > app/\(dashboard\)/settings/page.tsx
import SettingsModule from '@/app/modules/settings/SettingsModule';
export default function SettingsPage() {
  return <div className="flex-1 w-full p-2.5 sm:p-4 h-full overflow-y-auto"><SettingsModule /></div>;
}
PAGE

cat << 'PAGE' > app/\(dashboard\)/feed/page.tsx
import CompanyFeedModule from '@/app/modules/company-feed/company-feed.module';
export default function FeedPage() {
  return <div className="flex-1 w-full p-2.5 sm:p-4 h-full overflow-y-auto bg-slate-50"><CompanyFeedModule /></div>;
}
PAGE

cat << 'PAGE' > app/\(dashboard\)/workspace/page.tsx
import WorkspaceModule from '@/app/modules/workspace/workspace.module';
export default function WorkspacePage() {
  return <div className="flex-1 w-full p-2.5 sm:p-4 h-full overflow-y-auto"><WorkspaceModule /></div>;
}
PAGE

cat << 'PAGE' > app/\(dashboard\)/company/page.tsx
import CompanyModule from '@/app/modules/company/company.module';
export default function CompanyPage() {
  return <div className="flex-1 w-full p-2.5 sm:p-4 h-full overflow-y-auto"><CompanyModule /></div>;
}
PAGE

cat << 'PAGE' > app/\(dashboard\)/marketing/page.tsx
export default function MarketingPage() {
  return (
    <div className="flex-1 h-full w-full flex items-center justify-center bg-transparent md:bg-white/50 rounded-none md:rounded-[10px] border-0 md:border md:border-slate-200/50 shadow-none md:shadow-sm">
      <div className="text-center px-4">
         <h2 className="text-2xl font-black text-slate-800 mb-2 capitalize">Marketing Module</h2>
         <p className="text-slate-500 font-medium text-sm">Pending structural implementation (Phase 2)</p>
      </div>
    </div>
  );
}
PAGE

cat << 'PAGE' > app/\(dashboard\)/reports/page.tsx
export default function ReportsPage() {
  return (
    <div className="flex-1 h-full w-full flex items-center justify-center bg-transparent md:bg-white/50 rounded-none md:rounded-[10px] border-0 md:border md:border-slate-200/50 shadow-none md:shadow-sm">
      <div className="text-center px-4">
         <h2 className="text-2xl font-black text-slate-800 mb-2 capitalize">Reports Module</h2>
         <p className="text-slate-500 font-medium text-sm">Pending structural implementation (Phase 2)</p>
      </div>
    </div>
  );
}
PAGE

cat << 'PAGE' > app/\(dashboard\)/help/page.tsx
export default function HelpPage() {
  return (
    <div className="flex-1 h-full w-full bg-white md:rounded-[10px] md:border border-slate-200/50 p-8 shadow-sm flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-[20px] flex items-center justify-center mb-6">
        <span className="text-2xl font-black text-slate-800">?</span>
      </div>
      <h2 className="text-xl font-black text-slate-900 mb-2">Help & Support</h2>
      <p className="text-slate-500 font-medium text-sm max-w-sm leading-relaxed mb-8">
        Get assistance with the Enterprise Unified Administration portal. View guides, contact administration, or browse FAQs.
      </p>
      <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-[10px] text-xs font-bold transition-all shadow-sm">
        Contact Support
      </button>
    </div>
  );
}
PAGE

echo "Done"
