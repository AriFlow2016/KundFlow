import React, { useState } from 'react';
import { Customer, CustomerType } from '../../../types/customer';
import { FaUser, FaBuilding, FaMapMarkerAlt, FaGlobe, FaPhone, FaEnvelope } from 'react-icons/fa';

interface CustomerBasicInfoProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
}

export const CustomerBasicInfo: React.FC<CustomerBasicInfoProps> = ({ customer, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(customer);

  const fetchCompanyData = async (orgNumber: string) => {
    try {
      // TODO: Implementera API-anrop till företagsdatabas
      const response = await fetch(`/api/company-info/${orgNumber}`);
      const data = await response.json();
      
      setFormData({
        ...formData,
        name: data.name,
        visitingAddress: data.address,
        website: data.website,
      });
    } catch (error) {
      console.error('Fel vid hämtning av företagsdata:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Företagsdata-knapp */}
      {customer.type === 'COMPANY' && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => fetchCompanyData(customer.organizationNumber!)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaBuilding className="mr-2" />
            Hämta företagsdata
          </button>
        </div>
      )}

      {/* Grundläggande information */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Grundläggande information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Företagsnamn/Kundnamn */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Namn</label>
              <div className="mt-1 flex items-center">
                <FaBuilding className="mr-2 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="flex-1 block w-full rounded-md sm:text-sm border-gray-300 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Organisationsnummer/Personnummer */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {customer.type === 'COMPANY' ? 'Organisationsnummer' : 'Personnummer'}
              </label>
              <input
                type="text"
                value={customer.type === 'COMPANY' ? formData.organizationNumber : formData.personalNumber}
                onChange={(e) => setFormData({
                  ...formData,
                  [customer.type === 'COMPANY' ? 'organizationNumber' : 'personalNumber']: e.target.value
                })}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md sm:text-sm border-gray-300 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {/* Webbplats */}
            {customer.type === 'COMPANY' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Webbplats</label>
                <div className="mt-1 flex items-center">
                  <FaGlobe className="mr-2 text-gray-400" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    disabled={!isEditing}
                    className="flex-1 block w-full rounded-md sm:text-sm border-gray-300 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            )}

            {/* Besöksadress */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700">Besöksadress</label>
              <div className="mt-1 flex items-start">
                <FaMapMarkerAlt className="mr-2 mt-2 text-gray-400" />
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={formData.visitingAddress.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      visitingAddress: { ...formData.visitingAddress, street: e.target.value }
                    })}
                    disabled={!isEditing}
                    placeholder="Gatuadress"
                    className="block w-full rounded-md sm:text-sm border-gray-300 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.visitingAddress.postalCode}
                      onChange={(e) => setFormData({
                        ...formData,
                        visitingAddress: { ...formData.visitingAddress, postalCode: e.target.value }
                      })}
                      disabled={!isEditing}
                      placeholder="Postnummer"
                      className="block w-full rounded-md sm:text-sm border-gray-300 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    <input
                      type="text"
                      value={formData.visitingAddress.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        visitingAddress: { ...formData.visitingAddress, city: e.target.value }
                      })}
                      disabled={!isEditing}
                      placeholder="Ort"
                      className="block w-full rounded-md sm:text-sm border-gray-300 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Knappar */}
      <div className="flex justify-end space-x-3">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={() => {
                setFormData(customer);
                setIsEditing(false);
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Spara
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Redigera
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerBasicInfo;
