import React from 'react';
interface RealtimeContextType {
    lastUpdate: Date;
    recentActivities: string[];
    stats: {
        newLeads: number;
        activeOpportunities: number;
        totalPipelineValue: number;
        averageDealSize: number;
        conversionRate: number;
        callsThisWeek: number;
    };
    charts: {
        leads: Array<{
            name: string;
            leads: number;
            qualified: number;
        }>;
        sales: Array<{
            name: string;
            target: number;
            actual: number;
        }>;
        conversion: Array<{
            name: string;
            value: number;
        }>;
    };
}
export declare function RealtimeProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useRealtime(): RealtimeContextType;
export {};
