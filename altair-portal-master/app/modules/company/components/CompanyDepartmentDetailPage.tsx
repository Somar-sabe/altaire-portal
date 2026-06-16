/**
 * @file /app/modules/company/components/CompanyDepartmentDetailPage.tsx
 * @purpose Simplified departmental detail view for managing team roster and assigning the head.
 */
'use client';

import React from 'react';
import { Department } from '../types';

// Sub-components
import DeptDetailHeader from './DeptDetailHeader';
import DeptHeadAssignment from './DeptHeadAssignment';
import DeptEmployeeList from './DeptEmployeeList';

// Hooks
import { useDepartmentDetails } from '../hooks/useDepartmentDetails';

interface DepartmentDetailProps {
  department: Department;
  onBack: () => void;
  onUpdate: (updated: Department) => void;
}

export default function CompanyDepartmentDetailPage({ department, onBack, onUpdate }: DepartmentDetailProps) {
  const {
    users, selectedHead, employeeName, setEmployeeName, isAdding, setIsAdding,
    changeHead, addEmployee, removeEmployee
  } = useDepartmentDetails(department, onUpdate);

  return (
    <div className="space-y-5 animate-fade-in text-left" id="department-detail-page">
      <DeptDetailHeader department={department} onBack={onBack} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <DeptHeadAssignment selectedHead={selectedHead} onHeadChange={changeHead} users={users} />
        <DeptEmployeeList employees={department.employees || []} isAdding={isAdding} setIsAdding={setIsAdding} employeeName={employeeName} setEmployeeName={setEmployeeName} onAdd={addEmployee} onRemove={removeEmployee} users={users} />
      </div>
    </div>
  );
}
