import React, { useState } from 'react';
import { Customer } from '../types/customer';
import CustomerCard from '../components/customer/CustomerCard';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';

// Dummy data för demonstration
const dummyCustomers: Customer[] = [
  {
    id: '1',
    type: 'COMPANY',
    status: 'PROSPECT',
    name: 'Volvo AB',
    organizationNumber: '556012-5790',
    website: 'www.volvo.com',
    visitingAddress: {
      street: 'Gropegårdsgatan 2',
      postalCode: '417 15',
      city: 'Göteborg',
      country: 'Sverige'
    },
    contacts: [
      {
        id: '1',
        name: 'Johan Andersson',
        title: 'Inköpschef',
        email: 'johan.andersson@volvo.com',
        phone: '031-123456',
        role: 'Beslutsfattare',
        isPrimary: true
      }
    ],
    industry: 'Fordonsindustri',
    leadSource: 'Mässa',
    tags: ['Potential kund', 'Stor organisation'],
    contracts: [],
    cases: [],
    activities: [],
    tasks: [],
    newsletter: false,
    marketingConsent: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customFields: {}
  },
  // Lägg till fler dummy-kunder här
];

export default function Prospects() {
  const [customers, setCustomers] = useState<Customer[]>(dummyCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleCustomerUpdate = (updatedCustomer: Customer) => {
    setCustomers(prevCustomers =>
      prevCustomers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c)
    );
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.organizationNumber?.includes(searchTerm) ||
    customer.contacts.some(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Prospekt</h1>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Nytt prospekt
        </button>
      </div>

      {/* Sökfält och filter */}
      <div className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Sök på företag, org.nummer eller kontaktperson..."
              />
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FaFilter className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Lista över prospekt */}
      <div className="grid grid-cols-1 gap-6">
        {filteredCustomers.map(customer => (
          <div
            key={customer.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedCustomer(customer)}
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{customer.name}</h2>
                  <p className="text-sm text-gray-500">{customer.organizationNumber}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                    ${customer.status === 'PROSPECT' ? 'bg-blue-100 text-blue-800' :
                    customer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    customer.status === 'VIP' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'}`}
                >
                  {customer.status}
                </span>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Primär kontakt</h3>
                  {customer.contacts.find(c => c.isPrimary) ? (
                    <div className="mt-1">
                      <p className="text-sm font-medium text-gray-900">
                        {customer.contacts.find(c => c.isPrimary)?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {customer.contacts.find(c => c.isPrimary)?.title}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Ingen primär kontakt</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Adress</h3>
                  <p className="text-sm text-gray-900">{customer.visitingAddress.street}</p>
                  <p className="text-sm text-gray-500">
                    {customer.visitingAddress.postalCode} {customer.visitingAddress.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Kundkort modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setSelectedCustomer(null)} />
            <div className="relative bg-white w-full max-w-4xl rounded-lg shadow-xl">
              <div className="absolute top-0 right-0 p-4">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Stäng</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <CustomerCard
                customer={selectedCustomer}
                onUpdate={(updatedCustomer) => {
                  handleCustomerUpdate(updatedCustomer);
                  setSelectedCustomer(updatedCustomer);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
