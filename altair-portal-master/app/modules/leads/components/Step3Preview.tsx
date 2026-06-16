"use client";
/**
 * @file /app/modules/leads/components/Step3Preview.tsx
 * @purpose Renders the third step of the manual lead creation modal (Preview).
 */

import React from 'react';
import { Globe, Building2, MapPin, DollarSign, Briefcase, Share2 } from 'lucide-react';
import { STAGE_LABELS } from '../constants';

interface Step3PreviewProps {
  name: string;
  email: string;
  phone: string;
  stage: string;
  country: string;
  lang: string;
  quality: string;
  source: string;
  value: string;
  workPhone: string;
  workEmail: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  facebook: string;
  detailsList: {title: string, content: string}[];
  assignedAgentId: string;
  systemAgents: any[];
}

export default function Step3Preview({
  name, email, phone, stage, country, lang, quality, source, value, workPhone, workEmail, whatsapp, telegram, instagram, facebook, detailsList, assignedAgentId, systemAgents
}: Step3PreviewProps) {
  const getAgentName = (id: string) => {
    if (!id) return '-- Auto-allocation Cycle --';
    const ag = systemAgents.find(a => a.id === id);
    return ag ? `${ag.firstName} ${ag.lastName}` : id;
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in text-left">
      <h4 className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 mb-1 tracking-widest">Data Preview</h4>
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[12px] p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 dark:text-white capitalize">{name || 'Unnamed Lead'}</span>
            <span className="text-slate-500 text-xs font-mono mt-0.5">{email || phone || 'No basic contact provided'}</span>
          </div>
          <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-bold">
            {STAGE_LABELS[stage] || stage}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="text-slate-700 dark:text-slate-300">Locale: {country || 'Worldwide'} ({lang || 'Unknown'})</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="text-slate-700 dark:text-slate-300">Quality: {quality || 'Unassigned'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="text-slate-700 dark:text-slate-300">Source: {source || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <span className="text-slate-700 dark:text-slate-300">Value: ${value || '0'}</span>
          </div>
          {(workPhone || workEmail) && (
            <div className="flex items-center gap-2 sm:col-span-2">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">Work: {workPhone || 'N/A'} | {workEmail || 'N/A'}</span>
            </div>
          )}
          {(whatsapp || telegram || instagram || facebook) && (
            <div className="flex flex-wrap items-center gap-4 sm:col-span-2 bg-slate-100/50 dark:bg-slate-800/50 p-2 rounded-md">
              <Share2 className="w-4 h-4 text-slate-400 shrink-0" />
              {whatsapp && <span className="text-slate-600 dark:text-slate-400">WA: {whatsapp}</span>}
              {telegram && <span className="text-slate-600 dark:text-slate-400">TG: {telegram}</span>}
              {instagram && <span className="text-slate-600 dark:text-slate-400">IG: {instagram}</span>}
              {facebook && <span className="text-slate-600 dark:text-slate-400">FB: {facebook}</span>}
            </div>
          )}
          {detailsList?.length > 0 && (
            <div className="flex flex-col gap-2 sm:col-span-2 mt-2">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Custom Details</span>
              <div className="grid grid-cols-2 gap-2">
                {detailsList.map((dt, idx) => (
                  <div key={dt.title + idx} className="bg-slate-100 dark:bg-slate-800/80 p-2 rounded text-slate-700 dark:text-slate-300">
                    <span className="text-slate-400 text-[10px] block uppercase mb-0.5">{dt.title}</span>
                    {dt.content}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 sm:col-span-2 mt-2">
            <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-md w-full font-mono text-slate-500">
              Agent: {getAgentName(assignedAgentId)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
