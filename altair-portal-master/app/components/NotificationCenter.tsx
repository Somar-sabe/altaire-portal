"use client";
/**
 * @file /app/components/NotificationCenter.tsx
 * @purpose Renders the notification bell and dropdown list.
 */

import React from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationCenterProps {
  isOpen: boolean;
  onToggle: () => void;
  notifications: any[];
  filteredNotifications: any[];
  filter: string;
  onFilterChange: (f: any) => void;
  onClearAll: () => void;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAcceptInvite: (id: string) => void;
  onIgnoreInvite: (id: string) => void;
  innerRef: React.RefObject<HTMLDivElement | null>;
}

export default function NotificationCenter({
  isOpen, onToggle, notifications, filteredNotifications, filter, onFilterChange, onClearAll, onToggleRead, onDelete, onAcceptInvite, onIgnoreInvite, innerRef
}: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={innerRef}>
      <button 
        type="button"
        onClick={onToggle}
        className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-[8px] hover:bg-slate-50 cursor-pointer"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 px-1 min-w-[14px] h-[14px] flex items-center justify-center bg-rose-500 rounded-full text-white text-[9px] font-bold border border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-[12px] shadow-xl overflow-hidden py-1 z-50 animate-fade-in origin-top-right text-left">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-500">You have {unreadCount} unread alerts</p>
            </div>
            {notifications.length > 0 && (
              <button onClick={onClearAll} className="text-xs text-rose-600 hover:underline font-semibold">Clear All</button>
            )}
          </div>

          <div className="flex gap-1.5 px-3 py-2 bg-slate-50/50 border-b border-slate-100">
            {['all', 'system', 'user', 'security'].map(f => (
              <button
                key={f}
                onClick={() => onFilterChange(f as any)}
                className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all", filter === f ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-100')}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
            {filteredNotifications.length > 0 ? filteredNotifications.map(item => (
              <div key={item.id} className={cn("p-3 flex gap-3 items-start transition-colors justify-between", item.read ? 'hover:bg-slate-50' : 'bg-emerald-50/10 hover:bg-emerald-50/20')}>
                <div className="flex gap-2 items-start flex-1 min-w-0">
                  <span className={cn("w-2 h-2 mt-1.5 rounded-full shrink-0", item.type === 'system' ? 'bg-blue-500' : item.type === 'user' ? 'bg-emerald-500' : 'bg-amber-500')} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 leading-snug truncate">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">{item.desc}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">{item.time}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end shrink-0">
                  {item.isInvitation ? (
                    <div className="flex gap-1.5 mt-1 shrink-0">
                      <button onClick={() => onAcceptInvite(item.id)} className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[4px] text-[10px] font-black shadow-xs">Accept</button>
                      <button onClick={() => onIgnoreInvite(item.id)} className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-[4px] text-[10px] font-bold border border-slate-200">Ignore</button>
                    </div>
                  ) : (
                    <>
                      {!item.read && <button onClick={() => onToggleRead(item.id)} className="text-[10px] text-emerald-600 hover:underline font-bold">Read</button>}
                      <button onClick={() => onDelete(item.id)} className="text-xs text-slate-400 hover:text-rose-600 font-bold">&times;</button>
                    </>
                  )}
                </div>
              </div>
            )) : <div className="p-8 text-center text-slate-400 text-xs font-medium italic">No notifications found</div>}
          </div>
        </div>
      )}
    </div>
  );
}
