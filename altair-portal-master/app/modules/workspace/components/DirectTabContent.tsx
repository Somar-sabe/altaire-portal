"use client";
/**
 * @file /app/modules/workspace/components/DirectTabContent.tsx
 * @description Direct Message Navigation tab with custom member search, highlighting departmental matching and active user focus
 *
 * @dependencies
 * - react: core hook updates (useState, useMemo)
 * - lucide-react: custom visual state icons (Search, User, X)
 * - ../store: workspace Zustand store integration
 * - ../../team/authStore: currentUser matching rules
 * - @/lib/utils: dynamic Tailwind styles selector
 *
 * @relatedFiles
 * - /app/modules/workspace/components/WorkspaceSidebar.tsx: aggregates this tab
 * - /app/modules/workspace/types.ts: contains state type models
 *
 * @exports
 * - DirectTabContent: Interactive listing with integrated contact finder
 */

import React, { useState, useMemo } from 'react';
import { Search, User as UserIcon, X } from 'lucide-react';
import { useWorkspaceStore } from '../store';
import { useAuthStore } from '../../team/authStore';
import { cn } from '@/lib/utils';
import { TeamUser as User } from '../../team/types';

export default function DirectTabContent() {
  const { 
    members, 
    activeDirectUserId, 
    setActiveDirectUser,
    messages
  } = useWorkspaceStore();
  
  const currentUser = useAuthStore(s => s.currentUser);
  
  // Search state query
  const [searchQuery, setSearchQuery] = useState('');

  // Count unreads for direct messages
  const getDirectUnreadCount = (memberId: string) => {
    if (!currentUser) return 0;
    if (activeDirectUserId === memberId) return 0;
    
    const key = `workspace_last_viewed:${currentUser.id}:${memberId}`;
    const lastViewedStr = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    const sessionStartTime = new Date().toISOString();
    const lastViewedTime = new Date(lastViewedStr || sessionStartTime).getTime();
    
    return messages.filter(m => 
      !m.spaceId && 
      m.senderId === memberId && 
      m.receiverId === currentUser.id && 
      new Date(m.createdAt).getTime() > lastViewedTime
    ).length;
  };

  // Filter out current user from listing, and filter by search input
  const filteredMembers = useMemo(() => {
    const list = members.filter(m => m.id !== currentUser?.id);
    if (!searchQuery.trim()) {
      return list;
    }
    const q = searchQuery.toLowerCase();
    return list.filter(m => {
      const fullname = `${m.firstName || ''} ${m.lastName || ''}`.toLowerCase();
      const email = (m.email || '').toLowerCase();
      const dept = (m.department || '').toLowerCase();
      return fullname.includes(q) || email.includes(q) || dept.includes(q);
    });
  }, [members, currentUser, searchQuery]);

  return (
    <div id="direct_tab_content_root" className="space-y-3.5">
      {/* Dynamic Member Search/Composition Area */}
      <div className="relative group px-1">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-800 transition-colors">
          <Search className="w-3.5 h-3.5" />
        </div>
        
        <input
          id="input_member_search"
          type="text"
          placeholder="Search team member..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full text-xs font-semibold pl-8 pr-7 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200/60 focus:border-slate-800 focus:outline-hidden rounded-lg transition-all text-slate-800 placeholder-slate-400 font-sans"
        />

        {searchQuery && (
          <button
            id="btn_clear_member_search"
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-2 px-1 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="px-1 flex justify-between items-center select-none">
          <span className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">
            {searchQuery ? 'Searched Members' : 'Conversations'}
          </span>
          {searchQuery && (
            <span className="text-xs font-bold text-slate-400">
              {filteredMembers.length} found
            </span>
          )}
        </div>

        <div className="space-y-1">
          {filteredMembers.map((member: User) => {
            const count = getDirectUnreadCount(member.id);
            const isSelected = activeDirectUserId === member.id;
            
            return (
              <button
                id={`direct_item_${member.id}`}
                key={member.id}
                onClick={() => {
                  setActiveDirectUser(member.id);
                  // Auto-clear search query upon selecting to keep clean layout
                  setSearchQuery('');
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-2 rounded-md transition-all text-sm font-medium",
                  isSelected ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-5.5 h-5.5 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-xs font-extrabold text-slate-600 border border-slate-100/20 shadow-xs">
                    {member.photoUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={member.photoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-2.5 h-2.5" />
                    )}
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="truncate leading-tight font-semibold">
                      {member.firstName} {member.lastName}
                    </span>
                    {member.department && (
                      <span className={cn(
                        "text-xs font-medium truncate mt-0.5 tracking-wider uppercase",
                        isSelected ? "text-slate-400" : "text-slate-400/80"
                      )}>
                        {member.department}
                      </span>
                    )}
                  </div>
                </div>
                {count > 0 && (
                  <span className={cn(
                    "text-xs font-black rounded-full px-1.5 py-0.5 min-w-[16px] h-4 flex items-center justify-center shrink-0 leading-none",
                    isSelected ? "bg-white text-slate-900" : "bg-blue-600 text-white"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          {filteredMembers.length === 0 && (
            <div className="px-3 py-6 text-xs text-slate-400 italic text-center font-medium">
              No matching team members found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
