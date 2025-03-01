import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down';
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  trend,
  color = 'primary' 
}) => {
  const colorClasses = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-indigo-100 text-indigo-800'
  };

  return (
    <div className={`p-6 rounded-lg shadow-sm ${colorClasses[color]} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {change && (
            <div className={`mt-2 inline-flex items-center text-sm font-medium ${
              trend === 'up' ? 'text-green-800' : 'text-red-800'
            }`}>
              <span className="mr-1">{trend === 'up' ? '↑' : '↓'}</span>
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div className="text-2xl opacity-75">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
