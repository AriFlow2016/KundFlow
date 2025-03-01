import { useState, useCallback, useMemo } from 'react';
import { type Customer } from '../../types/customer';
import { FaSearch } from 'react-icons/fa';

interface CustomerListProps {
  customers: readonly Customer[];
  selectedCustomer: Customer | null;
  onCustomerSelect: (customer: Customer) => void;
}

export const CustomerList = ({
  customers,
  selectedCustomer,
  onCustomerSelect,
}: CustomerListProps): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredCustomers = useMemo(() => 
    customers.filter(customer =>
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.organizationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contacts.some(contact =>
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ),
    [customers, searchTerm]
  );

  const getPrimaryContactName = useCallback((customer: Customer): string => {
    const primaryContact = customer.contacts.find(c => c.isPrimary);
    return primaryContact ? `${primaryContact.firstName} ${primaryContact.lastName}` : '';
  }, []);

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
            onChange={handleSearchChange}
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
            <h3 className="text-sm font-medium text-gray-900">{customer.firstName} {customer.lastName}</h3>
            <p className="text-sm text-gray-500">{customer.organizationNumber}</p>
            {customer.contacts.find(c => c.isPrimary) && (
              <p className="text-sm text-gray-500 mt-1">
                {getPrimaryContactName(customer)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
