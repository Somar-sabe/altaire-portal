"use client";
/**
 * @file /app/modules/team/components/TeamFilters.tsx
 * @purpose Renders the filter modal for the team members list.
 */

import React from "react";
import { X, Filter, RotateCcw } from "lucide-react";
import type { Department, Role, UserStatus } from "../types";
import { ROLE_LABELS, STATUS_LABELS } from "../types";

interface TeamFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filterDepartment: Department | 'All';
  setFilterDepartment: (dept: Department | 'All') => void;
  filterRole: Role | 'All';
  setFilterRole: (role: Role | 'All') => void;
  filterStatus: UserStatus | 'All';
  setFilterStatus: (status: UserStatus | 'All') => void;
}

export default function TeamFilters({
  isOpen,
  onClose,
  filterDepartment,
  setFilterDepartment,
  filterRole,
  setFilterRole,
  filterStatus,
  setFilterStatus,
}: TeamFiltersProps) {
  if (!isOpen) return null;

  const resetFilters = () => {
    setFilterDepartment('All');
    setFilterRole('All');
    setFilterStatus('All');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-[24px] w-full max-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <h3 className="font-black text-slate-900 uppercase tracking-tight">Filter Members</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Department</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20"
            >
              <option value="All">All Departments</option>
              {["Executive", "Operations", "Sales", "Engineering", "Marketing", "Customer Support"].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Role Type</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20"
            >
              <option value="All">All Roles</option>
              {Object.entries(ROLE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Account Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-[12px] text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20"
            >
              <option value="All">All Statuses</option>
              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2.5 bg-slate-50 text-slate-600 rounded-[12px] text-xs font-black hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-black text-white rounded-[12px] text-sm font-black hover:bg-slate-800 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
