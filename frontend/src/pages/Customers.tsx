import { useState, useEffect, useCallback } from 'react';
import { type Customer } from '../types/customer';
import { CustomerService } from '../services/customerService';
import { CustomerList } from '../components/customer/CustomerList';
import { CustomerDetails } from '../components/customer/CustomerDetails';

export const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      const customerService = new CustomerService();
      const loadedCustomers = await customerService.getCustomers();
      setCustomers(loadedCustomers);
      setError(null);
    } catch (err) {
      setError('Failed to load customers');
      console.error('Error loading customers:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  const handleCustomerSelect = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
  }, []);

  const handleCustomerUpdate = useCallback(async (updatedCustomer: Customer) => {
    try {
      const customerService = new CustomerService();
      await customerService.updateCustomer(updatedCustomer);
      setCustomers(prevCustomers => 
        prevCustomers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c)
      );
      setSelectedCustomer(updatedCustomer);
    } catch (err) {
      setError('Failed to update customer');
      console.error('Error updating customer:', err);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="text-red-600 font-medium">{error}</div>
        <button
          onClick={() => void loadCustomers()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Försök igen
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r">
        <CustomerList
          customers={customers}
          selectedCustomer={selectedCustomer}
          onCustomerSelect={handleCustomerSelect}
        />
      </div>
      <div className="w-2/3 p-6">
        {selectedCustomer ? (
          <CustomerDetails
            customer={selectedCustomer}
            onUpdate={handleCustomerUpdate}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Välj en kund för att se detaljer
          </div>
        )}
      </div>
    </div>
  );
};
