export interface Opportunity {
  id: string;
  name: string;
  value: number;
  probability: number;
  status: string;
  expectedCloseDate: string;
  customerId: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
