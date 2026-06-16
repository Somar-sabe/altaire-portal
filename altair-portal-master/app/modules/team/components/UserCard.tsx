"use client";
/**
 * @file /app/modules/team/components/UserCard.tsx
 * @purpose Renders a single user card in the team list.
 */

import React from "react";
import { MoreHorizontal, Check } from "lucide-react";
import { STATUS_LABELS } from "../types";

interface UserCardProps {
  user: any;
  isManageable: boolean;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onClick: () => void;
  onToggleMenu: (e: React.MouseEvent) => void;
  isMenuOpen: boolean;
  renderMenu: () => React.ReactNode;
}

export default function UserCard({
  user,
  isManageable,
  isSelected,
  onSelect,
  onClick,
  onToggleMenu,
  isMenuOpen,
  renderMenu,
}: UserCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`group bg-white border rounded-2xl p-5 transition-all duration-300 cursor-pointer relative flex flex-col h-full overflow-hidden ${
        user.status === 'INACTIVE' ? 'opacity-75 bg-slate-50/50' : ''
      } ${isSelected ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20 bg-gradient-to-b from-blue-50/50 to-white' : 'border-slate-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:border-slate-300'}`}
    >
      {/* Decorative top gradient if selected */}
      {isSelected && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />}

      {isManageable && user.status !== 'INACTIVE' && (
        <div 
          className="absolute top-4 left-4 z-10"
          onClick={onSelect}
        >
          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
            {isSelected && <Check className="w-3.5 h-3.5" />}
          </div>
        </div>
      )}
      
      <div className={`flex items-start justify-between mb-5 ${isManageable && user.status !== 'INACTIVE' ? 'pl-8' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0 overflow-hidden ring-2 ring-white shadow-sm">
            {user.photoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg">{user.firstName.charAt(0)}{user.lastName.charAt(0)}</span>
            )}
          </div>
          <div className="text-left">
            <div className="font-extrabold text-slate-900 text-[15px] leading-tight mb-1 flex items-center gap-2">
              <span>{user.firstName} {user.lastName}</span>
              {user.status === 'INACTIVE' && (
                <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-rose-100 uppercase tracking-wider">
                  Deactivated
                </span>
              )}
            </div>
            <div className="text-[13px] text-slate-500 font-medium">{user.email}</div>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={onToggleMenu}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          {isMenuOpen && renderMenu()}
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-y-4 gap-x-2 mt-auto bg-slate-50/50 rounded-xl p-3 border border-slate-100/50 ${isManageable && user.status !== 'INACTIVE' ? 'ml-8' : ''}`}>
        <div className="flex flex-col gap-1 text-left">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Role</span>
          <span className="text-sm font-bold text-slate-800">{user.role}</span>
        </div>
        <div className="flex flex-col gap-1 text-left">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Department</span>
          <span className="text-sm font-bold text-slate-800">{user.department}</span>
        </div>
        <div className="flex flex-col gap-1 text-left">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${
              user.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
              user.status === 'INVITED' ? 'bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.4)]' : 
              user.status === 'SUSPENDED' ? 'bg-amber-500' : 'bg-slate-300'
            }`}></span>
            <span className="text-sm font-bold text-slate-800">{STATUS_LABELS[user.status as keyof typeof STATUS_LABELS] || user.status}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-left">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Last Active</span>
          <span className="text-sm font-bold text-slate-800">{user.lastActive}</span>
        </div>
      </div>
    </div>
  );
}
