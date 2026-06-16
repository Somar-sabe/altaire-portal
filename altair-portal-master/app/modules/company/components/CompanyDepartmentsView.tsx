"use client";
/**
 * @file /app/modules/company/components/CompanyDepartmentsView.tsx
 * @description Simplified department list and form manager. Focused on basic fields: Name & Description.
 * @dependencies react, ../types, lucide-react (Briefcase, Plus, Edit2, Trash2, X, Users, UserCheck)
 */

'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Users, UserCheck } from 'lucide-react';
import { Department } from '../types';

interface DepartmentsViewProps {
  departments: Department[];
  onAdd: (dept: Omit<Department, 'id'>) => void;
  onEdit: (id: string, updated: Omit<Department, 'id'>) => void;
  onDelete: (id: string) => void;
  onNavigateToDepartment: (id: string) => void;
}

function getInitialsAvatar(name: string = 'Unassigned') {
  const safeName = name || 'Unassigned';
  const parts = safeName.trim().split(/\s+/);
  const initials = parts.length > 1 
    ? (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase()
    : safeName.substring(0, 2).toUpperCase();
  
  const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
  const gradients = [
    'from-indigo-500 to-violet-600 text-white',
    'from-emerald-500 to-teal-600 text-white',
    'from-amber-500 to-orange-600 text-white',
    'from-rose-500 to-pink-600 text-white',
    'from-cyan-500 to-blue-600 text-white',
  ];
  const gradient = gradients[code % gradients.length];
  return { initials, gradient };
}

export default function CompanyDepartmentsView({ departments, onAdd, onEdit, onDelete, onNavigateToDepartment }: DepartmentsViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      description: description.trim(),
      headOfDepartment: 'Unassigned',
      employeeCount: 0,
      budget: 0,
      employees: [],
    });
    resetForm();
    setIsAdding(false);
  };

  const handleStartEdit = (dept: Department) => {
    setEditingId(dept.id);
    setName(dept.name);
    setDescription(dept.description || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const target = departments.find(d => d.id === editingId);
    if (target) {
      onEdit(editingId, {
        ...target,
        name: name.trim(),
        description: description.trim(),
      });
    }
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[12px] p-6 space-y-5" id="view-departments-card">
      <div className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-nowrap w-full overflow-hidden gap-4" id="view-departments-header">
        <div className="min-w-0 flex-1">
          <span className="hidden sm:block text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider truncate">Divisions & Structure</span>
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight block truncate">Departments</h3>
        </div>
        {!isAdding && !editingId && (
          <button
            type="button"
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-[8px] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add<span className="hidden sm:inline"> Department</span>
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={editingId ? handleSaveEdit : handleCreate} className="bg-slate-50/70 dark:bg-slate-950/40 p-5 rounded-[12px] border border-dashed border-indigo-500/30 dark:border-indigo-500/20 space-y-4 animate-fade-in text-xs font-semibold text-left">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
              {editingId ? 'Edit Department Details' : 'Initialize New Corporate Department'}
            </span>
            <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 text-slate-700 dark:text-slate-300">
            <div className="flex flex-col gap-1.5 text-left">
              <label>Department Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="e.g. Sales & Growth, Engineering, Human Potential..." 
                className="p-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold" 
                required 
              />
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label>Division Objectives & Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Enter a concise summary of the duties, scope, and objectives of this department..." 
                rows={3} 
                className="p-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-850">
            <button type="submit" className="px-5 py-2 bg-slate-950 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-[8px] text-xs font-black uppercase tracking-wider cursor-pointer font-bold">
              {editingId ? 'Apply Modifications' : 'Register Department'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-1 font-semibold text-left">
        {departments.map(dept => {
          const { initials, gradient } = getInitialsAvatar(dept.headOfDepartment);
          return (
            <div key={dept.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[10px] hover:border-indigo-500 dark:hover:border-indigo-500/50 hover:shadow-md transition-all flex flex-col justify-between gap-4 group relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex gap-2.5 max-w-[80%] LTR">
                  <div className={`w-8 h-8 rounded-[8px] bg-gradient-to-br ${gradient} flex items-center justify-center font-black text-xs shrink-0 tracking-wide font-sans`}>
                     {initials}
                  </div>
                  <div className="min-w-0 text-left">
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{dept.name}</h4>
                    <span className="text-[8px] text-slate-400 font-mono tracking-widest block uppercase mt-0.5">Dept ID: {dept.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 z-10 shrink-0">
                  <button type="button" onClick={() => handleStartEdit(dept)} className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 rounded-[4px] cursor-pointer" title="Edit Department"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => onDelete(dept.id)} className="p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-500/10 rounded-[4px] cursor-pointer" title="Delete Department"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold line-clamp-2 h-8">
                {dept.description || 'No structural description has been written for this division yet.'}
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 shrink-0"><Users className="w-3.5 h-3.5" /> {dept.employeeCount || 0} Staff</span>
                <span className="flex items-center gap-1.5 truncate flex-1" title={dept.headOfDepartment || 'Unassigned'}><UserCheck className="w-3.5 h-3.5 shrink-0" /> {dept.headOfDepartment || 'Unassigned'}</span>
              </div>

              <button
                type="button"
                onClick={() => onNavigateToDepartment(dept.id)}
                className="w-full mt-2 text-center py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-[8px] text-xs font-black uppercase tracking-wider cursor-pointer transition-all shrink-0"
              >
                Roster & Team Management →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
