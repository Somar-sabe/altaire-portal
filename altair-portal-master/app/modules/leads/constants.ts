/**
 * @file /app/modules/leads/constants.ts
 * @purpose Centralized constants for the leads module.
 */

export const SAMPLE_EXCEL_TEMPLATES = [
  {
    name: "Real Estate Project Sales (Sample Excel)",
    headers: ["First Name", "Last Name", "Mobile Number", "Official Email", "Company Name", "Expected Budget", "Investment Project", "WhatsApp Number", "Age", "Governorate"],
    rows: [
      ["Ahmed", "Mansour", "+201011223344", "mansour@acme.com", "Emaar Dev", "450000", "Mivida Tagamoa Compound", "+201011223344", "34", "Cairo"],
      ["Sara", "Selim", "+201288776655", "sara@sell.eg", "BTC Media", "120000", "City Stars Mall", "+201288776655", "29", "Giza"],
      ["Youssef", "Salem", "+201555444333", "youssef@salem.org", "Al-Rowad Real Estate", "950000", "Badya Compound Townhouse", "+201555444333", "42", "Alexandria"]
    ]
  },
  {
    name: "General Prospect Leads (Sample CSV)",
    headers: ["Full Name", "Email Address", "Phone Number", "Target Value", "Company", "Project Details", "WhatsApp"],
    rows: [
      ["Karim Abdelazim", "karim@buildtech.com", "+201002203304", "220000", "BuildTech Contracting", "New Alamein Towers", "+201002203304"],
      ["Nouran El-Hawari", "nouran@hawari.net", "+201119992223", "340000", "Hawari Investment Group", "Badya Compound Zayed", "+201119992223"]
    ]
  }
];

export const STAGE_OPTIONS = ['NEW', 'IN_PROGRESS', 'INTERESTED', 'NOT_INTERESTED', 'BOOKED', 'CONVERTED', 'LOST'];
export const STAGE_LABELS: Record<string, string> = {
  NEW: 'New',
  IN_PROGRESS: 'In Progress',
  INTERESTED: 'Interested',
  NOT_INTERESTED: 'Not Interested',
  BOOKED: 'Booked',
  CONVERTED: 'Converted',
  LOST: 'Lost'
};

export const QUALITY_OPTIONS = ['Hot Qualified', 'Qualified', 'Responsive', 'Low Budget', 'Not Qualified', 'Trash'];
