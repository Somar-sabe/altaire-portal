"use client";
/**
 * @file /app/modules/leads/components/ImportTemplateSelector.tsx
 * @purpose Renders the template selection grid for the Excel import wizard.
 */

import React from 'react';
import { SAMPLE_EXCEL_TEMPLATES } from '../constants';

interface ImportTemplateSelectorProps {
  selectedTemplateIndex: number | null;
  onSelect: (index: number) => void;
}

export default function ImportTemplateSelector({
  selectedTemplateIndex, onSelect
}: ImportTemplateSelectorProps) {
  return (
    <div className="space-y-2 text-left">
      <h4 className="text-[11px] font-black tracking-wider text-slate-400 uppercase">1. Select Sample Spreadsheet Template & Load Headers:</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {SAMPLE_EXCEL_TEMPLATES.map((tmpl, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`p-3 rounded-[10px] border text-left transition-all text-xs font-bold leading-relaxed flex flex-col justify-between ${
              selectedTemplateIndex === idx
                ? 'border-indigo-600 bg-indigo-50/20 text-indigo-950 dark:text-indigo-400'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900'
            }`}
            type="button"
          >
            <span>{tmpl.name}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold mt-2 uppercase">Auto-matched {tmpl.headers.length} columns</span>
          </button>
        ))}
      </div>
    </div>
  );
}
