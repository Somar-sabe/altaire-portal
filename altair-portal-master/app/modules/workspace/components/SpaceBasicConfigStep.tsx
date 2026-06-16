"use client";
/**
 * @file /app/modules/workspace/components/SpaceBasicConfigStep.tsx
 * @purpose Renders the first step of the space creation modal.
 */

import React from 'react';
import { Globe, Lock } from 'lucide-react';

interface SpaceBasicConfigStepProps {
  spaceName: string; setSpaceName: (v: string) => void;
  spaceDescription: string; setSpaceDescription: (v: string) => void;
  privacy: 'public' | 'private'; setPrivacy: (v: 'public' | 'private') => void;
  onNext: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function SpaceBasicConfigStep({
  spaceName, setSpaceName, spaceDescription, setSpaceDescription, privacy, setPrivacy, onNext, onClose
}: SpaceBasicConfigStepProps) {
  return (
    <form onSubmit={onNext} className="p-4 space-y-4 text-left">
      <div className="space-y-1">
        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Space Name</label>
        <input type="text" placeholder="e.g. sales-update, company-goals" value={spaceName} onChange={e => setSpaceName(e.target.value)} className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 transition text-slate-800 placeholder-slate-400" maxLength={40} autoFocus />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Description</label>
        <textarea placeholder="What is this space about?" value={spaceDescription} onChange={e => setSpaceDescription(e.target.value)} className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 transition min-h-[60px] max-h-[100px] resize-none text-slate-800 placeholder-slate-400" maxLength={120} />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Space Privacy</label>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setPrivacy('public')} className={`p-3 rounded-lg border text-left flex flex-col transition h-full ${privacy === 'public' ? 'border-indigo-600 bg-indigo-50/20 text-slate-900 shadow-sm' : 'border-slate-100 hover:border-slate-200 text-slate-500 hover:bg-slate-50/40'}`}>
            <Globe className={`w-4 h-4 mb-2 ${privacy === 'public' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span className="text-xs font-bold block">Public</span>
            <span className="text-xs text-slate-400 leading-normal mt-0.5 font-medium">Anyone in company can find and join.</span>
          </button>
          <button type="button" onClick={() => setPrivacy('private')} className={`p-3 rounded-lg border text-left flex flex-col transition h-full ${privacy === 'private' ? 'border-indigo-600 bg-indigo-50/20 text-slate-900 shadow-sm' : 'border-slate-100 hover:border-slate-200 text-slate-500 hover:bg-slate-50/40'}`}>
            <Lock className={`w-4 h-4 mb-2 ${privacy === 'private' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span className="text-xs font-bold block">Private</span>
            <span className="text-xs text-slate-400 leading-normal mt-0.5 font-medium">Only invited personnel can join.</span>
          </button>
        </div>
      </div>
      <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
        <button type="button" onClick={onClose} className="px-3.5 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-black rounded-lg shadow-sm transition">Continue to Invites</button>
      </div>
    </form>
  );
}
