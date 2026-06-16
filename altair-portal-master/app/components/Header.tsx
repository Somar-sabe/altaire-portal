"use client";
/**
 * @file /app/components/Header.tsx
 * @purpose Global top header containing Logo, Search Bar, and Account Dropdown.
 */

import React from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlobalSearch from './GlobalSearch';

// Sub-components
import NotificationCenter from './NotificationCenter';
import AccountDropdown from './AccountDropdown';

// Hooks
import { useHeaderData } from '../hooks/useHeaderData';
import { ROLE_LABELS } from '@/app/modules/team/types';

interface HeaderProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  className?: string;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onToggleSidebar?: () => void;
}

export default function Header({ 
  currentRole, onRoleChange, className, onOpenProfile, onOpenSettings, onToggleSidebar 
}: HeaderProps) {
  const {
    isDropdownOpen, setIsDropdownOpen, isNotificationsOpen, setIsNotificationsOpen,
    notificationFilter, setNotificationFilter, dropdownRef, notificationsRef,
    notifications, filteredNotifications, currentUser, logout,
    toggleRead, deleteNotification, clearAllNotifications, handleAcceptInvite, handleIgnoreInvite
  } = useHeaderData();

  return (
    <header className={cn("h-16 border-b border-slate-100 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0 select-none font-sans relative z-50", className)}>
      <div className="flex items-center gap-2 sm:gap-6 flex-1">
        {onToggleSidebar && (
          <button onClick={onToggleSidebar} className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-[10px] hover:bg-slate-50 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-1 min-w-28 sm:min-w-48 group select-none text-left">
          <div className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900 flex items-center">
            altair<span className="text-emerald-500 font-black">:</span>
          </div>
        </div>
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-4">
        {/* Role Switcher (Visible in dev or for testing) */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-full">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Active Rank:</span>
          <select 
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="bg-transparent text-[10px] font-black text-slate-800 outline-none cursor-pointer uppercase tracking-tight"
          >
            {Object.entries(ROLE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        <NotificationCenter 
          isOpen={isNotificationsOpen} onToggle={() => setIsNotificationsOpen(!isNotificationsOpen)} 
          notifications={notifications} filteredNotifications={filteredNotifications} filter={notificationFilter}
          onFilterChange={setNotificationFilter} onClearAll={clearAllNotifications} onToggleRead={toggleRead}
          onDelete={deleteNotification} onAcceptInvite={handleAcceptInvite} onIgnoreInvite={handleIgnoreInvite}
          innerRef={notificationsRef}
        />

        <AccountDropdown 
          isOpen={isDropdownOpen} onToggle={() => setIsDropdownOpen(!isDropdownOpen)} 
          currentUser={currentUser} onLogout={logout} onOpenProfile={onOpenProfile}
          onOpenSettings={onOpenSettings} innerRef={dropdownRef}
        />
      </div>
    </header>
  );
}
