"use client";
/**
 * @file /app/modules/leads/components/LeadDetailsPanel.tsx
 * @purpose Renders the left sidebar panel of the Lead Interaction Modal with contact and professional details.
 */

import React from 'react';
import { LrmLead } from '../store';
import { useAuthStore } from '../../team/authStore';
import { Printer } from 'lucide-react';

// Sub-components
import DetailsContactModule from './DetailsContactModule';
import DetailsPersonalModule from './DetailsPersonalModule';
import DetailsDynamicDetails from './DetailsDynamicDetails';

// Hooks
import { useLeadDetailsFlow } from '../hooks/useLeadDetailsFlow';

interface LeadDetailsPanelProps {
  lead: LrmLead;
  activeTab: 'details' | 'notes' | 'projects';
  handleExportPDF: () => void;
  onOpenDelete?: (lead: LrmLead) => void;
}

export default function LeadDetailsPanel({ lead, activeTab, handleExportPDF }: LeadDetailsPanelProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isAgent = (currentUser?.role as string) === 'AGENT';
  const isSuperAdminOrAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';
  
  const displayedPhone = isSuperAdminOrAdmin ? lead.phone : lead.phone.replace(/(\d{4})\d{4,}(\d{2})/, '$1 ****** $2');
  const displayedEmail = isSuperAdminOrAdmin ? lead.email : lead.email.replace(/(.{2}).+@(.+)/, '$1***@$2');

  const {
    isEditingBudget, setIsEditingBudget, budgetValue, setBudgetValue, handleBudgetSave,
    isAddingDetail, setIsAddingDetail, newDetailKey, setNewDetailKey, newDetailValue, setNewDetailValue, handleAddDetail, handleRemoveDetail
  } = useLeadDetailsFlow(lead);

  return (
    <div className={`border-r md:border-r-0 md:border-l border-slate-100 dark:border-slate-800 p-4 overflow-y-auto space-y-6 text-left scrollbar-thin md:flex flex-col justify-between ${activeTab === 'details' ? 'flex' : 'hidden md:flex'}`} id="interaction-details-panel">
      <div className="space-y-6">
        <DetailsContactModule lead={lead} isAgent={isAgent} displayedEmail={displayedEmail} displayedPhone={displayedPhone} />
        <DetailsPersonalModule lead={lead} isEditingBudget={isEditingBudget} setIsEditingBudget={setIsEditingBudget} budgetValue={budgetValue} setBudgetValue={setBudgetValue} onBudgetSave={handleBudgetSave} />
        <DetailsDynamicDetails lead={lead} isAddingDetail={isAddingDetail} setIsAddingDetail={setIsAddingDetail} newDetailKey={newDetailKey} setNewDetailKey={setNewDetailKey} newDetailValue={newDetailValue} setNewDetailValue={setNewDetailValue} onAdd={handleAddDetail} onRemove={handleRemoveDetail} />
      </div>

      {isSuperAdminOrAdmin && (
        <div className="space-y-4 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-left">
            <h4 className="text-[10px] font-black uppercase text-slate-800 dark:text-slate-200 mb-1 tracking-widest">Administrative Actions</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-3 uppercase tracking-wide">Export a clean PDF dossier of this profile.</p>
            <button onClick={handleExportPDF} className="px-3 py-2.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:hover:bg-indigo-900/50 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-[8px] transition-all cursor-pointer flex items-center gap-1.5 w-full justify-center shadow-sm">
              <Printer className="w-3.5 h-3.5" /> Export Lead Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
