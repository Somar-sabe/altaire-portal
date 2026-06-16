/**
 * @file /app/modules/company/types.ts
 * @description Simplified type definitions for the Company Module containing Company Profile and Department types only.
 * @lastModified 2026-05-31
 */

export interface CompanyProfile {
  name: string;
  registrationNo: string;
  contactEmail: string;
  contactPhone: string;
  baseAddress: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  headOfDepartment?: string;
  employeeCount: number;
  budget?: number;
  employees?: string[];
}
