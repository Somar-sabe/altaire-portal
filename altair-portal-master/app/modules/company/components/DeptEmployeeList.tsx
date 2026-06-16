"use client";
/**
 * @file /app/modules/company/components/DeptEmployeeList.tsx
 * @purpose Renders the employee roster for a department.
 */

import React from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import type { User } from '../hooks/useDepartmentDetails';

interface DeptEmployeeListProps {
  employees: string[];
  isAdding: boolean;
  setIsAdding: (v: boolean) => void;
  employeeName: string;
  setEmployeeName: (v: string) => void;
  onAdd: (e: React.FormEvent) => void;
  onRemove: (name: string) => void;
  users: User[];
}

export default function DeptEmployeeList({
  employees, isAdding, setIsAdding, employeeName, setEmployeeName, onAdd, onRemove, users
}: DeptEmployeeListProps) {
  return (
    <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[12px] p-5 shadow-sm space-y-4 text-left">
      <div className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 flex-nowrap w-full overflow-hidden gap-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Users className="w-4 h-4 text-emerald-500 shrink-0" />
          <h3 className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest truncate">Department Roster</h3>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-[8px] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shrink-0">
            <Plus className="w-3 h-3" /> Add Employee
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={onAdd} className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-[8px] border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase space-y-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400">Employee Name</label>
            <input
              type="text" list="system-users-emp" value={employeeName} onChange={e => setEmployeeName(e.target.value)}
              placeholder="Search or enter custom..."
              className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs font-bold"
              required
            />
            <datalist id="system-users-emp">{users.map(u => (<option key={u.id} value={`${u.firstName} ${u.lastName}`}>{u.email}</option>))}</datalist>
          </div>
          <div className="flex justify-end gap-2 pt-1 font-bold">
            <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-[8px] hover:bg-slate-50 uppercase text-[9px]">Cancel</button>
            <button type="submit" className="px-4 py-1.5 bg-slate-950 text-white rounded-[8px] uppercase text-[9px]">Add Member</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto text-xs font-semibold text-slate-600 dark:text-slate-350">
        {employees.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase font-black border-b border-slate-50 dark:border-slate-850">
                <th className="py-2">Employee Name</th>
                <th className="py-2 text-center w-[80px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {employees.map((emp, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 font-bold text-slate-900 dark:text-slate-100">{emp}</td>
                  <td className="py-3 text-center">
                    <button onClick={() => onRemove(emp)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-all cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Vacant • No members assigned</div>
        )}
      </div>
    </div>
  );
}
