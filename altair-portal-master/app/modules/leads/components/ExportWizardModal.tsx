"use client";
/**
 * @file /app/modules/leads/components/ExportWizardModal.tsx
 * @purpose Advanced Export Wizard to filter and compile a visual PDF report.
 */

import React from 'react';
import { X, Printer, FileText } from 'lucide-react';

// Sub-components
import ExportFilters from './ExportFilters';

// Hooks
import { useExportWizard } from '../hooks/useExportWizard';

const STAGE_OPTIONS = ['New', 'In progress', 'Interested', 'Not Interested', 'Booked', 'Converted', 'Lost'];

export default function ExportWizardModal({ onClose }: { onClose: () => void }) {
  const {
    filterStage, setFilterStage, filterTag, setFilterTag, filterLang, setFilterLang, filterCountry, setFilterCountry,
    filterAgent, setFilterAgent, systemAgents, isExporting, languages, countries, handleExportVisualPDF
  } = useExportWizard(onClose);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[12px] p-6 w-full max-w-lg shadow-2xl relative font-sans animate-fade-in text-left">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Leads Export Wizard</h2>
          </div>
          <button onClick={onClose} disabled={isExporting} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <p className="text-xs font-bold text-slate-500 mb-6 uppercase tracking-wider leading-relaxed">
          Filter and compile a visual PDF Report containing KPI metrics, stage distribution charts, and a quality pipeline overview.
        </p>

        <ExportFilters 
          filterStage={filterStage} setFilterStage={setFilterStage} filterTag={filterTag} setFilterTag={setFilterTag} 
          filterLang={filterLang} setFilterLang={setFilterLang} filterCountry={filterCountry} setFilterCountry={setFilterCountry} 
          filterAgent={filterAgent} setFilterAgent={setFilterAgent} systemAgents={systemAgents} languages={languages} countries={countries} STAGE_OPTIONS={STAGE_OPTIONS} 
        />

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} disabled={isExporting} className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-[8px] text-[11px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</button>
          <button onClick={handleExportVisualPDF} disabled={isExporting} className="px-4 py-2 bg-indigo-600 text-white rounded-[8px] text-[11px] font-black flex items-center gap-2 hover:bg-indigo-700 transition disabled:opacity-50 tracking-wider">
            <Printer className="w-4 h-4" />
            {isExporting ? 'Generating...' : 'PRINT VISUAL REPORT'}
          </button>
        </div>
      </div>
    </div>
  );
}
