/**
 * @file /app/modules/leads/hooks/useExcelImportFlow.ts
 * @purpose Custom hook to handle the multi-step Excel/CSV import flow.
 */

import { useState } from 'react';
import { useLeadsStore } from '../store';
import { useAuthStore } from '../../team/authStore';
import { SAMPLE_EXCEL_TEMPLATES } from '../constants';

export function useExcelImportFlow(onImportComplete: () => void) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const importLeadsBulk = useLeadsStore((s) => s.importLeadsBulk);

  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({
    name: '', firstName: '', lastName: '', phone: '', email: '', value: '', company: '', targetProject: '', whatsapp: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectTemplate = (index: number) => {
    const tmpl = SAMPLE_EXCEL_TEMPLATES[index];
    setSelectedTemplateIndex(index);
    setHeaders(tmpl.headers);
    setRows(tmpl.rows);

    const currentMappings: Record<string, string> = {
      name: '', firstName: '', lastName: '', phone: '', email: '', value: '', company: '', targetProject: '', whatsapp: ''
    };

    tmpl.headers.forEach((h, hIdx) => {
      const col = String(hIdx);
      const low = h.toLowerCase();
      if (h.includes("الاسم الثنائي") || low.includes("full name") || low.includes("name")) currentMappings.name = col;
      if (h.includes("الاسم الأول") || low.includes("first name")) currentMappings.firstName = col;
      if (h.includes("اسم العائلة") || low.includes("last name")) currentMappings.lastName = col;
      if (h.includes("رقم الهاتف") || low.includes("phone") || low.includes("mobile")) currentMappings.phone = col;
      if (h.includes("البريد") || low.includes("email")) currentMappings.email = col;
      if (h.includes("الميزانية") || low.includes("value") || low.includes("budget")) currentMappings.value = col;
      if (h.includes("الشركة") || low.includes("company")) currentMappings.company = col;
      if (h.includes("المشروع") || low.includes("project")) currentMappings.targetProject = col;
      if (h.includes("واتساب") || low.includes("whatsapp")) currentMappings.whatsapp = col;
    });

    setMappings(currentMappings); setErrorMessage('');
  };

  const handleMappingChange = (fieldKey: string, val: string) => {
    setMappings(prev => ({ ...prev, [fieldKey]: val }));
  };

  const executeBulkImport = async () => {
    if (rows.length === 0 || !currentUser) return;
    setIsProcessing(true); setErrorMessage('');
    const compiledLeads: any[] = [];
    try {
      rows.forEach((row) => {
        let name = '';
        if (mappings.name) name = row[parseInt(mappings.name)];
        else if (mappings.firstName && mappings.lastName) name = `${row[parseInt(mappings.firstName)]} ${row[parseInt(mappings.lastName)]}`.trim();
        else name = 'Unknown Imported Lead';

        const valStr = mappings.value ? row[parseInt(mappings.value)] : '0';
        const mappedIndices = new Set(Object.values(mappings).filter(Boolean).map(v => parseInt(v)));
        const detailsArray: any[] = [];
        headers.forEach((h, idx) => { if (!mappedIndices.has(idx)) detailsArray.push({ key: h, value: row[idx] }); });

        compiledLeads.push({
          name, company: mappings.company ? row[parseInt(mappings.company)] : 'Not Specified',
          targetProject: mappings.targetProject ? row[parseInt(mappings.targetProject)] : 'Not Specified',
          value: parseFloat(valStr.replace(/[^\d.-]/g, '')) || 0,
          stage: 'New', email: mappings.email ? row[parseInt(mappings.email)] : '',
          phone: mappings.phone ? row[parseInt(mappings.phone)] : '',
          whatsapp: mappings.whatsapp ? row[parseInt(mappings.whatsapp)] : '',
          assignedById: currentUser.id, dateCreated: new Date().toISOString(),
          details: JSON.stringify(detailsArray), aiScore: Math.floor(Math.random() * 40) + 50
        });
      });

      if (await importLeadsBulk(compiledLeads)) onImportComplete();
      else setErrorMessage('The system failed to execute bulk lead importing.');
    } catch (err: any) { setErrorMessage(err.message || 'Error occurred.'); }
    finally { setIsProcessing(false); }
  };

  return {
    selectedTemplateIndex, headers, rows, mappings, isProcessing, errorMessage,
    selectTemplate, handleMappingChange, executeBulkImport
  };
}
