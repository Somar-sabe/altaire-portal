/**
 * @file /app/modules/leads/hooks/useLeadsModuleFlow.ts
 * @purpose Custom hook to manage the Leads module state, filtering, and core operations.
 */

import { useState, useEffect, useMemo } from 'react';
import { useLeadsStore } from '../store';
import { LrmLead } from '../types';
import { fetchPaginatedCollection } from '@/lib/paginated-fetch';
import type { TeamUser } from '../../team/types';

export function useLeadsModuleFlow(currentUser: any) {
  const { 
    leads, isLoading, selectedView, setView, searchQuery, setSearchQuery,
    filterStage, setFilterStage, filterTag, setFilterTag, fetchLeads, createLead, updateLead
  } = useLeadsStore();

  const [activeLead, setActiveLead] = useState<LrmLead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LrmLead | null>(null);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [showAddManual, setShowAddManual] = useState(false);
  const [showExportWizard, setShowExportWizard] = useState(false);
  const [systemAgents, setSystemAgents] = useState<any[]>([]);

  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [bulkAgentId, setBulkAgentId] = useState('');
  const [isBulkAssigning, setIsBulkAssigning] = useState(false);

  useEffect(() => {
    fetchLeads();
    // GPT-Codex (G) BEGIN: hydrate assignment agents from bounded team user pages.
    fetchPaginatedCollection<TeamUser>('/api/team/users')
      .then(data => setSystemAgents(data))
      .catch(e => console.error("Failed to fetch team users", e));
    // GPT-Codex (G) END: bulk assignment UI still receives a flat agent array.
  }, [fetchLeads]);

  const handleCreateManual = async (manualData: any) => {
    if (!manualData.name.trim() || !currentUser) return;
    try {
      await createLead({
        name: manualData.name, company: 'Independent / Unspecified', targetProject: 'Initial pipeline protocol',
        value: parseFloat(manualData.value) || 0, stage: manualData.stage || 'NEW', tags: manualData.quality ? [manualData.quality] : [],
        lang: manualData.lang || 'EN', phone: manualData.phone, email: manualData.email, whatsapp: manualData.whatsapp || null,
        telegram: manualData.telegram || null, instagram: manualData.instagram || null, facebook: manualData.facebook || null,
        workPhone: manualData.workPhone || null, workEmail: manualData.workEmail || null, country: manualData.country || 'Worldwide',
        source: manualData.source || null, details: manualData.details || '[]', assignedAgentId: manualData.assignedAgentId || null,
        assignedById: currentUser.id, creatorName: `${currentUser.firstName} ${currentUser.lastName}`
      });
      setShowAddManual(false); fetchLeads();
    } catch (err) { console.error(err); }
  };

  const executeBulkAssign = async () => {
    if (selectedLeadIds.length === 0 || !bulkAgentId || !currentUser) return;
    setIsBulkAssigning(true);
    try {
      await Promise.all(selectedLeadIds.map(id => updateLead(id, {
        assignedAgentId: bulkAgentId, assignedById: currentUser.id, updaterId: currentUser.id, updaterName: `${currentUser.firstName} ${currentUser.lastName}`
      })));
      setSelectedLeadIds([]); setBulkAgentId(''); fetchLeads();
    } catch (err) { console.error('Failed bulk assign:', err); }
    finally { setIsBulkAssigning(false); }
  };

  const filteredList = useMemo(() => {
    return leads.filter((lead) => {
      const s = searchQuery.toLowerCase();
      const matchesSearch = (lead.name || '').toLowerCase().includes(s) || (lead.company || '').toLowerCase().includes(s) || (lead.phone || '').includes(searchQuery);
      const matchesStage = filterStage === 'All' || lead.stage === filterStage;
      const matchesTag = filterTag === 'All' || (lead.tags || []).some(t => t.toLowerCase() === filterTag.toLowerCase());
      const isAgent = currentUser?.role === 'AGENT';
      return matchesSearch && matchesStage && matchesTag && (!isAgent || lead.assignedAgentId === currentUser?.id);
    });
  }, [leads, searchQuery, filterStage, filterTag, currentUser]);

  const isSuperAdminOrAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';

  return {
    leads, isLoading, selectedView, setView, searchQuery, setSearchQuery, filterStage, setFilterStage, filterTag, setFilterTag, fetchLeads,
    activeLead, setActiveLead, deleteTarget, setDeleteTarget, showExcelImport, setShowExcelImport, showAddManual, setShowAddManual, showExportWizard, setShowExportWizard,
    systemAgents, selectedLeadIds, setSelectedLeadIds, bulkAgentId, setBulkAgentId, isBulkAssigning,
    handleCreateManual, executeBulkAssign, filteredList, isSuperAdminOrAdmin
  };
}
