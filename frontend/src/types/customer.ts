export const enum CustomerType {
  COMPANY = 'COMPANY',
  PRIVATE = 'PRIVATE'
}

export const enum CustomerStatus {
  LEAD = 'LEAD',
  PROSPECT = 'PROSPECT',
  CUSTOMER = 'CUSTOMER',
  INACTIVE = 'INACTIVE'
}

export interface Contact {
  readonly id: string;
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

export type ContactFormData = Omit<Contact, 'id'> & {
  id?: string;
};

export interface Customer {
  readonly id: string;
  name: string;
  type: CustomerType;
  status: CustomerStatus;
  organizationNumber?: string;
  website?: string;
  visitingAddress?: Address;
  mailingAddress?: Address;
  contacts: readonly Contact[];
  notes?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type CustomerFormData = Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'contacts'> & {
  id?: string;
  contacts: ContactFormData[];
};

export const enum OperatorType {
  TELIA = 'TELIA',
  TELE2 = 'TELE2',
  TELENOR = 'TELENOR',
  TRE = 'TRE',
  OTHER = 'OTHER'
}

export const enum ContractType {
  MOBILE = 'MOBILE',
  BROADBAND = 'BROADBAND',
  LANDLINE = 'LANDLINE',
  OTHER = 'OTHER'
}

export const enum ContractStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING'
}

export interface Contract {
  readonly id: string;
  operator: OperatorType;
  type: ContractType;
  monthlyCost: number;
  startDate: string;
  endDate: string;
  documentUrl?: string;
  status: ContractStatus;
}

export const enum CaseStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  IN_PROGRESS = 'IN_PROGRESS'
}

export const enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Case {
  readonly id: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: Priority;
  readonly createdAt: string;
  closedAt?: string;
  solution?: string;
}

export const enum ActivityType {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
  NOTE = 'NOTE'
}

export interface Activity {
  readonly id: string;
  type: ActivityType;
  title: string;
  description: string;
  date: string;
  duration?: number; // i minuter
  readonly createdBy: string;
}

export const enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface Task {
  readonly id: string;
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
  status: TaskStatus;
  priority: Priority;
}
