/**
 * @file /app/modules/overview/hooks/useOverviewData.ts
 * @purpose Custom hook to fetch and compute dashboard overview data.
 */

import { useState, useEffect, useMemo } from 'react';
import { fetchPaginatedCollection } from '@/lib/paginated-fetch';

export function useOverviewData() {
  const [users, setUsers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // GPT-Codex (G) BEGIN: compute overview from bounded paginated API reads.
        const [fetchedUsers, fetchedLeads] = await Promise.all([
          fetchPaginatedCollection<any>('/api/team/users'),
          fetchPaginatedCollection<any>('/api/leads')
        ]);
        setUsers(fetchedUsers);
        setLeads(fetchedLeads);
        // GPT-Codex (G) END: dashboard calculations still operate on flat arrays.
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const computations = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const leadsThisMonth = leads.filter(l => new Date(l.createdAt || l.dateCreated).getMonth() === currentMonth);
    const leadsLastMonth = leads.filter(l => new Date(l.createdAt || l.dateCreated).getMonth() === (currentMonth === 0 ? 11 : currentMonth - 1));

    const wonThisMonth = leadsThisMonth.filter(l => l.stage === 'CONVERTED').length;
    const wonLastMonth = leadsLastMonth.filter(l => l.stage === 'CONVERTED').length;
    const lostThisMonth = leadsThisMonth.filter(l => l.stage === 'LOST').length;
    const lostLastMonth = leadsLastMonth.filter(l => l.stage === 'LOST').length;

    // Stages mapping
    const stagesCount = {
      'Negotiation': leads.filter(l => ['NEW', 'IN_PROGRESS'].includes(l.stage)).length,
      'Contract': leads.filter(l => ['CONTACTED', 'FEEDBACK_REQ'].includes(l.stage)).length,
      'Qualified': leads.filter(l => l.stage === 'INTERESTED').length,
      'Demo Scheduled': leads.filter(l => l.stage === 'BOOKED').length,
    };

    // Latest Companies
    const uniqueCompanies = Array.from(new Set(leads.map(l => l.company))).filter(Boolean);
    const latestCompanies = uniqueCompanies.slice(0, 5).map((comp, i) => {
      const lead = leads.find(l => l.company === comp);
      const owner = users.find(u => u.id === lead?.assignedAgentId);
      return {
        id: (i + 1).toString(),
        name: comp,
        owner: owner ? `${owner.firstName} ${owner.lastName}` : 'System Agent',
        domain: `www.${(comp as string).toLowerCase().replace(/\s/g, '')}.com`
      };
    });

    // Revenue Won
    const revenueMonths = Array(12).fill(0);
    leads.filter(l => l.stage === 'CONVERTED').forEach(l => {
      const d = new Date(l.createdAt || l.dateCreated);
      if (d.getFullYear() === currentYear) revenueMonths[d.getMonth()] += (l.value || 0);
    });

    // Latest Activities
    const latestActivities = leads.slice(0, 4).map((l, i) => {
       const owner = users.find(u => u.id === l.assignedAgentId);
       const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'System Agent';
       return {
         id: l.id || i.toString(),
         title: l.targetProject || l.company || 'Unknown Project',
         owner: ownerName,
         action: l.lastActivitySummary || `Stage Updated: ${l.stage}`,
         time: `${new Date(l.updatedAt || l.createdAt).toLocaleDateString()} • ${ownerName}`,
         status: l.stage === 'CONVERTED' ? 'Deal' : l.stage === 'LOST' ? 'Status' : 'Stage'
       };
    });

    // Deals Report
    const dealsReport = users.slice(0, 5).map((u, i) => {
       const assigned = leads.filter(l => l.assignedAgentId === u.id);
       return {
         id: `000${i+1}`,
         name: `${u.firstName} ${u.lastName}`,
         assigned: assigned.length.toString().padStart(2, '0'),
         won: assigned.filter(l => l.stage === 'CONVERTED').length.toString().padStart(2, '0'),
         lost: assigned.filter(l => l.stage === 'LOST').length.toString().padStart(2, '0'),
       };
    });

    // Countries
    const countriesCount: Record<string, number> = {};
    users.forEach(u => { countriesCount[u.location || 'Unknown'] = (countriesCount[u.location || 'Unknown'] || 0) + 1; });
    const userCountries = Object.entries(countriesCount).map(([country, count], i) => ({
      id: `0${i+1}`, country,
      flag: country.includes('USA') ? '🇺🇸' : country.includes('India') ? '🇮🇳' : country === 'Unknown' ? '🌍' : '📍',
      count: count.toString().padStart(2, '0')
    })).slice(0, 5);

    return {
      leadsTotal: leads.length,
      leadsThisMonth, leadsLastMonth,
      wonThisMonth, wonLastMonth,
      lostThisMonth, lostLastMonth,
      stagesCount,
      latestCompanies,
      revenueMonths,
      latestActivities,
      dealsReport,
      userCountries,
      maxStageCount: Math.max(1, ...Object.values(stagesCount)),
      maxRev: Math.max(7000, ...revenueMonths)
    };
  }, [leads, users]);

  return { users, leads, loading, ...computations };
}
