/**
 * @file /app/modules/leads/store.ts
 * @description Zustand state store managing Leads operations, dashboard filters, view layouts, activities, and Gemini analytics.
 * @dependencies zustand
 * @workplan WP-011
 */

import { create } from 'zustand';
import { LrmLead, LeadComment, LeadActivity } from './types';
import { fetchPaginatedCollection } from '@/lib/paginated-fetch';

interface LeadsState {
  leads: LrmLead[];
  isLoading: boolean;
  updatingLeadId: string | null;
  selectedView: 'kanban' | 'table' | 'grid';
  searchQuery: string;
  filterStage: string;
  filterTag: string;
  aiInsights: string;
  isAiLoading: boolean;

  setView: (view: 'kanban' | 'table' | 'grid') => void;
  setSearchQuery: (query: string) => void;
  setFilterStage: (stage: string) => void;
  setFilterTag: (tag: string) => void;

  fetchLeads: () => Promise<void>;
  createLead: (lead: Partial<LrmLead> & { creatorName: string }) => Promise<LrmLead>;
  updateLead: (id: string, data: Partial<LrmLead> & { updaterId?: string; updaterName?: string }) => Promise<LrmLead>;
  deleteLead: (id: string, actorId: string, actorName: string, reason: string) => Promise<boolean>;
  importLeadsBulk: (leads: Array<Partial<LrmLead>>) => Promise<boolean>;
  generateAiInsights: () => Promise<void>;
}

export { type LrmLead, type LeadComment, type LeadActivity };

export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  isLoading: false,
  updatingLeadId: null,
  selectedView: 'kanban',
  searchQuery: '',
  filterStage: 'All',
  filterTag: 'All',
  aiInsights: '',
  isAiLoading: false,

  setView: (view) => set({ selectedView: view }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterStage: (stage) => set({ filterStage: stage }),
  setFilterTag: (tag) => set({ filterTag: tag }),

  fetchLeads: async () => {
    set({ isLoading: true });
    try {
      // GPT-Codex (G) BEGIN: fetch leads through bounded cursor pages.
      const data = await fetchPaginatedCollection<LrmLead>('/api/leads');
      // GPT-Codex (G) END: the store still exposes a plain leads array to the UI.
      set({ leads: data, isLoading: false });
    } catch (error) {
      console.error('fetchLeads error:', error);
      set({ isLoading: false });
    }
  },

  createLead: async (leadData) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      if (!res.ok) throw new Error('Api post failed');
      const newLead = await res.json();
      set((state) => ({ leads: [newLead, ...state.leads], isLoading: false }));
      return newLead;
    } catch (error) {
      console.error('createLead error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateLead: async (id, data) => {
    // 1. Optimistic UI update: instantly reflect changes on the frontend
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, ...data } : l)),
      isLoading: true,
      updatingLeadId: id
    }));
    
    // Strip frontend-only tracking fields before sending to strict API
    const payload = { ...data };
    delete payload.updaterId;
    delete payload.updaterName;

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Api patch failed');
      const updated = await res.json();

      // 2. Server confirmation update
      set((state) => ({
        leads: state.leads.map((l) => (l.id === id ? updated : l)),
        isLoading: false,
        updatingLeadId: null
      }));
      return updated;
    } catch (error) {
      console.error('updateLead error:', error);
      // 3. Rollback on failure
      get().fetchLeads();
      set({ isLoading: false, updatingLeadId: null });
      throw error;
    }
  },

  deleteLead: async (id, actorId, actorName, reason) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/leads/${id}?actorId=${encodeURIComponent(actorId)}&actorName=${encodeURIComponent(actorName)}&reason=${encodeURIComponent(reason)}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Api delete failed');
      
      set((state) => ({
        leads: state.leads.filter((l) => l.id !== id),
        isLoading: false
      }));
      return true;
    } catch (error) {
      console.error('deleteLead error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  importLeadsBulk: async (bulkData) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkData)
      });
      if (!res.ok) throw new Error('Bulk API import failed');
      const parsed = await res.json();
      
      if (parsed.success) {
        set((state) => ({
          leads: [...parsed.data, ...state.leads],
          isLoading: false
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('importLeadsBulk error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  generateAiInsights: async () => {
    set({ isAiLoading: true });
    const activeLeads = get().leads;
    const bookedCount = activeLeads.filter(l => l.stage === 'Booked' || l.stage === 'Converted').length;
    const activeVolumeVal = activeLeads.reduce((sum, current) => sum + current.value, 0);
    const summary = {
      total: activeLeads.length,
      booked: bookedCount,
      inProgress: activeLeads.filter(l => l.stage === 'In progress' || l.stage === 'Interested').length,
      lost: activeLeads.filter(l => l.stage === 'Lost' || l.stage === 'Not Interested').length,
      activeVolume: Math.floor(activeVolumeVal)
    };

    try {
      const res = await fetch('/api/leads/ai-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadsSummary: summary })
      });
      const data = await res.json();
      set({ aiInsights: data.text || 'Sorry, the AI could not formulate a real-time summary at this time.', isAiLoading: false });
    } catch (error) {
      console.error('generateAiInsights error:', error);
      
      const total = summary.total || 0;
      const booked = summary.booked || 0;
      const inProgress = summary.inProgress || 0;
      const lost = summary.lost || 0;
      const volume = summary.activeVolume || 0;
      const conversionRate = total > 0 ? Math.round((booked / total) * 100) : 0;
      
      const fallbackText = `### 📊 Local Pipeline Analysis (Offline Mode)

Our digital pipeline is currently tracking **${total} leads** totaling **$${volume.toLocaleString()} USD** in potential sales value.

#### 📈 Current Performance
*   **Conversion Rate:** **${conversionRate}%** (${booked} booked or converted)
*   **Active Pipeline:** **${inProgress} leads in active negotiation**
*   **Velocity Advice:** Prioritize immediate follow-ups on the active negotiations pool to accelerate conversion closure.`;

      set({ aiInsights: fallbackText, isAiLoading: false });
    }
  }
}));
