export interface OpportunityProduct {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Opportunity {
  id: string;
  title: string;
  accountId: string;
  accountName: string;
  contactId: string;
  contactName: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  status: 'active' | 'inactive';
  priority: 'low' | 'medium' | 'high';
  description: string;
  lastActivity: string;
  nextActivity: string;
  tags: string[];
  products: OpportunityProduct[];
}

export type OpportunityStage = Opportunity['stage'];
export type OpportunityPriority = Opportunity['priority'];
export type OpportunityStatus = Opportunity['status'];
