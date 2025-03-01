export type CustomerType = 'COMPANY' | 'INDIVIDUAL' | 'PARTNER';
export type CustomerStatus = 'PROSPECT' | 'ACTIVE' | 'VIP' | 'INACTIVE';
export type OperatorType = 'TELIA' | 'TELE2' | 'TELENOR' | 'TRE' | 'OTHER';
export type ContractType = 'MOBILE' | 'BROADBAND' | 'LANDLINE' | 'OTHER';

export interface Contact {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly title: string;
    readonly email: string;
    readonly phone: string;
    readonly role: string;
    readonly isPrimary: boolean;
}

export interface Contract {
    readonly id: string;
    readonly operator: OperatorType;
    readonly type: ContractType;
    readonly monthlyCost: number;
    readonly startDate: string;
    readonly endDate: string;
    readonly documentUrl?: string;
    readonly status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
}

export interface Case {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly status: 'OPEN' | 'CLOSED' | 'IN_PROGRESS';
    readonly priority: 'LOW' | 'MEDIUM' | 'HIGH';
    readonly createdAt: string;
    readonly closedAt?: string;
    readonly solution?: string;
}

export interface Activity {
    readonly id: string;
    readonly type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE';
    readonly title: string;
    readonly description: string;
    readonly date: string;
    readonly duration?: number;
    readonly createdBy: string;
}

export interface Task {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly dueDate: string;
    readonly assignedTo: string;
    readonly status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    readonly priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Address {
    readonly street: string;
    readonly postalCode: string;
    readonly city: string;
    readonly country: string;
}

export interface Customer {
    readonly id: string;
    readonly type: CustomerType;
    readonly status: CustomerStatus;
    readonly name: string;
    readonly organizationNumber?: string;
    readonly personalNumber?: string;
    readonly website?: string;
    readonly visitingAddress: Address;
    readonly billingAddress?: Address;
    readonly industry?: string;
    readonly leadSource?: string;
    readonly segment?: string;
    readonly tags: readonly string[];
    readonly contacts: readonly Contact[];
    readonly contracts: readonly Contract[];
    readonly cases: readonly Case[];
    readonly activities: readonly Activity[];
    readonly tasks: readonly Task[];
    readonly newsletter: boolean;
    readonly marketingConsent: boolean;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly customFields: Record<string, unknown>;
}

export interface CustomerFormData extends Omit<Customer, 'id' | 'createdAt' | 'updatedAt'> {
    readonly id?: string;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}
