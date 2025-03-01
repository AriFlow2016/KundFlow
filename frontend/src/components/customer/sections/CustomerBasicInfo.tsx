import React from 'react';
import { Customer, CustomerType } from '../../../types/customer';
import { FaMapMarkerAlt, FaBuilding, FaGlobe } from 'react-icons/fa';

interface CustomerBasicInfoProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
}

export const CustomerBasicInfo: React.FC<CustomerBasicInfoProps> = ({ customer }) => {
  const renderAddress = (title: string, address: { street: string; postalCode: string; city: string; country: string }) => (
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Grundinformation</h3>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Namn</h4>
          <p className="mt-2 text-sm text-gray-900">{customer.name}</p>
        </div>

        {customer.type === CustomerType.COMPANY && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Organisationsnummer</h4>
            <p className="mt-2 text-sm text-gray-900">{customer.organizationNumber}</p>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-gray-500">Typ</h4>
          <p className="mt-2 text-sm text-gray-900">
            <span className="inline-flex items-center">
              {customer.type === CustomerType.COMPANY ? (
                <>
                  <FaBuilding className="mr-1" />
                  Företag
                </>
              ) : (
                <>
                  <FaGlobe className="mr-1" />
                  Privatperson
                </>
              )}
            </span>
          </p>
        </div>

        {customer.type === CustomerType.COMPANY && customer.website && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Webbplats</h4>
            <p className="mt-2 text-sm text-gray-900">
              <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                {customer.website}
              </a>
            </p>
          </div>
        )}

        {customer.type === CustomerType.COMPANY && (
          <>
            {customer.visitingAddress && renderAddress("Besöksadress", customer.visitingAddress)}
            {customer.mailingAddress && renderAddress("Postadress", customer.mailingAddress)}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerBasicInfo;
