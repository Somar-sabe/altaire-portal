"use client";
/**
 * @file /app/modules/workspace/components/SpacesTabContent.tsx
 * @description Tab content for listing Workspace Spaces and launching the Step-based Space Creation dialog
 *
 * @dependencies
 * - react: core component states
 * - lucide-react: custom stylized icons (Users, Plus, Lock, Globe)
 * - ../store: zustand real-time workspace store
 * - ../../team/authStore: currentUser identity validation
 * - @/lib/utils: dynamic styling helper
 * - ./SpaceCreateModal: step-based modular form
 *
 * @relatedFiles
 * - /app/modules/workspace/components/WorkspaceSidebar.tsx: uses this content
 * - /app/modules/workspace/components/SpaceCreateModal.tsx: handles step details
 *
 * @exports
 * - SpacesTabContent: React Component representing active rooms
 */

import React, { useState } from 'react';
import { Users, Plus, Lock, Globe } from 'lucide-react';
import { useWorkspaceStore } from '../store';
import { useAuthStore } from '../../team/authStore';
import { cn } from '@/lib/utils';
import SpaceCreateModal from './SpaceCreateModal';

export default function SpacesTabContent() {
  const { 
    spaces, 
    activeSpaceId, 
    setActiveSpace, 
    messages 
  } = useWorkspaceStore();
  
  const currentUser = useAuthStore(s => s.currentUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Unread badge helper
  const getSpaceUnreadCount = (spaceId: string) => {
    if (!currentUser) return 0;
    if (activeSpaceId === spaceId) return 0;
    
    const key = `workspace_last_viewed:${currentUser.id}:${spaceId}`;
    const lastViewedStr = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    const sessionStartTime = new Date().toISOString();
    const lastViewedTime = new Date(lastViewedStr || sessionStartTime).getTime();
    
    return messages.filter(m => 
      m.spaceId === spaceId && 
      m.senderId !== currentUser.id && 
      new Date(m.createdAt).getTime() > lastViewedTime
    ).length;
  };

  return (
    <div id="spaces_tab_content_root" className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <span className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">Active Rooms</span>
        <button 
          id="btn_open_create_space"
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-slate-400 hover:text-indigo-600 hover:bg-slate-50 p-1.5 rounded-full transition-all duration-150"
          title="Create New Space"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <div className="space-y-1">
        {spaces.map(space => {
          const count = getSpaceUnreadCount(space.id);
          const isPrivate = space.privacy === 'private';

          return (
            <button
              id={`space_item_${space.id}`}
              key={space.id}
              onClick={() => setActiveSpace(space.id)}
              className={cn(
                "w-full flex items-center justify-between px-2.5 py-2.5 rounded-md transition-all text-xs font-medium border border-transparent",
                activeSpaceId === space.id 
                  ? "bg-slate-900 text-white shadow-xs" 
                  : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-2 max-w-[80%] min-w-0">
                <div className={cn(
                  "w-5 h-5 rounded flex items-center justify-center shrink-0",
                  activeSpaceId === space.id ? "bg-white/10 text-white" : "bg-slate-100 text-slate-500"
                )}>
                  <Users className="w-3 h-3" />
                </div>
                <span className="truncate">{space.name}</span>
                {isPrivate && (
                  <span title="Private Space" className="shrink-0 flex items-center">
                    <Lock className={cn("w-2.5 h-2.5", activeSpaceId === space.id ? "text-indigo-300" : "text-amber-500")} />
                  </span>
                )}
              </div>
              
              {count > 0 && (
                <span className={cn(
                  "text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[16px] h-4 flex items-center justify-center shrink-0 leading-none",
                  activeSpaceId === space.id ? "bg-white text-slate-900" : "bg-indigo-600 text-white"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
        
        {spaces.length === 0 && (
          <div className="px-3 py-8 text-sm text-slate-400 italic text-center font-medium bg-slate-50/30 rounded-lg border border-dashed border-slate-100">
            No active spaces found
          </div>
        )}
      </div>

      {/* Step-based creation modal */}
      <SpaceCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
