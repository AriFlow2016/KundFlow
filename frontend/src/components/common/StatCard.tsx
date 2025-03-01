interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
}

export const StatCard = ({ title, value, icon, change, trend }: StatCardProps): JSX.Element => {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    {icon && (
                        <div className="flex-shrink-0">
                            {icon}
                        </div>
                    )}
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                {title}
                            </dt>
                            <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                    {value}
                                </div>
                                {change !== undefined && trend && (
                                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                                        trend === 'up' ? 'text-green-600' :
                                        trend === 'down' ? 'text-red-600' :
                                        'text-gray-500'
                                    }`}>
                                        {change > 0 ? '+' : ''}{change}%
                                    </div>
                                )}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};
