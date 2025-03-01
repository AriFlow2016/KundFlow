import React from 'react';
interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    change?: string;
    trend?: 'up' | 'down';
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}
export declare const StatCard: React.FC<StatCardProps>;
export {};
