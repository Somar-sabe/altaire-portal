"use client";
/**
 * @file /app/modules/leads/components/ImportColumnMapper.tsx
 * @purpose Renders the column mapping selection inputs.
 */

import React from 'react';
import { ArrowRightLeft } from 'lucide-react';

interface ImportColumnMapperProps {
  mappings: Record<string, string>;
  headers: string[];
  onMappingChange: (field: string, val: string) => void;
}

export default function ImportColumnMapper({
  mappings, headers, onMappingChange
}: ImportColumnMapperProps) {
  const fields = [
    { key: "name", label: "Full Name (merged)" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "phone", label: "Mobile Number" },
    { key: "email", label: "Email Address" },
    { key: "value", label: "Value / Budget" },
    { key: "company", label: "Company" },
    { key: "targetProject", label: "Target Project" },
    { key: "whatsapp", label: "WhatsApp Number" }
  ];

  return (
    <div className="space-y-2 bg-slate-50 dark:bg-slate-950/20 p-3 rounded-[10px] border border-slate-200/50 dark:border-slate-800 text-left">
      <div className="flex items-center justify-start gap-1.5 text-xs font-black text-slate-800 dark:text-slate-300">
        <ArrowRightLeft className="w-4 h-4 text-slate-500" />
        <span>Map Core System Fields</span>
      </div>
      <p className="text-[10px] text-slate-400 font-bold">The system automatically auto-mapped matching columns. Tweak if needed.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-slate-500 truncate">{field.label}:</span>
            <select
              value={mappings[field.key]}
              onChange={(e) => onMappingChange(field.key, e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[6px] text-xs font-bold py-1.5 px-2 text-slate-900 dark:text-slate-100 outline-none"
            >
              <option value="">-- Ignore --</option>
              {headers.map((h, hIdx) => (
                <option key={hIdx} value={String(hIdx)}>{h}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
