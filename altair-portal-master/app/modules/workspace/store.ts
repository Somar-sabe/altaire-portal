/**
 * @file /app/modules/workspace/store.ts
 * @description Zustand store for Workspace Realtime Messages Hub
 */
import { create } from 'zustand';
import { WorkspaceStore, Message, WorkspaceSpace } from './types';
import { TeamUser as User } from '../team/types';

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  spaces: [],
  activeSpaceId: null,
  activeDirectUserId: null,
  messages: [],
  members: [],
  setActiveSpace: (spaceId) => set({ activeSpaceId: spaceId, activeDirectUserId: null }),
  setActiveDirectUser: (userId) => set({ activeDirectUserId: userId, activeSpaceId: null }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setSpaces: (spaces) => set({ spaces }),
  setMembers: (members) => set({ members })
}));
