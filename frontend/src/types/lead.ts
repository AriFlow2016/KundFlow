export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  source: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFormData extends Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}
