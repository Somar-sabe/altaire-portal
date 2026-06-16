/**
 * @file /app/modules/leads/types.ts
 * @description Centralized type definitions for the Leads module.
 * @workplan WP-030
 */

export interface LrmLead {
  id: string;
  name: string;
  company: string;
  targetProject: string;
  value: number;
  stage: string;
  email: string;
  phone: string;
  altPhone: string | null;
  workPhone: string | null;
  workEmail: string | null;
  whatsapp: string | null;
  telegram: string | null;
  instagram: string | null;
  facebook: string | null;
  source: string | null;
  status: string;
  tags: string[];
  aiScore: number;
  lastActivityAt: string | null;
  lastActivitySummary: string | null;
  notes: string;
  avatarColor: string;
  lang: string;
  country: string;
  dateCreated: string;
  assignedAgentId: string | null;
  adminInChargeId: string | null;
  assignedById: string | null;
  details: string; // JSON String
  lastInteractionDate: string | null;
}

export interface LeadComment {
  id: string;
  leadId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  isReminder: boolean;
  reminderDate: string | null;
  createdAt: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  actorId: string;
  actorName: string;
  actionType: string;
  details: string;
  createdAt: string;
}
