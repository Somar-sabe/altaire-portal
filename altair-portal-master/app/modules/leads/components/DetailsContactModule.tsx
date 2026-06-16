"use client";
/**
 * @file /app/modules/leads/components/DetailsContactModule.tsx
 * @purpose Renders the contact and social channel details for a lead.
 */

import React from 'react';
import { Phone, Mail, Smartphone, MessageCircle, Send, Instagram, Facebook } from 'lucide-react';

interface DetailsContactModuleProps {
  lead: any;
  isAgent: boolean;
  displayedEmail: string;
  displayedPhone: string;
}

export default function DetailsContactModule({
  lead, isAgent, displayedEmail, displayedPhone
}: DetailsContactModuleProps) {
  const maskStyle = isAgent ? 'select-none pointer-events-none' : '';

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><Phone className="w-3 h-3" /> Contact Details</span>
        <div className="grid grid-cols-1 gap-2">
           <div className={`flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[8px] px-3 py-2 ${maskStyle}`}>
             <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Email</span>
             <div className="flex items-center gap-2">
               <Mail className="w-3 h-3 text-slate-400 shrink-0" />
               <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{displayedEmail || '---'}</span>
             </div>
           </div>
           <div className="grid grid-cols-2 gap-2">
             <div className={`flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[8px] px-3 py-2 ${maskStyle}`}>
               <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Mobile</span>
               <div className="flex items-center gap-2">
                 <Smartphone className="w-3 h-3 text-slate-400 shrink-0" />
                 <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{displayedPhone || '---'}</span>
               </div>
             </div>
             <div className={`flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[8px] px-3 py-2 ${maskStyle}`}>
               <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Work Phone</span>
               <div className="flex items-center gap-2">
                 <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                 <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{lead.workPhone || '---'}</span>
               </div>
             </div>
           </div>
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><MessageCircle className="w-3 h-3" /> Social Channels</span>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'WhatsApp', icon: <MessageCircle className="w-3 h-3 text-green-500" />, val: lead.whatsapp },
            { label: 'Telegram', icon: <Send className="w-3 h-3 text-blue-500" />, val: lead.telegram },
            { label: 'Instagram', icon: <Instagram className="w-3 h-3 text-pink-500" />, val: lead.instagram },
            { label: 'Facebook', icon: <Facebook className="w-3 h-3 text-blue-600" />, val: lead.facebook }
          ].map(s => (
            <div key={s.label} className={`flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[8px] px-3 py-2 ${maskStyle}`}>
               <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">{s.label}</span>
               <div className="flex items-center gap-2">
                 {s.icon}
                 <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{s.val || '---'}</span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
