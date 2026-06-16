"use client";
/**
 * @file /app/modules/workspace/components/WorkspaceSidebar.tsx
 * @description Left sidebar container that coordinates Spaces and Direct message routing tabs. Delegates active lists to sub-components.
 *
 * @dependencies
 * - react: core hook updates (useState, useEffect)
 * - ../store: real-time Zustand workspace store
 * - ../../team/authStore: currentUser validation rules
 * - @/lib/utils: dynamic Tailwind utility classes
 * - ./SpacesTabContent: handles space lists and modal creations
 * - ./DirectTabContent: handles direct message search listing
 *
 * @relatedFiles
 * - /app/modules/workspace/workspace.module.tsx: includes this sidebar
 * - /app/modules/workspace/components/SpacesTabContent.tsx: delegated active room view
 * - /app/modules/workspace/components/DirectTabContent.tsx: delegated member search view
 *
 * @exports
 * - WorkspaceSidebar: Main sidebar view coordinator
 */

import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../store';
import { useAuthStore } from '../../team/authStore';
import { cn } from '@/lib/utils';
import SpacesTabContent from './SpacesTabContent';
import DirectTabContent from './DirectTabContent';

export default function WorkspaceSidebar() {
  const { 
    spaces, 
    members, 
    activeSpaceId, 
    activeDirectUserId,
    messages
  } = useWorkspaceStore();
  
  const currentUser = useAuthStore(s => s.currentUser);

  // Initialize selected tab depending on active selection
  const [activeTab, setActiveTab] = useState<'spaces' | 'direct'>('spaces');

  // Synchronize the tab state if another component forces an active selection
  useEffect(() => {
    if (activeSpaceId) {
      setActiveTab('spaces');
    } else if (activeDirectUserId) {
      setActiveTab('direct');
    }
  }, [activeSpaceId, activeDirectUserId]);

  const [sessionStartTime] = useState(() => new Date().toISOString());

  // Effect to automatically mark messages as read for active room
  useEffect(() => {
    if (!currentUser) return;
    if (activeSpaceId) {
      const key = `workspace_last_viewed:${currentUser.id}:${activeSpaceId}`;
      localStorage.setItem(key, new Date().toISOString());
    } else if (activeDirectUserId) {
      const key = `workspace_last_viewed:${currentUser.id}:${activeDirectUserId}`;
      localStorage.setItem(key, new Date().toISOString());
    }
  }, [activeSpaceId, activeDirectUserId, messages, currentUser]);

  // Aggregate unreads for spaces
  const getSpaceUnreadCount = (spaceId: string) => {
    if (!currentUser) return 0;
    if (activeSpaceId === spaceId) return 0;
    
    const key = `workspace_last_viewed:${currentUser.id}:${spaceId}`;
    const lastViewedStr = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    const lastViewedTime = new Date(lastViewedStr || sessionStartTime).getTime();
    
    return messages.filter(m => 
      m.spaceId === spaceId && 
      m.senderId !== currentUser.id && 
      new Date(m.createdAt).getTime() > lastViewedTime
    ).length;
  };

  // Aggregate unreads for direct messages
  const getDirectUnreadCount = (memberId: string) => {
    if (!currentUser) return 0;
    if (activeDirectUserId === memberId) return 0;
    
    const key = `workspace_last_viewed:${currentUser.id}:${memberId}`;
    const lastViewedStr = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    const lastViewedTime = new Date(lastViewedStr || sessionStartTime).getTime();
    
    return messages.filter(m => 
      !m.spaceId && 
      m.senderId === memberId && 
      m.receiverId === currentUser.id && 
      new Date(m.createdAt).getTime() > lastViewedTime
    ).length;
  };

  // Aggregate total counts
  const totalUnreadSpaces = spaces.reduce((sum, space) => sum + getSpaceUnreadCount(space.id), 0);
  const totalUnreadDirect = members
    .filter(m => m.id !== currentUser?.id)
    .reduce((sum, member) => sum + getDirectUnreadCount(member.id), 0);

  return (
    <div id="workspace_sidebar_root" className="w-68 bg-white border-r border-slate-200/50 flex flex-col h-full rounded-l-[10px] select-none">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-black text-slate-800 text-lg">Workspace</h2>
      </div>

      {/* Tabs navigation with real-time aggregate unread badges */}
      <div className="flex border-b border-slate-100/80 px-2 mt-2">
        <button
          id="tab_trigger_spaces"
          onClick={() => setActiveTab('spaces')}
          className={cn(
            "flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-b-2",
            activeTab === 'spaces'
              ? "border-slate-800 text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-600"
          )}
        >
          <span>Spaces</span>
          {totalUnreadSpaces > 0 && (
            <span className="bg-blue-600 text-white font-bold text-xs px-1.5 py-0.5 rounded-full inline-flex items-center justify-center min-w-[16px] h-4 leading-none">
              {totalUnreadSpaces}
            </span>
          )}
        </button>
        <button
          id="tab_trigger_direct"
          onClick={() => setActiveTab('direct')}
          className={cn(
            "flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-b-2",
            activeTab === 'direct'
              ? "border-slate-800 text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-600"
          )}
        >
          <span>Direct</span>
          {totalUnreadDirect > 0 && (
            <span className="bg-blue-600 text-white font-bold text-xs px-1.5 py-0.5 rounded-full inline-flex items-center justify-center min-w-[16px] h-4 leading-none">
              {totalUnreadDirect}
            </span>
          )}
        </button>
      </div>

      {/* Scrollable container displaying active tab views list */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        {activeTab === 'spaces' ? (
          <SpacesTabContent />
        ) : (
          <DirectTabContent />
        )}
      </div>
    </div>
  );
}
