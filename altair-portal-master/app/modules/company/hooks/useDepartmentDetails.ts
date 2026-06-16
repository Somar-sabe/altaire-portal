/**
 * @file /app/modules/company/hooks/useDepartmentDetails.ts
 * @purpose Custom hook to handle department member management and state.
 */

import { useState, useEffect } from 'react';
import { Department } from '../types';
import { fetchPaginatedCollection } from '@/lib/paginated-fetch';

export interface User {
  id: string; firstName: string; lastName: string; email: string; role: string;
}

export function useDepartmentDetails(department: Department, onUpdate: (updated: Department) => void) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedHead, setSelectedHead] = useState(department.headOfDepartment || '');
  const [employeeName, setEmployeeName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        // GPT-Codex (G) BEGIN: load department users through cursor pages.
        const data = await fetchPaginatedCollection<User>('/api/team/users');
        setUsers(data);
        // GPT-Codex (G) END: department editor continues to receive a flat user list.
      } catch (err) { console.error('Failed to load workspace users', err); }
    }
    loadUsers();
  }, []);

  const changeHead = (name: string) => {
    setSelectedHead(name);
    onUpdate({ ...department, headOfDepartment: name });
  };

  const addEmployee = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = employeeName.trim();
    if (!name) return;
    const currentList = department.employees || [];
    if (!currentList.includes(name)) {
      const newList = [...currentList, name];
      onUpdate({ ...department, employees: newList, employeeCount: newList.length });
    }
    setEmployeeName(''); setIsAdding(false);
  };

  const removeEmployee = (name: string) => {
    const newList = (department.employees || []).filter(item => item !== name);
    onUpdate({ ...department, employees: newList, employeeCount: newList.length });
  };

  return {
    users, selectedHead, setSelectedHead, employeeName, setEmployeeName, isAdding, setIsAdding,
    changeHead, addEmployee, removeEmployee
  };
}
