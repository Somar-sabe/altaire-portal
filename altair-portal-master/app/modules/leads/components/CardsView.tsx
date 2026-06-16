'use client';

/**
 * @file /app/modules/leads/components/CardsView.tsx
 * @description Beautiful custom cards view styled to align perfectly with Image 1. Highlights lead information, target plots, notes block, and geography tags.
 * @dependencies react, lucide-react, @/app/modules/leads/store
 * @workplan WP-019
 */

import React from 'react';
import { LrmLead } from '../store';
import { Phone, Mail, FileText, Calendar, Compass } from 'lucide-react';
import { STAGE_LABELS } from '../constants';

interface CardsViewProps {
  leads: LrmLead[];
  onSelectLead: (lead: LrmLead) => void;
}

export default function CardsView({ leads, onSelectLead }: CardsViewProps) {
  return (
    <div className="flex-1 pb-4" id="cards-view-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {leads.map((lead) => {
          // Determine stage colors matching the screenshots
          let stageBg = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
          let stageLabel = STAGE_LABELS[lead.stage] || lead.stage;

          if (lead.stage === 'FEEDBACK_REQ') {
            stageBg = 'bg-amber-100 text-amber-805 font-bold border border-amber-200/40';
          } else if (lead.stage === 'CONTACTED') {
            stageBg = 'bg-blue-100 text-blue-700 font-bold border border-blue-200/40';
          } else if (lead.stage === 'NEW') {
            stageBg = 'bg-emerald-100 text-emerald-700 font-bold border border-emerald-200/40';
          } else if (['BOOKED', 'INTERESTED', 'IN_PROGRESS'].includes(lead.stage)) {
            stageBg = 'bg-emerald-100 text-emerald-700 font-bold border border-emerald-200/40';
          } else if (lead.stage === 'CONVERTED') {
            stageBg = 'bg-purple-100 text-purple-700 font-bold border border-purple-200/40';
          }

          let qualityLabel = 'Pending Review';
          let qualityColor = 'text-slate-600 bg-slate-500/5 border-slate-500/20 dark:text-slate-400';
          
          const tags = lead.tags || [];
          const hasTag = (val: string) => tags.some(t => t.toLowerCase().includes(val.toLowerCase()));

          if (hasTag('hot qualified')) {
            qualityLabel = 'Hot Qualified';
            qualityColor = 'text-rose-700 bg-rose-500/5 border-rose-500/25 dark:text-rose-400 animate-pulse';
          } else if (hasTag('not qualified')) {
            qualityLabel = 'Not Qualified';
            qualityColor = 'text-amber-800 bg-amber-500/5 border-amber-500/30 dark:text-amber-400';
          } else if (hasTag('low budget')) {
            qualityLabel = 'Low Budget';
            qualityColor = 'text-yellow-700 bg-yellow-500/5 border-yellow-500/20 dark:text-yellow-400';
          } else if (hasTag('responsive')) {
            qualityLabel = 'Responsive';
            qualityColor = 'text-sky-700 bg-sky-505/5 border-sky-500/20 dark:text-sky-400';
          } else if (hasTag('trash')) {
            qualityLabel = 'Trash';
            qualityColor = 'text-slate-600 bg-slate-500/5 border-slate-500/20 dark:text-slate-400';
          } else if (hasTag('qualified')) {
            qualityLabel = 'Qualified';
            qualityColor = 'text-emerald-700 bg-emerald-500/5 border-emerald-500/20 dark:text-emerald-400';
          }

          return (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[12px] p-5 flex flex-col justify-between hover:shadow-md hover:border-slate-350 dark:hover:border-slate-705 transition-all cursor-pointer relative font-sans text-left"
              style={{ minHeight: '340px' }}
              id={`card-tile-${lead.id}`}
            >
              {/* Card Header: Lead ID and Stage */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                    LD-{new Date(lead.dateCreated).getFullYear()}-{lead.id.substring(0, 2).toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${qualityColor}`}>
                      {qualityLabel}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wide tracking-wider ${stageBg}`}>
                      {stageLabel}
                    </span>
                  </div>
                </div>

                {/* Lead Name */}
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-50 mb-1 leading-snug">
                  {lead.name}
                </h3>

                {/* Target Project Plot in Green/Teal accent */}
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mb-4 bg-emerald-500/5 px-2 py-1 rounded-[6px] w-fit">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stage: {STAGE_LABELS[lead.stage] || lead.stage}</span>
                </div>

                {/* Contact Rows with Icons */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{lead.email}</span>
                  </div>
                </div>

                {/* LEAD NOTES & FEEDBACK section block with quotes */}
                {lead.notes && (
                  <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-[8px] text-xs text-slate-500 dark:text-slate-400 mb-4 border border-slate-100/60 dark:border-slate-800/50">
                    <span className="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                      Lead Notes & Feedback
                    </span>
                    <p className="italic leading-normal font-medium text-slate-600 dark:text-slate-300">
                      "{lead.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer: Calendar Stamp and Geography Region badge */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(lead.dateCreated).toLocaleDateString()}</span>
                </div>
                <span className="inline-block px-2 py-0.5 rounded-[4px] text-[8px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/10 uppercase tracking-wider">
                  {lead.lang || 'EN'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {leads.length === 0 && (
        <div className="text-center py-20 text-xs text-slate-400 font-bold uppercase tracking-wider" id="empty-leads-cards">
          No active leads matched in this view yet.
        </div>
      )}
    </div>
  );
}
