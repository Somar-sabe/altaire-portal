"use client";
/**
 * @file /app/modules/leads/components/ExcelImportModal.tsx
 * @purpose Interactive Excel Column Mapping & Bulk Upload modal with auto-mapping.
 */

'use client';

import React from 'react';
import { FileSpreadsheet, X, CheckCircle } from 'lucide-react';

// Sub-components
import ImportTemplateSelector from './ImportTemplateSelector';
import ImportColumnMapper from './ImportColumnMapper';
import ImportDataPreview from './ImportDataPreview';

// Hooks
import { useExcelImportFlow } from '../hooks/useExcelImportFlow';

interface ExcelImportModalProps {
  onClose: () => void;
  onImportComplete: () => void;
}

export default function ExcelImportModal({ onClose, onImportComplete }: ExcelImportModalProps) {
  const {
    selectedTemplateIndex, headers, rows, mappings, isProcessing, errorMessage,
    selectTemplate, handleMappingChange, executeBulkImport
  } = useExcelImportFlow(onImportComplete);

  return (
    <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4 backdrop-blur-[2px]">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 w-full max-w-2xl h-[85vh] rounded-[12px] flex flex-col p-5 overflow-hidden text-left shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-950 dark:text-slate-50">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-tight">Smart Excel & CSV Lead Importer</span>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-6 my-4 flex-1 overflow-y-auto pr-1 select-none scrollbar-thin">
          <ImportTemplateSelector selectedTemplateIndex={selectedTemplateIndex} onSelect={selectTemplate} />

          {selectedTemplateIndex !== null && (
            <div className="space-y-6 animate-fade-in">
              <ImportColumnMapper mappings={mappings} headers={headers} onMappingChange={handleMappingChange} />
              <ImportDataPreview headers={headers} rows={rows} />
            </div>
          )}
        </div>

        {errorMessage && <div className="text-xs font-black text-rose-600 text-center pb-2 uppercase tracking-wide">{errorMessage}</div>}

        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center gap-2">
          <button onClick={onClose} disabled={isProcessing} className="flex-1 py-2 border border-slate-200/80 hover:bg-slate-50 rounded-[8px] text-[11px] font-bold text-slate-500 transition-all">Cancel</button>
          <button onClick={executeBulkImport} disabled={isProcessing || selectedTemplateIndex === null} className="flex-[2] py-2 bg-indigo-600 hover:bg-slate-950 disabled:bg-indigo-200 text-white rounded-[8px] text-[11px] font-black transition-all flex items-center justify-center gap-1.5 group cursor-pointer shadow-sm">
            <CheckCircle className="w-3.5 h-3.5" />
            {isProcessing ? 'Processing Batch...' : `Confirm and Import ${rows.length} Leads`}
          </button>
        </div>
      </div>
    </div>
  );
}
