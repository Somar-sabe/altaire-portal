"use client";
/**
 * @file /app/components/AccountDropdown.tsx
 * @purpose Renders the account profile dropdown with logout and quick settings.
 */

import React from 'react';
import { User, Settings, Shield, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROLE_LABELS } from '@/app/modules/team/types';

interface AccountDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  currentUser: any;
  onLogout: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  innerRef: React.RefObject<HTMLDivElement | null>;
}

export default function AccountDropdown({
  isOpen, onToggle, currentUser, onLogout, onOpenProfile, onOpenSettings, innerRef
}: AccountDropdownProps) {
  const initials = currentUser ? `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}` : 'U';
  const userDisplayName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest User';

  return (
    <div className="relative" ref={innerRef}>
      <button 
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2.5 p-1.5 hover:bg-slate-50 transition-colors rounded-[12px] group cursor-pointer border border-transparent hover:border-slate-200/50"
      >
        <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center text-xs font-black ring-2 ring-white shadow-sm overflow-hidden shrink-0">
          {currentUser?.photoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={currentUser.photoUrl} alt="" className="w-full h-full object-cover" />
          ) : initials}
        </div>
        <div className="hidden sm:flex flex-col items-start leading-none gap-0.5">
          <span className="text-xs font-black text-slate-900 truncate max-w-24">{userDisplayName}</span>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{ROLE_LABELS[currentUser?.role as keyof typeof ROLE_LABELS] || currentUser?.role || 'GUEST'}</span>
        </div>
        <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-[12px] shadow-xl overflow-hidden py-1 z-50 animate-fade-in origin-top-right text-left">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.email || 'guest@example.com'}</p>
          </div>
          <div className="py-1">
            <button onClick={() => { onOpenProfile?.(); onToggle(); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"><User className="w-3.5 h-3.5" /> Your Profile</button>
            <button onClick={() => { onOpenSettings?.(); onToggle(); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"><Settings className="w-3.5 h-3.5" /> Admin Settings</button>
            {currentUser?.role === 'SUPER_ADMIN' && (
              <button onClick={onToggle} className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"><Shield className="w-3.5 h-3.5" /> Security Panel</button>
            )}
          </div>
          <div className="border-t border-slate-100 pt-1 mt-1">
            <button onClick={onLogout} className="w-full text-left px-4 py-2 text-xs font-black text-rose-600 hover:bg-rose-50 transition-colors">Sign Out</button>
          </div>
        </div>
      )}
    </div>
  );
}
