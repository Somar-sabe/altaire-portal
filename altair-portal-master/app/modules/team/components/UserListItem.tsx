"use client";
import React from "react";
import { MoreHorizontal, Check } from "lucide-react";
import { STATUS_LABELS } from "../types";

interface UserListItemProps {
  user: any;
  isManageable: boolean;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onClick: () => void;
  onToggleMenu: (e: React.MouseEvent) => void;
  isMenuOpen: boolean;
  renderMenu: () => React.ReactNode;
}

export default function UserListItem({
  user,
  isManageable,
  isSelected,
  onSelect,
  onClick,
  onToggleMenu,
  isMenuOpen,
  renderMenu,
}: UserListItemProps) {
  return (
    <div 
      onClick={onClick}
      className={`group bg-white border-b last:border-b-0 p-3 sm:p-4 transition-all duration-200 cursor-pointer flex items-center gap-4 ${
        user.status === 'INACTIVE' ? 'opacity-75 bg-slate-50/50' : 'hover:bg-slate-50'
      } ${isSelected ? 'bg-blue-50/30' : ''}`}
    >
      {/* Checkbox */}
      <div className="w-5 shrink-0 flex items-center justify-center">
        {isManageable && user.status !== 'INACTIVE' && (
          <div 
            className="z-10"
            onClick={onSelect}
          >
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
              {isSelected && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>
        )}
      </div>

      {/* Avatar & Name/Email */}
      <div className="flex items-center gap-3 w-1/4 min-w-[200px]">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0 overflow-hidden ring-1 ring-slate-200/50 shadow-sm">
          {user.photoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm">{user.firstName.charAt(0)}{user.lastName.charAt(0)}</span>
          )}
        </div>
        <div className="flex flex-col truncate">
          <div className="font-bold text-slate-900 text-sm flex items-center gap-2 truncate">
            <span className="truncate">{user.firstName} {user.lastName}</span>
            {user.status === 'INACTIVE' && (
              <span className="bg-rose-50 text-rose-600 text-[9px] font-black px-1.5 py-0.5 rounded border border-rose-100 uppercase tracking-wider shrink-0">
                Deactivated
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 font-medium truncate">{user.email}</div>
        </div>
      </div>

      {/* Role */}
      <div className="w-1/6 min-w-[120px] hidden sm:flex flex-col">
        <span className="text-[10px] font-bold uppercase text-slate-400">Role</span>
        <span className="text-sm font-semibold text-slate-700 truncate">{user.role}</span>
      </div>

      {/* Department */}
      <div className="w-1/6 min-w-[120px] hidden md:flex flex-col">
        <span className="text-[10px] font-bold uppercase text-slate-400">Department</span>
        <span className="text-sm font-semibold text-slate-700 truncate">{user.department}</span>
      </div>

      {/* Status */}
      <div className="w-1/6 min-w-[100px] hidden lg:flex flex-col">
        <span className="text-[10px] font-bold uppercase text-slate-400">Status</span>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${
            user.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
            user.status === 'INVITED' ? 'bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.4)]' : 
            user.status === 'SUSPENDED' ? 'bg-amber-500' : 'bg-slate-300'
          }`}></span>
          <span className="text-sm font-semibold text-slate-700 truncate">{STATUS_LABELS[user.status as keyof typeof STATUS_LABELS] || user.status}</span>
        </div>
      </div>

      {/* Last Active */}
      <div className="w-1/6 min-w-[100px] hidden xl:flex flex-col">
        <span className="text-[10px] font-bold uppercase text-slate-400">Last Active</span>
        <span className="text-sm font-semibold text-slate-700 truncate">{user.lastActive}</span>
      </div>

      {/* Actions */}
      <div className="ml-auto relative shrink-0">
        <button 
          onClick={onToggleMenu}
          className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200/50 transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-1 z-50">
            {renderMenu()}
          </div>
        )}
      </div>
    </div>
  );
}
