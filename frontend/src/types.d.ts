export interface Account {
    id: number;
    name: string;
    orgNumber: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    status: 'active' | 'lead' | 'inactive';
    lastContact: string;
}
export interface Contact {
    id: number;
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    mobile: string;
    accountId: number;
    accountName: string;
    status: 'active' | 'inactive';
    lastContact: string;
    notes: string;
    preferredContact: 'email' | 'phone' | 'mobile';
    tags: string[];
}
export interface Opportunity {
    id: number;
    title: string;
    accountId: number;
    accountName: string;
    contactId: number;
    contactName: string;
    value: number;
    probability: number;
    expectedCloseDate: string;
    stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
    status: 'active' | 'inactive';
    priority: 'low' | 'medium' | 'high';
    description: string;
    lastActivity: string;
    nextActivity?: string;
    tags: string[];
    products: Array<{
        id: number;
        name: string;
        quantity: number;
        price: number;
    }>;
}
