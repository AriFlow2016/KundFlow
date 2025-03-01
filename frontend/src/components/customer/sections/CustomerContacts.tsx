import React, { useState } from 'react';
import { Customer, Contact, ContactFormData } from '../../../types/customer';
import { Dialog } from '@headlessui/react';
import { FaPlus, FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';

interface CustomerContactsProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
}

const emptyContact: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  isPrimary: false
};

export const CustomerContacts: React.FC<CustomerContactsProps> = ({ customer, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>(emptyContact);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newContact: Contact = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData
    };
    
    const updatedCustomer = {
      ...customer,
      contacts: [...customer.contacts, newContact]
    };
    
    onUpdate(updatedCustomer);
    setIsOpen(false);
    setFormData(emptyContact);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Kontakter</h3>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaPlus className="mr-2" />
          Ny kontakt
        </button>
      </div>

      {customer.contacts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customer.contacts.map((contact) => (
            <div
              key={contact.id}
              className="relative rounded-lg border border-gray-200 p-4 hover:border-gray-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {contact.firstName} {contact.lastName}
                    {contact.isPrimary && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Primär
                      </span>
                    )}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">{contact.role}</p>
                </div>
                <div className="ml-4">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <FaEnvelope className="mr-2 h-4 w-4" />
                  <a href={`mailto:${contact.email}`} className="hover:text-gray-900">
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FaPhone className="mr-2 h-4 w-4" />
                  <a href={`tel:${contact.phone}`} className="hover:text-gray-900">
                    {contact.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">Inga kontakter registrerade</p>
      )}

      <Dialog
        open={isOpen}
        onClose={closeModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
              Lägg till ny kontakt
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Förnamn
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Efternamn
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-post
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Roll
                  </label>
                  <input
                    type="text"
                    id="role"
                    value={formData.role || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPrimary"
                    checked={formData.isPrimary}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-700">
                    Primär kontakt
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Spara
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default CustomerContacts;
