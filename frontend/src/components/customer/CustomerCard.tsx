import React from 'react';
import { Customer } from '../../types/customer';
import CustomerBasicInfo from './sections/CustomerBasicInfo';
import CustomerContacts from './sections/CustomerContacts';
import { CustomerContracts } from './sections/CustomerContracts';
import CustomerCases from './sections/CustomerCases';
import CustomerActivities from './sections/CustomerActivities';
import CustomerTasks from './sections/CustomerTasks';

interface CustomerCardProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
  onClose?: () => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onUpdate, onClose }) => {
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

        <div className="space-y-6">
          <CustomerBasicInfo customer={customer} onUpdate={onUpdate} />
          <CustomerContacts customer={customer} onUpdate={onUpdate} />
          <CustomerContracts customer={customer} />
          <CustomerCases customer={customer} />
          <CustomerActivities customer={customer} />
          <CustomerTasks customer={customer} />
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
