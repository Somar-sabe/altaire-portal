"use client";
/**
 * @file /app/modules/leads/components/StageQualityMatrix.tsx
 * @description Advanced Interactive Sales-Stage and Quality-Evaluation Merge Matrix widget featuring 6 distinct levels. Fully localized to English.
 */

import React from 'react';
import { LrmLead } from '../store';
import { STAGE_OPTIONS, STAGE_LABELS } from '../constants';

interface MatrixProps {
  lead: LrmLead;
  onUpdateLead: (payload: Partial<LrmLead>) => Promise<any>;
}

const MATRIX_STAGES = STAGE_OPTIONS;
const MATRIX_QUALITIES = [
  { label: 'Hot Qualified', dbVal: 'Hot Qualified', color: 'bg-rose-600 animate-pulse' },
  { label: 'Qualified', dbVal: 'Qualified', color: 'bg-emerald-500' },
  { label: 'Responsive', dbVal: 'Responsive', color: 'bg-sky-500' },
  { label: 'Low Budget', dbVal: 'Low Budget', color: 'bg-yellow-500' },
  { label: 'Not Qualified', dbVal: 'Not Qualified', color: 'bg-amber-700' },
  { label: 'Trash', dbVal: 'Trash', color: 'bg-slate-500' },
  { label: 'Pending Review', dbVal: 'Pending Review', color: 'bg-slate-400' }
];

