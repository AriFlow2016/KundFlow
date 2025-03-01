export type CustomerType = 'prospect' | 'customer';
export type CustomerStatus = string;

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  role: string;
  isPrimary: boolean;
}

export interface ContactFormData extends Omit<Contact, 'id'> {
  id?: string;
}

export interface Customer {
  id: string;
  type: CustomerType;
  status: CustomerStatus;
  name: string;
  visitingAddress: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  mailingAddress: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  organizationNumber: string;
  website: string;
  industry: string;
  revenue: number;
  employees: number;
  description: string;
  contacts: Contact[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFormData extends Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'contacts'> {
  id?: string;
  contacts: ContactFormData[];
}

export type OperatorType = 'TELIA' | 'TELE2' | 'TELENOR' | 'TRE' | 'OTHER';
export type ContractType = 'MOBILE' | 'BROADBAND' | 'LANDLINE' | 'OTHER';

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
