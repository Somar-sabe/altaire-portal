"use client";
/**
 * @file /app/components/SidebarBottomSection.tsx
 * @purpose Renders the bottom section of the sidebar (Settings, Company Profile, Help).
 */

import React from 'react';
import Link from 'next/link';
import { Settings, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarBottomSectionProps {
  activeTab: string;
  isCollapsed: boolean;
  currentUser: any;
  handleItemClick: (id: string) => void;
}

export default function SidebarBottomSection({
  activeTab, isCollapsed, currentUser, handleItemClick
}: SidebarBottomSectionProps) {
  return (
    <div className="mb-4">
      <nav className="space-y-0.5 pt-4 border-t border-slate-100/60 mt-4 text-left">
        <Link
          href="/settings"
          title={isCollapsed ? 'Settings' : undefined}
          onClick={() => handleItemClick('settings')}
          className={cn(
            "w-full text-left flex items-center rounded-[10px] transition-all gap-4 outline-none font-medium text-xs select-none group relative mb-2",
            activeTab === 'settings' ? "bg-slate-950 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
            isCollapsed ? "justify-center p-3" : "px-3 py-2.5"
          )}
        >
          <Settings className={cn("w-4.5 h-4.5 shrink-0 transition-colors", activeTab === 'settings' ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
          {!isCollapsed && <span className="flex-1 font-sans animate-fade-in">Settings</span>}
        </Link>
        
        <div className="relative">
          <Link 
            href="/company"
            onClick={() => handleItemClick('company')}
            className={cn(
              "w-full flex border rounded-[10px] mb-2 overflow-hidden hover:bg-slate-100/50 transition-colors cursor-pointer text-left focus:outline-none",
              activeTab === 'company' ? "bg-slate-950 text-white border-slate-950 shadow-sm" : "bg-slate-50 border-slate-100 text-slate-800",
              isCollapsed ? "p-1 justify-center" : "p-2 items-center gap-2.5"
            )}
          >
             <div className={cn(
               "w-8 h-8 rounded-full flex flex-col items-center justify-center text-xs font-black shrink-0 overflow-hidden",
               activeTab === 'company' ? "bg-white text-slate-950" : "bg-slate-950 text-white"
             )}>
                {currentUser?.photoUrl ? (
                   /* eslint-disable-next-line @next/next/no-img-element */
                   <img src={currentUser.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : "Ac"}
             </div>
             {!isCollapsed && (
               <div className="flex flex-col flex-1 overflow-hidden">
                 <span className={cn("text-sm font-bold truncate", activeTab === 'company' ? "text-white" : "text-slate-800")}>Acme Corp</span>
                 <span className={cn("text-[11px] font-medium truncate", activeTab === 'company' ? "text-slate-200" : "text-slate-500")}>{currentUser ? currentUser.email : "@acme.com"}</span>
               </div>
             )}
          </Link>
        </div>

        <Link
          href="/help"
          title={isCollapsed ? 'Help & Support' : undefined}
          onClick={() => handleItemClick('help')}
          className={cn(
            "w-full text-left flex items-center rounded-[10px] transition-all gap-4 outline-none font-medium text-xs select-none group relative",
            activeTab === 'help' ? "bg-slate-950 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
            isCollapsed ? "justify-center p-3" : "px-3 py-2.5"
          )}
        >
          <HelpCircle className={cn("w-4.5 h-4.5 shrink-0 transition-colors", activeTab === 'help' ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
          {!isCollapsed && <span className="flex-1 font-sans animate-fade-in">Help & Support</span>}
        </Link>
      </nav>

      {!isCollapsed && (
         <div className="flex items-center justify-center gap-3 pt-5 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <a href="#" className="hover:text-slate-600 transition-colors">About</a>
            <span>&middot;</span>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
            <span>&middot;</span>
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
         </div>
      )}
    </div>
  );
}
