
export type Role = 'Admin' | 'Manager' | 'Sales';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  createdAt: string;
}

export type MetalGroup = string;

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Negotiating' | 'Closed' | 'Lost';

export interface HistoryEntry {
  id: string;
  type: 'status_change' | 'ai_update' | 'note';
  content: string;
  user: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  customerName: string;
  dialingCode: string;
  mobile: string;
  email: string;
  metalGroup: MetalGroup;
  productCategory: string;
  description: string;
  budget: string;
  weight: string;
  source: string;
  leadGeneratorId: string; // Linked to User.id
  leadGeneratorName: string;
  status: LeadStatus;
  createdAt: string;
  aiScore?: number;
  aiSummary?: string;
  aiFollowUp?: string;
  history: HistoryEntry[];
}

export type View = 'dashboard' | 'leads' | 'add-lead' | 'analytics' | 'user-mgmt' | 'settings' | 'lead-details';

export interface AppSettings {
  metalGroups: string[];
  productCategories: string[];
  sources: string[];
}
