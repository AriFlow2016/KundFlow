import React from 'react';
import { Customer } from '../../types/customer';
import ProspectInfo from './sections/ProspectInfo';
import CustomerBasicInfo from './sections/CustomerBasicInfo';
import CustomerCases from './sections/CustomerCases';
import CustomerActivities from './sections/CustomerActivities';
import CustomerTasks from './sections/CustomerTasks';
import CustomerContacts from './sections/CustomerContacts';
import { CustomerContracts } from './sections/CustomerContracts';

interface CustomerDetailsProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer, onUpdate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {customer.status === 'PROSPECT' ? (
          <ProspectInfo customer={customer} onUpdate={onUpdate} />
        ) : (
          <CustomerBasicInfo customer={customer} onUpdate={onUpdate} />
        )}
        <CustomerContacts customer={customer} onUpdate={onUpdate} />
        <CustomerContracts customer={customer} />
        <CustomerCases customer={customer} onUpdate={onUpdate} />
        <CustomerActivities customer={customer} onUpdate={onUpdate} />
        <CustomerTasks customer={customer} onUpdate={onUpdate} />
      </div>
    </div>
  );
};

export default CustomerDetails;
