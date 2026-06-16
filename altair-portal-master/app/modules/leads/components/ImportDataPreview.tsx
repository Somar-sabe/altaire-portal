"use client";
/**
 * @file /app/modules/leads/components/ImportDataPreview.tsx
 * @purpose Renders a table preview of the data to be imported.
 */

import React from 'react';

interface ImportDataPreviewProps {
  headers: string[];
  rows: string[][];
}

export default function ImportDataPreview({
  headers, rows
}: ImportDataPreviewProps) {
  return (
    <div className="space-y-2 text-left">
      <h4 className="text-[11px] font-black text-slate-400 uppercase">2. Preview Sample Imported Records:</h4>
      <div className="overflow-x-auto border border-slate-150 rounded-[8px] bg-white text-[10px] font-medium">
        <table className="w-full text-left divide-y divide-slate-150">
          <thead className="bg-slate-100">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="p-2 font-black">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 text-slate-600">
            {rows.map((rowArr, rIdx) => (
              <tr key={rIdx}>
                {rowArr.map((cell, cIdx) => (
                  <td key={cIdx} className="p-2 truncate max-w-[120px]">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
