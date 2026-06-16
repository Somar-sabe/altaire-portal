/**
 * @file /app/modules/leads/hooks/useLeadDetailsFlow.ts
 * @purpose Custom hook to handle budget editing and dynamic details logic for a lead.
 */

import { useState } from 'react';
import { useLeadsStore } from '../store';

export function useLeadDetailsFlow(lead: any) {
  const updateLead = useLeadsStore((s) => s.updateLead);

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetValue, setBudgetValue] = useState(lead.value.toString());

  const [isAddingDetail, setIsAddingDetail] = useState(false);
  const [newDetailKey, setNewDetailKey] = useState('');
  const [newDetailValue, setNewDetailValue] = useState('');

  const handleBudgetSave = () => {
    const val = parseFloat(budgetValue);
    if (!isNaN(val)) updateLead(lead.id, { value: val });
    setIsEditingBudget(false);
  };

  const handleAddDetail = () => {
    if (!newDetailKey.trim() || !newDetailValue.trim()) return;
    let currentDetails = [];
    try { currentDetails = (lead.details && lead.details !== '[]') ? JSON.parse(lead.details) : []; } catch(e) {}
    currentDetails.push({ key: newDetailKey, value: newDetailValue });
    updateLead(lead.id, { details: JSON.stringify(currentDetails) });
    setNewDetailKey(''); setNewDetailValue(''); setIsAddingDetail(false);
  };

  const handleRemoveDetail = (index: number) => {
    let currentDetails = [];
    try { currentDetails = (lead.details && lead.details !== '[]') ? JSON.parse(lead.details) : []; } catch(e) {}
    currentDetails.splice(index, 1);
    updateLead(lead.id, { details: JSON.stringify(currentDetails) });
  };

  return {
    isEditingBudget, setIsEditingBudget, budgetValue, setBudgetValue, handleBudgetSave,
    isAddingDetail, setIsAddingDetail, newDetailKey, setNewDetailKey, newDetailValue, setNewDetailValue, handleAddDetail, handleRemoveDetail
  };
}
