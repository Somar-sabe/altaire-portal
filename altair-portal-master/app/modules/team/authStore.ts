/**
 * @file /app/modules/team/authStore.ts
 * @description Zustand store for managing current user authentication session and profile.
 */
import { create } from 'zustand';
import type { TeamUser } from './types';
import { signIn, signOut, getSession } from 'next-auth/react';

interface AuthStore {
  currentUser: TeamUser | null;
  isLoading: boolean;
  error: string | null;
  
  initializeAuth: () => Promise<void>;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<TeamUser>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  currentUser: null,
  isLoading: false,
  error: null,

  initializeAuth: async () => {
    if (typeof window === 'undefined') return;

    try {
      const session = await getSession();
      if (session?.user?.id) {
        // Fetch full profile from server using specific ID endpoint
        const res = await fetch(`/api/team/users/${session.user.id}`);
        if (res.ok) {
          const fresh: TeamUser = await res.json();
          set({ currentUser: fresh });
        } else {
          // If restricted, we can still use the session data
          set({ 
            currentUser: { 
              id: session.user.id, 
              email: session.user.email, 
              role: (session.user as any).role || 'GUEST',
              firstName: session.user.name?.split(' ')[0] || 'User',
              lastName: session.user.name?.split(' ')[1] || '',
              permissions: [],
              status: 'ACTIVE',
              lastActive: 'now',
              department: 'Executive'
            } as any 
          });
        }
      } else {
        set({ currentUser: null });
      }
    } catch (e) {
      console.error('Failed to initialize auth', e);
      set({ currentUser: null });
    }
  },

  login: async (email: string, password?: string) => {
    set({ isLoading: true, error: null });
    if (!password || !password.trim()) {
      set({ error: 'Password is required.', isLoading: false });
      return false;
    }
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        set({ error: 'Invalid credentials or account suspended.', isLoading: false });
        return false;
      }
      
      const session = await getSession();
      if (!session?.user?.id) throw new Error('Session initialization failed');

      // Fetch user full profile
      const userRes = await fetch(`/api/team/users/${session.user.id}`);
      if (userRes.ok) {
        const user: TeamUser = await userRes.json();
        set({ currentUser: user, isLoading: false });
      } else {
        // Fallback to session data
        set({ 
          currentUser: { 
            id: session.user.id, email: session.user.email, 
            role: (session.user as any).role || 'GUEST',
            firstName: session.user.name?.split(' ')[0] || 'User',
            lastName: session.user.name?.split(' ')[1] || '',
          } as any, 
          isLoading: false 
        });
      }
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ currentUser: null, error: null });
    await signOut({ redirect: false });
  },

  updateProfile: async (data: Partial<TeamUser>) => {
    const current = get().currentUser;
    if (!current) return;
    
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/team/users/${current.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error('Failed to update profile.');
      const updatedUser = await res.json();
      
      set({ currentUser: updatedUser, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  }
}));
