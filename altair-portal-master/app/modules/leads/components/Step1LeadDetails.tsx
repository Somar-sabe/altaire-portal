"use client";
/**
 * @file /app/modules/leads/components/Step1LeadDetails.tsx
 * @purpose Renders the first step of the manual lead creation modal.
 */

import React from 'react';
import ManualLeadDetailsSection from './ManualLeadDetailsSection';

interface Step1LeadDetailsProps {
  name: string; setName: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  country: string; setCountry: (v: string) => void;
  lang: string; setLang: (v: string) => void;
  value: string; setValue: (v: string) => void;
  workPhone: string; setWorkPhone: (v: string) => void;
  workEmail: string; setWorkEmail: (v: string) => void;
  whatsapp: string; setWhatsapp: (v: string) => void;
  telegram: string; setTelegram: (v: string) => void;
  instagram: string; setInstagram: (v: string) => void;
  facebook: string; setFacebook: (v: string) => void;
  detailsList: any[]; setDetailsList: React.Dispatch<React.SetStateAction<any[]>>;
  newDetailTitle: string; setNewDetailTitle: (t: string) => void;
  newDetailContent: string; setNewDetailContent: (c: string) => void;
  COUNTRY_OPTIONS: string[];
  LANG_OPTIONS: string[];
}

export default function Step1LeadDetails({
  name, setName, phone, setPhone, email, setEmail, country, setCountry, lang, setLang, value, setValue,
  workPhone, setWorkPhone, workEmail, setWorkEmail, whatsapp, setWhatsapp, telegram, setTelegram, instagram, setInstagram, facebook, setFacebook,
  detailsList, setDetailsList, newDetailTitle, setNewDetailTitle, newDetailContent, setNewDetailContent,
  COUNTRY_OPTIONS, LANG_OPTIONS
}: Step1LeadDetailsProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="lead-name" className="uppercase tracking-wider text-sm text-slate-500">Full Lead Name <span className="text-red-500">*</span></label>
          <input id="lead-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter lead full name..." className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="uppercase tracking-wider text-sm text-slate-500">Phone Number</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +1 555..." className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-mono" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="uppercase tracking-wider text-sm text-slate-500">Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-mono" />
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
        <h4 className="text-xs font-black uppercase text-slate-900 dark:text-slate-100 mb-3 tracking-widest">Personal Details (Budget & Loc)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 text-slate-600">
            <label className="uppercase tracking-wider text-sm text-slate-500">Country</label>
            <input type="text" list="country-list" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Search country..." className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500" />
            <datalist id="country-list">{COUNTRY_OPTIONS.map(c => <option key={c} value={c} />)}</datalist>
          </div>
          <div className="flex flex-col gap-1">
            <label className="uppercase tracking-wider text-sm text-slate-500">Language</label>
            <input type="text" list="lang-list" value={lang} onChange={(e) => setLang(e.target.value)} placeholder="Search language..." className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500" />
            <datalist id="lang-list">{LANG_OPTIONS.map(l => <option key={l} value={l} />)}</datalist>
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="uppercase tracking-wider text-sm text-slate-500">Expected Budget ($)</label>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value in USD..." className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-mono" />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
        <h4 className="text-xs font-black uppercase text-slate-900 dark:text-slate-100 mb-3 tracking-widest">Work Info</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="uppercase tracking-wider text-sm text-slate-500">Work Phone</label>
            <input type="text" value={workPhone} onChange={(e) => setWorkPhone(e.target.value)} placeholder="Company landline" className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="uppercase tracking-wider text-sm text-slate-500">Work Email</label>
            <input type="email" value={workEmail} onChange={(e) => setWorkEmail(e.target.value)} placeholder="corporate@company.com" className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
        <h4 className="text-xs font-black uppercase text-slate-900 dark:text-slate-100 mb-3 tracking-widest">Social Channels</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="uppercase tracking-wider text-sm text-slate-500">WhatsApp</label>
            <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp username" className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="uppercase tracking-wider text-sm text-slate-500">Telegram</label>
            <input type="text" value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="Telegram handle" className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="uppercase tracking-wider text-sm text-slate-500">Instagram</label>
            <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@username" className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="uppercase tracking-wider text-sm text-slate-500">Facebook</label>
            <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="Profile ID" className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
        <ManualLeadDetailsSection 
          detailsList={detailsList} setDetailsList={setDetailsList}
          newDetailTitle={newDetailTitle} setNewDetailTitle={setNewDetailTitle}
          newDetailContent={newDetailContent} setNewDetailContent={setNewDetailContent}
        />
      </div>
    </div>
  );
}
