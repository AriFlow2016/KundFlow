import { useState } from 'react';
import { Customer } from '../../types/customer';
import { ProspectInfo } from './sections/ProspectInfo';
import { CustomerContracts } from './sections/CustomerContracts';
import { CustomerCases } from './sections/CustomerCases';
import { CustomerActivities } from './sections/CustomerActivities';

interface CustomerDetailsProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customer,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState('info');

  const tabs = [
    { id: 'info', name: 'Grundinformation' },
    { id: 'contracts', name: 'Avtal' },
    { id: 'cases', name: 'Ärenden' },
    { id: 'activities', name: 'Aktiviteter' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'info' && (
          <ProspectInfo customer={customer} onUpdate={onUpdate} />
        )}
        {activeTab === 'contracts' && (
          <CustomerContracts customer={customer} onUpdate={onUpdate} />
        )}
        {activeTab === 'cases' && (
          <CustomerCases customer={customer} onUpdate={onUpdate} />
        )}
        {activeTab === 'activities' && (
          <CustomerActivities customer={customer} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
};
