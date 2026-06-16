"use client";
/**
 * @file /app/modules/leads/components/LeadsModalOverlays.tsx
 * @purpose Renders all conditional modal overlays for the leads module.
 */

import React from 'react';
import InteractionModal from './InteractionModal';
import DeleteLeadModal from './DeleteLeadModal';
import ExcelImportModal from './ExcelImportModal';
import ExportWizardModal from './ExportWizardModal';
import ManualLeadModal from './ManualLeadModal';

interface LeadsModalOverlaysProps {
  activeLead: any | null; setActiveLead: (l: any | null) => void;
  deleteTarget: any | null; setDeleteTarget: (l: any | null) => void;
  showExcelImport: boolean; setShowExcelImport: (v: boolean) => void;
  showAddManual: boolean; setShowAddManual: (v: boolean) => void;
  showExportWizard: boolean; setShowExportWizard: (v: boolean) => void;
  systemAgents: any[];
  handleCreateManual: (data: any) => void;
  fetchLeads: () => void;
}

export default function LeadsModalOverlays({
  activeLead, setActiveLead, deleteTarget, setDeleteTarget, showExcelImport, setShowExcelImport, showAddManual, setShowAddManual, showExportWizard, setShowExportWizard, systemAgents, handleCreateManual, fetchLeads
}: LeadsModalOverlaysProps) {
  return (
    <>
      {activeLead && (
        <InteractionModal lead={activeLead} onClose={() => { setActiveLead(null); fetchLeads(); }} onOpenDelete={(l) => { setActiveLead(null); setDeleteTarget(l); }} />
      )}
      {deleteTarget && (
        <DeleteLeadModal lead={deleteTarget} onClose={() => setDeleteTarget(null)} onDeletedSuccessfully={() => { setDeleteTarget(null); fetchLeads(); }} />
      )}
      {showExcelImport && (
        <ExcelImportModal onClose={() => setShowExcelImport(false)} onImportComplete={() => { setShowExcelImport(false); fetchLeads(); }} />
      )}
      {showExportWizard && (
        <ExportWizardModal onClose={() => setShowExportWizard(false)} />
      )}
      {showAddManual && (
        <ManualLeadModal onClose={() => setShowAddManual(false)} onSubmit={handleCreateManual} systemAgents={systemAgents} />
      )}
    </>
  );
}
