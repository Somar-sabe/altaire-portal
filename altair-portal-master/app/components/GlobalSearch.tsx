'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useTeamStore } from '@/app/modules/team/store';

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const users = useTeamStore((s) => s.users);

  const globalSearchResults = React.useMemo(() => {
    if (!searchQuery.trim() || !users) return [];
    const query = searchQuery.toLowerCase().trim();
    return users.filter(u => 
      u.firstName.toLowerCase().includes(query) ||
      u.lastName.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.department.toLowerCase().includes(query)
    ).slice(0, 5); // top 5
  }, [searchQuery, users]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative hidden md:block max-w-md w-full" ref={searchRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
      <input 
        type="text" 
        placeholder="Search people, departments, updates..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-transparent rounded-[10px] text-xs font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-slate-200 transition-all placeholder:text-slate-400"
      />

      {/* Search Dropdown Results */}
      {isSearchFocused && searchQuery.trim().length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-[10px] shadow-xl overflow-hidden py-2 z-50 animate-fade-in">
          <div className="px-3 pb-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Results
          </div>
          {globalSearchResults.length > 0 ? (
            globalSearchResults.map(result => (
              <button 
                key={result.id}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchFocused(false);
                  // In a real app, this would route to their profile
                }}
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0 overflow-hidden">
                  {result.photoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={result.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <>{result.firstName.charAt(0)}{result.lastName.charAt(0)}</>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{result.firstName} {result.lastName}</div>
                  <div className="text-xs text-slate-500">{result.department} &middot; {result.email}</div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-center text-xs text-slate-500 font-medium">
              No users found matching "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
