"use client";

/**
 * @file /app/modules/team/team.module.tsx
 * @purpose Main entry for the Team & Users Module.
 */

import React, { useState, useEffect } from "react";
import TeamList from "./components/TeamList";
import TeamInsights from "./components/TeamInsights";
import UserProfile from "./components/UserProfile";
import { useTeamStore } from "./store";

export default function TeamModule() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const fetchUsers = useTeamStore((s) => s.fetchUsers);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="flex w-full max-w-[1024px] mx-auto gap-6">
      {/* Middle main section */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedUserId ? (
          <UserProfile
            userId={selectedUserId}
            onBack={() => setSelectedUserId(null)}
          />
        ) : (
          <TeamList onSelectUser={setSelectedUserId} />
        )}
      </div>

      {/* Right space for AI insights */}
      <div className="w-[280px] shrink-0 border-l border-slate-200/60 pl-6 hidden lg:block">
        <TeamInsights />
      </div>
    </div>
  );
}
