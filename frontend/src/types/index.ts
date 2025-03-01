export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Lead {
  id: number;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  notes: string;
  createdAt: Date;
}

export interface Account {
  id: number;
  name: string;
  orgNumber: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface Contact {
  id: number;
  accountId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile: string;
  role: string;
}

export interface Opportunity {
  id: number;
  accountId: number;
  title: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  closeDate: Date;
  probability: number;
  notes: string;
}
