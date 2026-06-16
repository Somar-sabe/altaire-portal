/**
 * @file /app/modules/leads/hooks/useExportWizard.ts
 * @purpose Custom hook to handle lead filtering and visual report generation.
 */

import { useState, useEffect } from 'react';
import { useLeadsStore } from '../store';
import { useAuthStore } from '../../team/authStore';
import { generateExportHTML } from '../utils/generateExportHTML';
import { fetchPaginatedCollection } from '@/lib/paginated-fetch';
import type { TeamUser } from '../../team/types';

export function useExportWizard(onClose: () => void) {
  const { leads } = useLeadsStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  
  const [filterStage, setFilterStage] = useState('All');
  const [filterTag, setFilterTag] = useState('All');
  const [filterAgent, setFilterAgent] = useState('All');
  const [filterLang, setFilterLang] = useState('All');
  const [filterCountry, setFilterCountry] = useState('All');
  const [systemAgents, setSystemAgents] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  
  useEffect(() => {
    // GPT-Codex (G) BEGIN: hydrate export filters from bounded team user pages.
    fetchPaginatedCollection<TeamUser>('/api/team/users')
      .then(data => setSystemAgents(data))
      .catch(e => console.error(e));
    // GPT-Codex (G) END: export filter state remains a plain agent array.
  }, []);

  const languages = Array.from(new Set(leads.map(l => l.lang))).filter(Boolean);
  const countries = Array.from(new Set(leads.map(l => l.country))).filter(Boolean);
  
  const handleExportVisualPDF = async () => {
    setIsExporting(true);
    try {
      const isAgent = (currentUser?.role as string) === 'AGENT';
      let allowedLeads = leads;
      if (isAgent && currentUser) { allowedLeads = leads.filter(l => l.assignedAgentId === currentUser.id); }
      
      const filtered = allowedLeads.filter(lead => {
        const matchStage = filterStage === 'All' || lead.stage === filterStage;
        const matchTag = filterTag === 'All' || (lead.tags || []).some(t => t.toLowerCase() === filterTag.toLowerCase());
        const matchAgent = filterAgent === 'All' || lead.assignedAgentId === filterAgent;
        const matchLang = filterLang === 'All' || lead.lang === filterLang;
        const matchCountry = filterCountry === 'All' || lead.country === filterCountry;
        return matchStage && matchTag && matchAgent && matchLang && matchCountry;
      });

      if (filtered.length === 0) { alert("No leads match the filters."); setIsExporting(false); return; }

      const stagesKeys = ['New', 'In progress', 'Interested', 'Not Interested', 'Booked', 'Converted', 'Lost'];
      const stageCounts = stagesKeys.map(stg => filtered.filter(l => l.stage === stg).length);
      const tagsMap: Record<string, number> = {};
      filtered.forEach(l => {
        const t = (l.tags || []).join(', ') || 'Unassigned';
        tagsMap[t] = (tagsMap[t] || 0) + 1;
      });
      const topTags = Object.entries(tagsMap).sort((a,b) => b[1] - a[1]).slice(0, 6) as [string, number][];
      
      const printWindow = window.open('', '', 'height=800,width=1000');
      if (!printWindow) return;

      const html = generateExportHTML(filtered, filterStage, filterTag, filterAgent, stagesKeys, stageCounts, topTags);
      printWindow.document.write(html);
      printWindow.document.close();
      onClose();
    } catch (err) { console.error(err); alert("Failed compilation."); } finally { setIsExporting(false); }
  };

  return {
    filterStage, setFilterStage, filterTag, setFilterTag, filterAgent, setFilterAgent,
    filterLang, setFilterLang, filterCountry, setFilterCountry,
    systemAgents, isExporting, languages, countries, handleExportVisualPDF
  };
}
