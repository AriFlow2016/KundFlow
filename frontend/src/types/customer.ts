export type CustomerType = 'COMPANY' | 'INDIVIDUAL' | 'PARTNER';
export type CustomerStatus = 'PROSPECT' | 'ACTIVE' | 'VIP' | 'INACTIVE';
export type OperatorType = 'TELIA' | 'TELE2' | 'TELENOR' | 'TRE' | 'OTHER';
export type ContractType = 'MOBILE' | 'BROADBAND' | 'LANDLINE' | 'OTHER';

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  role: string;
  isPrimary: boolean;
}

export interface Contract {
  id: string;
  operator: OperatorType;
  type: ContractType;
  monthlyCost: number;
  startDate: string;
  endDate: string;
  documentUrl?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'CLOSED' | 'IN_PROGRESS';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  closedAt?: string;
  solution?: string;
}

export interface Activity {
  id: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE';
  title: string;
  description: string;
  date: string;
  duration?: number; // i minuter
  createdBy: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Customer {
  id: string;
  type: CustomerType;
  status: CustomerStatus;
  
  // Grundläggande info
  name: string;
  organizationNumber?: string;
  personalNumber?: string;
  website?: string;
  
  // Adresser
  visitingAddress: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  
  // Klassificering
  industry?: string;
  leadSource?: string;
  segment?: string;
  tags: string[];
  
  // Relationer
  contacts: Contact[];
  contracts: Contract[];
  cases: Case[];
  activities: Activity[];
  tasks: Task[];
  
  // Marknadsföring
  newsletter: boolean;
  marketingConsent: boolean;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  customFields: Record<string, any>;
}
