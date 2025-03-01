export type OpportunityStage = 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
export type OpportunityPriority = 'low' | 'medium' | 'high';

export interface Activity {
    readonly id: string;
    readonly type: 'call' | 'email' | 'meeting' | 'note';
    readonly title: string;
    readonly description: string;
    readonly date: string;
    readonly duration?: number;
    readonly createdBy: string;
}

export interface Opportunity {
    readonly id: string;
    readonly title: string;
    readonly accountId: string;
    readonly accountName: string;
    readonly contactId: string;
    readonly contactName: string;
    readonly value: number;
    readonly stage: OpportunityStage;
    readonly priority: OpportunityPriority;
    readonly closeDate: string;
    readonly probability: number;
    readonly tags: readonly string[];
    readonly description: string;
    readonly nextActivity?: Activity;
    readonly createdAt: string;
    readonly updatedAt: string;
}
