import { useState } from 'react';
import { Customer } from '../../types/customer';
import { FaSearch } from 'react-icons/fa';

interface CustomerListProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onCustomerSelect: (customer: Customer) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  selectedCustomer,
  onCustomerSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.organizationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contacts.some(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Sök kunder..."
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredCustomers.map(customer => (
          <div
            key={customer.id}
            className={`p-4 cursor-pointer hover:bg-gray-50 ${
              selectedCustomer?.id === customer.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onCustomerSelect(customer)}
          >
            <h3 className="text-sm font-medium text-gray-900">{customer.name}</h3>
            <p className="text-sm text-gray-500">{customer.organizationNumber}</p>
            {customer.contacts.find(c => c.isPrimary) && (
              <p className="text-sm text-gray-500 mt-1">
                {customer.contacts.find(c => c.isPrimary)?.name}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
