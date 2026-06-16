"use client";
'use client';

/**
 * @file /app/modules/leads/leads.module.tsx
 * @description Master shell component of the Leads module.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../team/authStore';

// Sub-components
import LeadsInsights from './components/LeadsInsights';
import LeadsHeader from './components/LeadsHeader';
import LeadsCounters from './components/LeadsCounters';
import LeadsToolbelt from './components/LeadsToolbelt';
import LeadsBulkAssign from './components/LeadsBulkAssign';
import LeadsMainView from './components/LeadsMainView';
import LeadsModalOverlays from './components/LeadsModalOverlays';

// Hooks
import { useLeadsModuleFlow } from './hooks/useLeadsModuleFlow';

export default function LeadsModule() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { 
    leads, isLoading, selectedView, setView, searchQuery, setSearchQuery, filterStage, setFilterStage, filterTag, setFilterTag, fetchLeads,
    activeLead, setActiveLead, deleteTarget, setDeleteTarget, showExcelImport, setShowExcelImport, showAddManual, setShowAddManual, showExportWizard, setShowExportWizard,
    systemAgents, selectedLeadIds, setSelectedLeadIds, bulkAgentId, setBulkAgentId, isBulkAssigning,
    handleCreateManual, executeBulkAssign, filteredList, isSuperAdminOrAdmin
  } = useLeadsModuleFlow(currentUser);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="min-h-full flex flex-col px-4 md:px-6 pb-4 md:pb-6 pt-0 text-left relative" id="leads-module-viewport">
      <LeadsHeader onImportClick={() => setShowExcelImport(true)} onManualAddClick={() => setShowAddManual(true)} />
      <LeadsCounters leads={leads} />
      <LeadsInsights />
      <LeadsToolbelt filterStage={filterStage} setFilterStage={setFilterStage} filterTag={filterTag} setFilterTag={setFilterTag} selectedView={selectedView} setView={setView} searchQuery={searchQuery} setSearchQuery={setSearchQuery} isSuperAdminOrAdmin={isSuperAdminOrAdmin || false} onExportClick={() => setShowExportWizard(true)} />

      {isSuperAdminOrAdmin && selectedView === 'table' && (
        <LeadsBulkAssign selectedLeadIds={selectedLeadIds} bulkAgentId={bulkAgentId} setBulkAgentId={setBulkAgentId} systemAgents={systemAgents} isBulkAssigning={isBulkAssigning} executeBulkAssign={executeBulkAssign} />
      )}

      <main className={`flex-grow min-h-0 flex flex-col justify-between ${selectedView === 'kanban' ? 'h-[800px] min-h-[700px]' : 'flex-1 min-h-[500px]'} overflow-hidden relative pb-4`} id="leads-active-visualizations">
        <LeadsMainView 
          selectedView={selectedView} isLoading={isLoading} leadsLength={leads.length} filteredList={filteredList} selectedLeadIds={selectedLeadIds} onSelectLead={setActiveLead} 
          onSelectAll={(e) => setSelectedLeadIds(e.target.checked ? filteredList.map(l => l.id) : [])}
          onToggleLead={(id, e) => { e.stopPropagation(); setSelectedLeadIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]); }}
        />
      </main>

      <LeadsModalOverlays 
        activeLead={activeLead} setActiveLead={setActiveLead} deleteTarget={deleteTarget} setDeleteTarget={setDeleteTarget} showExcelImport={showExcelImport} setShowExcelImport={setShowExcelImport} 
        showAddManual={showAddManual} setShowAddManual={setShowAddManual} showExportWizard={showExportWizard} setShowExportWizard={setShowExportWizard} systemAgents={systemAgents} handleCreateManual={handleCreateManual} fetchLeads={fetchLeads} 
      />
    </motion.div>
  );
}
