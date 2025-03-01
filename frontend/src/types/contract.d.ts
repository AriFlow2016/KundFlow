export interface Contract {
    id: string;
    name: string;
    contractNumber?: string;
    startDate: string;
    endDate: string;
    operator?: string;
    status: 'ACTIVE' | 'TERMINATED' | 'RENEWED' | 'PENDING';
    monthlyCost?: number;
    documentUrl?: string;
    documentName?: string;
    customerId: string;
    createdAt: string;
    updatedAt: string;
}
export interface ContractFormData {
    name: string;
    contractNumber?: string;
    startDate: string;
    endDate: string;
    operator?: string;
    monthlyCost?: number;
    document?: File;
}
