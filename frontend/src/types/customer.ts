export enum CustomerType {
  COMPANY = 'COMPANY',
  PRIVATE = 'PRIVATE'
}

export enum CustomerStatus {
  LEAD = 'LEAD',
  PROSPECT = 'PROSPECT',
  CUSTOMER = 'CUSTOMER',
  INACTIVE = 'INACTIVE'
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: string;
  isPrimary: boolean;
}

export interface Address {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface ContactFormData extends Omit<Contact, 'id'> {
  id?: string;
}

export interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  status: CustomerStatus;
  organizationNumber?: string;
  website?: string;
  visitingAddress?: Address;
  mailingAddress?: Address;
  contacts: Contact[];
  notes?: string;
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
