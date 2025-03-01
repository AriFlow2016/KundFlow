import React, { useState } from 'react';
import { Customer, CustomerType, CustomerStatus, Contact, Address } from '../../../types/customer';
import { Dialog } from '@headlessui/react';
import { FaMapMarkerAlt, FaBuilding, FaGlobe, FaUser, FaStar, FaEnvelope, FaPhone, FaPlus } from 'react-icons/fa';

interface ProspectInfoProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
}

interface ProspectFormData {
  name: string;
  type: CustomerType;
  status: CustomerStatus;
  organizationNumber?: string;
  website?: string;
  visitingAddress: Address;
  mailingAddress: Address;
  contacts: Contact[];
}

const emptyAddress: Address = {
  street: '',
  postalCode: '',
  city: '',
  country: 'Sverige'
};

export const ProspectInfo: React.FC<ProspectInfoProps> = ({ customer, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ProspectFormData>({
    name: customer.name,
    type: customer.type,
    status: customer.status,
    organizationNumber: customer.organizationNumber,
    website: customer.website,
    visitingAddress: customer.visitingAddress || emptyAddress,
    mailingAddress: customer.mailingAddress || emptyAddress,
    contacts: customer.contacts
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedCustomer: Customer = {
      ...customer,
      ...formData,
      updatedAt: new Date().toISOString()
    };

    onUpdate(updatedCustomer);
    setIsOpen(false);
  };

  const renderAddress = (title: string, address: Address) => (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-500">{title}</h4>
      <div className="mt-2 text-sm text-gray-900">
        <p>{address.street}</p>
        <p>{address.postalCode} {address.city}</p>
        <p>{address.country}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Prospekt Information</h3>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaPlus className="mr-2" />
          Redigera
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Namn</h4>
          <p className="mt-2 text-sm text-gray-900">{customer.name}</p>
        </div>

        {customer.type === CustomerType.COMPANY && (
          <>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Organisationsnummer</h4>
              <p className="mt-2 text-sm text-gray-900">{customer.organizationNumber}</p>
            </div>

            {customer.website && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Webbplats</h4>
                <p className="mt-2 text-sm text-gray-900">
                  <a 
                    href={customer.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {customer.website}
                  </a>
                </p>
              </div>
            )}
          </>
        )}

        {customer.visitingAddress && renderAddress("Besöksadress", customer.visitingAddress)}
        {customer.mailingAddress && renderAddress("Postadress", customer.mailingAddress)}
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Redigera prospekt
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Namn
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>

                {formData.type === CustomerType.COMPANY && (
                  <>
                    <div>
                      <label htmlFor="organizationNumber" className="block text-sm font-medium text-gray-700">
                        Organisationsnummer
                      </label>
                      <input
                        type="text"
                        id="organizationNumber"
                        value={formData.organizationNumber || ''}
                        onChange={(e) => setFormData({ ...formData, organizationNumber: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                        Webbplats
                      </label>
                      <input
                        type="url"
                        id="website"
                        value={formData.website || ''}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Besöksadress</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Gatuadress"
                      value={formData.visitingAddress.street}
                      onChange={(e) => setFormData({
                        ...formData,
                        visitingAddress: { ...formData.visitingAddress, street: e.target.value }
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Postnummer"
                        value={formData.visitingAddress.postalCode}
                        onChange={(e) => setFormData({
                          ...formData,
                          visitingAddress: { ...formData.visitingAddress, postalCode: e.target.value }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Ort"
                        value={formData.visitingAddress.city}
                        onChange={(e) => setFormData({
                          ...formData,
                          visitingAddress: { ...formData.visitingAddress, city: e.target.value }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Spara
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ProspectInfo;
