import { Contract } from '../types/contract';
export declare const contractService: {
    getCustomerContracts(customerId: string): Promise<Contract[]>;
    createContract(contract: FormData): Promise<Contract>;
    updateContract(id: string, contract: FormData): Promise<Contract>;
    deleteContract(id: string): Promise<void>;
    getDocumentUrl(url: string): string;
};
