import React, { useState, useMemo } from 'react';
import { Tab } from '@headlessui/react';
import { FaUser, FaFileContract, FaFolder, FaCalendar, FaTasks, FaTimes } from 'react-icons/fa';
import ProspectInfo from './sections/ProspectInfo';
import CustomerContracts from './sections/CustomerContracts';
import CustomerCases from './sections/CustomerCases';
import CustomerActivities from './sections/CustomerActivities';
import CustomerTasks from './sections/CustomerTasks';

interface Customer {
  id: string;
  [key: string]: any;
}

interface CustomerCardProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
  onClose?: () => void;
}

interface TabItem {
  name: string;
  Component: React.ComponentType<{ customer: Customer; onUpdate: (customer: Customer) => void }>;
  icon: React.ComponentType;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onUpdate, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const tabs = useMemo<TabItem[]>(() => [
    { name: 'Prospekt', Component: ProspectInfo, icon: FaUser },
    { name: 'Avtal', Component: CustomerContracts, icon: FaFileContract },
    { name: 'Ärenden', Component: CustomerCases, icon: FaFolder },
    { name: 'Aktiviteter', Component: CustomerActivities, icon: FaCalendar },
    { name: 'Uppgifter', Component: CustomerTasks, icon: FaTasks },
  ], []);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-4/5 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {customer.name || 'Kunddetaljer'}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Stäng"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          )}
        </div>

        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                  ${selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-600'
                  } flex items-center justify-center space-x-2`
                }
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-4">
            {tabs.map(({ name, Component }) => (
              <Tab.Panel
                key={name}
                className="rounded-xl bg-white p-3"
              >
                <Component customer={customer} onUpdate={onUpdate} />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default CustomerCard;
