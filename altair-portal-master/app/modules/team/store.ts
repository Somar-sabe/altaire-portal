/**
 * @file /app/modules/team/store.ts
 * @description Zustand store for managing team state with database persistence
 */
import { create } from 'zustand';
import type { TeamUser } from './types';
import { useAuthStore } from './authStore';
import { fetchPaginatedCollection } from '@/lib/paginated-fetch';

interface TeamStore {
  users: TeamUser[];
  isLoading: boolean;
  error: string | null;
  
  fetchUsers: () => Promise<void>;
  setUsers: (users: TeamUser[]) => void;
  addUser: (user: TeamUser) => Promise<void>;
  updateUser: (id: string, data: Partial<TeamUser>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      // GPT-Codex (G) BEGIN: fetch team users through the shared cursor-page helper.
      const users = await fetchPaginatedCollection<TeamUser>('/api/team/users');
      // GPT-Codex (G) END: team screens continue receiving a flat user array.
      set({ users, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  setUsers: (users) => set({ users }),
  
  addUser: async (user) => {
    // Optimistic update
    set((state) => ({ users: [...state.users, user] }));
    
    // Server sync
    try {
      const res = await fetch('/api/team/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (!res.ok) throw new Error('Failed to create user');
      const savedUser = await res.json();
      // Replace optimistic temp ID with real ID (or just update)
      set((state) => ({
        users: state.users.map((u) => u.id === user.id ? savedUser : u)
      }));
    } catch (error) {
      // Revert optimism
      set((state) => ({ users: state.users.filter(u => u.id !== user.id) }));
      throw error;
    }
  },
  
  updateUser: async (id, data) => {
    // Store old for rollback
    const previousUser = get().users.find(u => u.id === id);
    if (!previousUser) return;
    
    // Optimistic update
    set((state) => ({
      users: state.users.map((u) => u.id === id ? { ...u, ...data } : u)
    }));
    
    // Server sync
    try {
      const res = await fetch(`/api/team/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update user');
      const updatedUser = await res.json();
      set((state) => ({
        users: state.users.map((u) => u.id === id ? updatedUser : u)
      }));

      // Synchronise active session in authStore if updating own profile
      const currentUser = useAuthStore.getState().currentUser;
      if (currentUser && currentUser.id === id) {
        // GPT-Codex (G) BEGIN: synchronize in-memory profile only; Auth.js remains the session source of truth.
        useAuthStore.setState({ currentUser: updatedUser });
        // GPT-Codex (G) END: removed stale localStorage session mirror.
      }
    } catch (error) {
      // Revert optimism
      set((state) => ({
        users: state.users.map((u) => u.id === id ? previousUser : u)
      }));
      throw error;
    }
  },
  
  deleteUser: async (id) => {
    const previousUser = get().users.find(u => u.id === id);
    if (!previousUser) return;
    
    // Optimistic update
    set((state) => ({
      users: state.users.map((u) => u.id === id ? { ...u, status: 'INACTIVE' } : u)
    }));
    
    // Server sync
    try {
      const res = await fetch(`/api/team/users/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete user');
      const updatedUser = await res.json();
      set((state) => ({
        users: state.users.map((u) => u.id === id ? updatedUser : u)
      }));
    } catch (error) {
      // Revert
      set((state) => ({
        users: state.users.map((u) => u.id === id ? previousUser : u)
      }));
      throw error;
    }
  }
}));