export default function StageQualityMatrix({ lead, onUpdateLead }: MatrixProps) {
  const isRowActive = (dbVal: string) => {
    const tags = lead.tags || [];
    const query = dbVal.trim().toLowerCase();
    const hasMatch = tags.some(t => t.toLowerCase() === query);
    if (hasMatch) return true;
    if (query === 'pending review' && tags.length === 0) return true;
    return false;
  };

  const handleCellClick = async (stage: string, qualityVal: string) => {
    try {
      await onUpdateLead({ stage, tags: qualityVal === 'Pending Review' ? [] : [qualityVal] });
    } catch (e) {
      console.error('Matrix update failed:', e);
    }
  };

  const getMatrixAdvisory = (stg: string, tags: string[]) => {
    const hasTag = (val: string) => tags.some(t => t.toLowerCase() === val.toLowerCase());

    if (tags.length === 0) {
      return stg === 'NEW'
        ? { score: "N/A", status: "Fresh (Unassessed)", text: "New lead pending quality evaluation. Initiate contact to determine fit.", color: "text-slate-550 border-slate-500/20 bg-slate-500/5" }
        : { score: "Incomplete", status: "⚠️ Action without Quality", text: "Lead moved forward without quality assessment. Please review quality classification.", color: "text-amber-600 border-amber-500/20 bg-amber-500/5" };
    }

    if (hasTag('hot qualified')) {
      if (['NEW', 'IN_PROGRESS'].includes(stg)) {
        return { score: "98%", status: "🔥 Hot Early Capture", text: "High value lead requiring immediate contact. Deliver bespoke proposal within 1 hour.", color: "text-rose-600 border-rose-500/20 bg-rose-500/5" };
      }
      if (['INTERESTED', 'BOOKED'].includes(stg)) {
        return { score: "99%", status: "⚡ Critical Golden Deal", text: "Closing phase! Lead is highly engaged and qualified. Draft contracts now.", color: "text-orange-600 border-orange-500/20 bg-orange-500/5" };
      }
      if (stg === 'CONVERTED') {
        return { score: "100%", status: "🏆 Master Conversion Success", text: "Contract signed and high value secured. Transitioning to operations.", color: "text-purple-600 border-purple-500/20 bg-purple-500/5" };
      }
      return { score: "30%", status: "⚠️ High-Value Lost", text: "Hot lead marked as lost! Escalate immediately to supervisor for active recovery.", color: "text-red-600 border-red-500/20 bg-red-500/5" };
    }

    if (hasTag('qualified')) {
      if (['NEW', 'IN_PROGRESS'].includes(stg)) {
        return { score: "85%", status: "🟢 Prime Nurturing", text: "Standard qualified profile. Deliver products catalog and proceed to booking.", color: "text-emerald-600 border-emerald-500/20 bg-emerald-500/5" };
      }
      if (['INTERESTED', 'BOOKED'].includes(stg)) {
        return { score: "90%", status: "🎯 Confirmed Priority Lead", text: "Booking confirmed. Log prerequisites and budget definitions to proceed.", color: "text-teal-600 border-teal-500/20 bg-teal-500/5" };
      }
      if (stg === 'CONVERTED') {
        return { score: "100%", status: "🌟 Standard Conversion", text: "Standard conversion validated. Sales parameters logged and file transferred.", color: "text-emerald-600 border-emerald-500/20 bg-emerald-500/5" };
      }
      return { score: "15%", status: "Recycled", text: "Muted pipeline recycle. Excluded lead targeted in quarterly nurture campaigns.", color: "text-slate-500 border-slate-500/20 bg-slate-500/5" };
    }

    if (hasTag('responsive')) {
      if (['NEW', 'IN_PROGRESS', 'INTERESTED'].includes(stg)) {
        return { score: "70%", status: "💬 Active Chat Engagement", text: "Highly responsive prospect on text. Secure a phone appointment to finalize details.", color: "text-sky-600 border-sky-500/20 bg-sky-500/5" };
      }
      if (stg === 'BOOKED') {
        return { score: "80%", status: "📅 Responsive Fit Appointment", text: "Meeting scheduled with interactive lead. Confirm 24 hours prior to maximize attendance.", color: "text-blue-600 border-blue-500/20 bg-blue-500/5" };
      }
      if (stg === 'CONVERTED') {
        return { score: "100%", status: "🎉 Responsive Success", text: "Engaged lead converted successfully. Process primary setup details.", color: "text-blue-600 border-blue-500/20 bg-blue-500/5" };
      }
      return { score: "10%", status: "Stalled Interaction", text: "Engagement cooling down. Schedule soft weekly check-ins to re-open.", color: "text-slate-400 border-slate-500/10 bg-slate-500/5" };
    }

    if (hasTag('low budget')) {
      if (['NEW', 'IN_PROGRESS', 'INTERESTED'].includes(stg)) {
        return { score: "50%", status: "💰 Budget Constrained", text: "High interest but restricted budget. Offer scaled options or flexible plans.", color: "text-yellow-600 border-yellow-500/20 bg-yellow-500/5" };
      }
      return { score: "65%", status: "🎗️ Budget-Flexible Conversion", text: "Low budget lead converted/booked. Monitor payments schedule closely to prevent risk.", color: "text-yellow-700 border-yellow-600/20 bg-yellow-600/5" };
    }

    if (hasTag('not qualified')) {
      if (['BOOKED', 'CONVERTED'].includes(stg)) {
        return { score: "35%", status: "🛑 Incompatible Validation Link", text: "Warning: Unqualified lead pushed to booking/conversion. Review with supervisor.", color: "text-rose-700 border-rose-600/20 bg-rose-600/5" };
      }
      return { score: "30%", status: "⚠️ Profile Misalignment", text: "Lead does not match service specifications. Limit rep hours allocated here.", color: "text-amber-700 border-amber-600/25 bg-amber-600/5" };
    }

    if (stg === 'CONVERTED' || stg === 'BOOKED') {
      return { score: "15%", status: "🚨 High Risk Metric Alarm", text: "Warning: Active sales progression check on a Trash status lead. Verify info.", color: "text-red-750 border-red-500/35 bg-red-500/5" };
    }
    return { score: "0%", status: "🗑️ Unusable Lead Index", text: "Trash, incorrect contact number, or spam profile. Discontinued contact.", color: "text-slate-500 border-slate-500/10 bg-slate-500/5" };
  };

  const advice = getMatrixAdvisory(lead.stage, lead.tags);

  return (
    <div className="border border-slate-200/60 dark:border-slate-800 rounded-[10px] p-3 text-left bg-slate-50/50 dark:bg-slate-950/20" id="stage-quality-matrix-widget">
      <div className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center justify-between">
        <span>Stage & Quality Strategic Matrix</span>
        <span className="text-[8px] px-1 bg-indigo-500/15 text-indigo-600 rounded font-bold">Interactive CRM Protocol</span>
      </div>
      <p className="text-xs text-slate-450 font-bold mb-3 mt-0.5 leading-relaxed">
        Click any cell in the matrix grid to dynamically update both Sales Stage and Quality status:
      </p>

      <div className="grid grid-cols-8 gap-1 text-center font-bold text-[8.5px] select-none mb-3">
        <div className="text-slate-400 font-extrabold self-center text-[7.5px] truncate text-center">Quality \ Stage</div>
        {MATRIX_STAGES.map((stg) => (
          <div 
            key={stg} 
            className={`py-0.5 rounded text-slate-500 font-extrabold truncate text-center ${
              lead.stage === stg ? 'text-indigo-600 dark:text-indigo-400 font-black underline underline-offset-2' : ''
            }`}
            title={STAGE_LABELS[stg] || stg}
          >
            {STAGE_LABELS[stg] || stg}
          </div>
        ))}

        {MATRIX_QUALITIES.map((qual) => {
          const rowActive = isRowActive(qual.dbVal);
          return (
            <React.Fragment key={qual.dbVal}>
              <div className="flex items-center gap-1 justify-start text-[7.5px] text-slate-600 dark:text-slate-300 font-extrabold pr-0.5 min-w-[55px] truncate">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${qual.color}`} />
                <span className="truncate">{qual.label}</span>
              </div>

              {MATRIX_STAGES.map((stg) => {
                const isSelected = lead.stage === stg && rowActive;
                return (
                  <button
                    type="button"
                    key={stg}
                    onClick={() => handleCellClick(stg, qual.dbVal)}
                    className={`h-7 rounded border transition-all cursor-pointer flex items-center justify-center relative ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-550/15 dark:bg-indigo-950/30'
                        : 'border-slate-200/50 dark:border-slate-800 hover:border-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 bg-white dark:bg-slate-900/60'
                    }`}
                    title={`${qual.label} & stage: ${STAGE_LABELS[stg] || stg}`}
                  >
                    {isSelected ? (
                      <div className={`w-1.5 h-1.5 rounded-full ${qual.color}`} />
                    ) : (
                      <div className="w-1 h-1 rounded-full bg-slate-200/60 dark:bg-slate-800" />
                    )}
                  </button>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>

      <div className={`border rounded-[8px] p-2 text-xs font-semibold space-y-1 ${advice.color}`}>
        <div className="flex items-center justify-between font-black uppercase text-[8px] tracking-widest">
          <span>Advisory status: {advice.status}</span>
          <span className="font-mono text-[9.5px]">Success: {advice.score}</span>
        </div>
        <p className="leading-normal text-slate-800 dark:text-slate-200 font-medium">
          {advice.text}
        </p>
      </div>
    </div>
  );
}
