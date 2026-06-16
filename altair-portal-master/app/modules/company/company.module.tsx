"use client";
'use client';

/**
 * @file /app/modules/company/company.module.tsx
 * @description Central coordinator for the simplified enterprise company configurations module.
 * @dependencies react, types, components
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CompanyHeader from './components/CompanyHeader';
import CompanyProfileView from './components/CompanyProfileView';
import CompanyDepartmentsView from './components/CompanyDepartmentsView';
import CompanyDepartmentDetailPage from './components/CompanyDepartmentDetailPage';
import { CompanyProfile, Department } from './types';

export default function CompanyModule() {
  const [profile, setProfile] = useState<CompanyProfile>(() => ({
    name: 'Acme Corporation Ltd',
    registrationNo: 'CR-10294- Riyadh HQ',
    contactEmail: 'hq@acme-enterprise.com',
    contactPhone: '+966 500 000 123',
    baseAddress: 'Olaya District, Riyadh, Kingdom of Saudi Arabia',
  }));

  const [departments, setDepartments] = useState<Department[]>(() => [
    {
      id: 'SLS',
      name: 'Sales & Growth',
      description: 'Responsible for client acquisition, lead conversion, pipeline acceleration, and key accounts.',
      headOfDepartment: 'Khalid Al-Mansour',
      employeeCount: 4,
      budget: 150000,
      employees: ['Ghanem Al-Otaibi', 'Sara Ahmed', 'Noura Al-Shehri', 'Fahad Al-Harbi'],
    },
    {
      id: 'ENG',
      name: 'Software Development',
      description: 'Oversees core technology products, software engineering, architecture, operations, and database systems.',
      headOfDepartment: 'Eng. Omar Radwan',
      employeeCount: 3,
      budget: 280000,
      employees: ['Eng. Omar Radwan', 'Ali Hassan', 'Khaled Sulaiman'],
    },
    {
      id: 'HR',
      name: 'Human Potential (HR)',
      description: 'Focuses on human resource acquisition, retention, talent cultivation, corporate policies, and compliance.',
      headOfDepartment: 'Noura Al-Shehri',
      employeeCount: 2,
      budget: 60000,
      employees: ['Noura Al-Shehri', 'Reem Khalid'],
    },
  ]);

  const [activeDepartmentId, setActiveDepartmentId] = useState<string | null>(null);

  const handleAddDept = (newDept: Omit<Department, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 6).toUpperCase();
    setDepartments([...departments, { ...newDept, id }]);
  };

  const handleEditDept = (id: string, updatedDept: Omit<Department, 'id'>) => {
    setDepartments(departments.map(d => d.id === id ? { ...updatedDept, id } : d));
  };

  const handleUpdateDept = (updated: Department) => {
    setDepartments(departments.map(d => d.id === updated.id ? updated : d));
  };

  const handleDeleteDept = (id: string) => {
    setDepartments(departments.filter(d => d.id !== id));
    if (activeDepartmentId === id) {
      setActiveDepartmentId(null);
    }
  };

  if (activeDepartmentId) {
    const activeDept = departments.find(d => d.id === activeDepartmentId);
    if (activeDept) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="min-h-full flex flex-col px-4 md:px-6 pb-4 md:pb-6 pt-0 text-left relative" 
          id="company-main-pane"
        >
          <CompanyHeader companyName={profile.name} />
          <div className="flex-1 space-y-6">
            <CompanyDepartmentDetailPage
              department={activeDept}
              onBack={() => setActiveDepartmentId(null)}
              onUpdate={handleUpdateDept}
            />
          </div>
        </motion.div>
      );
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-full flex flex-col px-4 md:px-6 pb-4 md:pb-6 pt-0 text-left relative" 
      id="company-main-pane"
    >
      <CompanyHeader companyName={profile.name} />
      
      <div className="flex-1 space-y-6">
        <CompanyProfileView initialProfile={profile} onSave={setProfile} />
        
        <CompanyDepartmentsView 
          departments={departments} 
          onAdd={handleAddDept} 
          onEdit={handleEditDept} 
          onDelete={handleDeleteDept} 
          onNavigateToDepartment={setActiveDepartmentId}
        />
      </div>
    </motion.div>
  );
}
