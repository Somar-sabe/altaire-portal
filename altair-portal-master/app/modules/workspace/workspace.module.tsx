/**
 * @file /app/modules/workspace/workspace.module.tsx
 * @description Workspace root component
 */
'use client';
import React, { useEffect } from 'react';
import WorkspaceSidebar from './components/WorkspaceSidebar';
import ChatWindow from './components/ChatWindow';
import { useWorkspaceStore } from './store';
import { useAuthStore } from '../team/authStore';
import { fetchPaginatedCollection } from '@/lib/paginated-fetch';
import type { Message } from './types';
import type { TeamUser } from '../team/types';

export default function WorkspaceModule() {
  const { setSpaces, setMessages, setMembers } = useWorkspaceStore();
  const currentUser = useAuthStore(s => s.currentUser);

  useEffect(() => {
    if (!currentUser) return;

    let interval: NodeJS.Timeout;

    const fetchWorkspaceData = async () => {
      try {
        // Fetch users (members)
        // GPT-Codex (G) BEGIN: keep workspace member hydration on bounded user pages.
        const membersData = await fetchPaginatedCollection<TeamUser>('/api/team/users');
        setMembers(membersData);
        // GPT-Codex (G) END: workspace store still receives a flat members array.
      } catch(e) {
        console.error("Failed to fetch users", e);
      }

      try {
        // Fetch spaces with user-specific privacy filtering
        const spacesRes = await fetch(`/api/workspace/spaces?userId=${currentUser.id}`);
        if (spacesRes.ok) {
          const spacesData = await spacesRes.json();
          setSpaces(spacesData);
        }
      } catch(e) {
        console.error("Failed to fetch spaces", e);
      }

      try {
        // Fetch all relevant messages
        // GPT-Codex (G) BEGIN: poll messages through cursor pages instead of one unbounded read.
        const msgsData = await fetchPaginatedCollection<Message>('/api/workspace/messages');
        setMessages(msgsData);
        // GPT-Codex (G) END: chat filtering still operates on a flat message array.
      } catch(e) {
        console.error("Failed to fetch messages", e);
      }
    };

    fetchWorkspaceData();
    // Poll every 3 seconds for simulated realtime
    interval = setInterval(fetchWorkspaceData, 3000);

    return () => clearInterval(interval);
  }, [currentUser, setMembers, setSpaces, setMessages]);

  return (
    <div className="flex w-full max-w-[1024px] mx-auto h-[calc(100vh-8rem)] min-h-[500px] border border-slate-200/60 rounded-[10px] shadow-sm bg-white overflow-hidden">
       <WorkspaceSidebar />
       <ChatWindow />
    </div>
  );
}
