"use client";
/**
 * @file /app/modules/leads/components/ManualLeadModal.tsx
 * @purpose Multi-step wizard to register a new lead with detailed contact and CRM parameters.
 */

import React, { useEffect } from 'react';
import { X, Send, ChevronRight, ChevronLeft } from 'lucide-react';

// Sub-components
import Step1LeadDetails from './Step1LeadDetails';
import Step2Assignment from './Step2Assignment';
import Step3Preview from './Step3Preview';

// Hooks
import { useManualLeadFlow } from '../hooks/useManualLeadFlow';
import { STAGE_OPTIONS, QUALITY_OPTIONS } from '../constants';

interface ManualLeadModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  systemAgents: any[];
}

export default function ManualLeadModal({ onClose, onSubmit, systemAgents }: ManualLeadModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  const {
    step, name, setName, phone, setPhone, email, setEmail, whatsapp, setWhatsapp, telegram, setTelegram,
    instagram, setInstagram, facebook, setFacebook, workPhone, setWorkPhone, workEmail, setWorkEmail,
    country, setCountry, lang, setLang, source, setSource, value, setValue, stage, setStage, quality, setQuality,
    assignedAgentId, setAssignedAgentId, detailsList, setDetailsList, newDetailTitle, setNewDetailTitle,
    newDetailContent, setNewDetailContent, handlePrev, handleSubmit
  } = useManualLeadFlow(onSubmit);

  const LANG_OPTIONS = ['EN', 'AR', 'FR', 'RU', 'ES', 'FA'];
  const COUNTRY_OPTIONS = ['Worldwide', 'United States', 'United Kingdom', 'Canada', 'Australia', 'UAE', 'Saudi Arabia'];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] w-full max-w-2xl text-left flex flex-col shadow-2xl overflow-hidden max-h-[92vh] font-sans">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">Step {step} of 3</span>
            <h3 className="text-sm font-black text-slate-950 dark:text-slate-50 uppercase tracking-tight">{step === 1 ? 'Lead Details' : step === 2 ? 'Assign Agent' : 'Preview & Save'}</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 space-y-6 text-xs font-bold text-slate-700 dark:text-slate-400 overflow-y-auto scrollbar-thin">
          {step === 1 && (
            <Step1LeadDetails 
              name={name} setName={setName} phone={phone} setPhone={setPhone} email={email} setEmail={setEmail} country={country} setCountry={setCountry} lang={lang} setLang={setLang} value={value} setValue={setValue}
              workPhone={workPhone} setWorkPhone={setWorkPhone} workEmail={workEmail} setWorkEmail={setWorkEmail} whatsapp={whatsapp} setWhatsapp={setWhatsapp} telegram={telegram} setTelegram={setTelegram} instagram={instagram} setInstagram={setInstagram} facebook={facebook} setFacebook={setFacebook}
              detailsList={detailsList} setDetailsList={setDetailsList} newDetailTitle={newDetailTitle} setNewDetailTitle={setNewDetailTitle} newDetailContent={newDetailContent} setNewDetailContent={setNewDetailContent}
              COUNTRY_OPTIONS={COUNTRY_OPTIONS} LANG_OPTIONS={LANG_OPTIONS}
            />
          )}
          {step === 2 && (
            <Step2Assignment 
              source={source} setSource={setSource} stage={stage} setStage={setStage} quality={quality} setQuality={setQuality} assignedAgentId={assignedAgentId} setAssignedAgentId={setAssignedAgentId}
              systemAgents={systemAgents} STAGE_OPTIONS={STAGE_OPTIONS} QUALITY_OPTIONS={QUALITY_OPTIONS}
            />
          )}
          {step === 3 && (
            <Step3Preview 
              name={name} email={email} phone={phone} stage={stage} country={country} lang={lang} quality={quality} source={source} assignedAgentId={assignedAgentId} systemAgents={systemAgents}
              value={value} workPhone={workPhone} workEmail={workEmail} whatsapp={whatsapp} telegram={telegram} instagram={instagram} facebook={facebook} detailsList={detailsList}
            />
          )}
        </div>

        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-950/20">
          {step === 1 ? (
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 dark:border-slate-800 rounded-[8px] text-sm uppercase font-black tracking-wider text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all">Cancel</button>
          ) : (
            <button type="button" onClick={handlePrev} className="flex-1 py-3 border border-slate-200 dark:border-slate-800 rounded-[8px] text-sm uppercase font-black tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all flex items-center justify-center gap-1.5"><ChevronLeft className="w-3.5 h-3.5" /> Back</button>
          )}

          {step < 3 ? (
            <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm uppercase font-black tracking-wider rounded-[8px] flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-indigo-600/10">Continue <ChevronRight className="w-3.5 h-3.5" /></button>
          ) : (
            <button type="submit" className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm uppercase font-black tracking-wider rounded-[8px] flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-emerald-500/10"><Send className="w-3.5 h-3.5" /> Save New Lead</button>
          )}
        </div>
      </form>
    </div>
  );
}
