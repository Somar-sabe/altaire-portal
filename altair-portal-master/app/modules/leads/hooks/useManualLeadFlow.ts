/**
 * @file /app/modules/leads/hooks/useManualLeadFlow.ts
 * @purpose Custom hook to handle the multi-step manual lead creation flow.
 */

import { useState } from 'react';

export function useManualLeadFlow(onSubmit: (data: any) => void) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [telegram, setTelegram] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [workPhone, setWorkPhone] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [country, setCountry] = useState('');
  const [lang, setLang] = useState('');
  const [source, setSource] = useState('');
  const [value, setValue] = useState('');
  const [stage, setStage] = useState('New');
  const [quality, setQuality] = useState('');
  const [assignedAgentId, setAssignedAgentId] = useState('');

  const [detailsList, setDetailsList] = useState<{title: string, content: string}[]>([]);
  const [newDetailTitle, setNewDetailTitle] = useState('');
  const [newDetailContent, setNewDetailContent] = useState('');

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { handleNext(); return; }
    onSubmit({
      name, phone, email, whatsapp, telegram, instagram, facebook,
      workPhone, workEmail, country, lang, source, value: Number(value) || 0,
      stage, quality, assignedAgentId, details: detailsList.length > 0 ? JSON.stringify(detailsList) : '[]'
    });
  };

  return {
    step, setStep, name, setName, phone, setPhone, email, setEmail,
    whatsapp, setWhatsapp, telegram, setTelegram, instagram, setInstagram, facebook, setFacebook,
    workPhone, setWorkPhone, workEmail, setWorkEmail, country, setCountry, lang, setLang,
    source, setSource, value, setValue, stage, setStage, quality, setQuality, assignedAgentId, setAssignedAgentId,
    detailsList, setDetailsList, newDetailTitle, setNewDetailTitle, newDetailContent, setNewDetailContent,
    handleNext, handlePrev, handleSubmit
  };
}
