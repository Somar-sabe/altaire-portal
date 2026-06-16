/**
 * @file /app/modules/team/hooks/useTeamFilters.ts
 * @purpose Custom hook to handle team member filtering and searching.
 */

import { useState, useMemo } from "react";
import type { Department, Role, UserStatus } from "../types";

export function useTeamFilters(users: any[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<Department | 'All'>('All');
  const [filterRole, setFilterRole] = useState<Role | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'All'>('All');

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchQuery.toLowerCase().trim();
      const searchMatch = !query || 
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query);

      const deptMatch = filterDepartment === 'All' || user.department === filterDepartment;
      const roleMatch = filterRole === 'All' || user.role === filterRole;
      const statusMatch = filterStatus === 'All' || user.status === filterStatus;

      return searchMatch && deptMatch && roleMatch && statusMatch;
    });
  }, [users, searchQuery, filterDepartment, filterRole, filterStatus]);

  const isFilterActive = filterDepartment !== 'All' || filterRole !== 'All' || filterStatus !== 'All';

  return {
    searchQuery,
    setSearchQuery,
    filterDepartment,
    setFilterDepartment,
    filterRole,
    setFilterRole,
    filterStatus,
    setFilterStatus,
    filteredUsers,
    isFilterActive
  };
}
