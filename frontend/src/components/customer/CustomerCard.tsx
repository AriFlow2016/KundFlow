import React from 'react';
import { Link } from 'react-router-dom';
import { Customer, CustomerType } from '../../types/customer';
import { FaBuilding, FaUser } from 'react-icons/fa';

interface CustomerCardProps {
  customer: Customer;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
  return (
    <Link to={`/customers/${customer.id}`} className="block">
      <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {customer.type === CustomerType.COMPANY ? (
              <FaBuilding className="h-6 w-6 text-gray-400" />
            ) : (
              <FaUser className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {customer.name}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {customer.type === CustomerType.COMPANY ? customer.organizationNumber : 'Privatperson'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CustomerCard;
