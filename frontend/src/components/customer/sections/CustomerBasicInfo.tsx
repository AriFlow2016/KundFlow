import { type Customer } from '../../../types/customer';

interface Props {
  customer: Customer;
  onUpdate: (customer: Customer) => Promise<void>;
}

export const CustomerBasicInfo = ({ customer, onUpdate }: Props): JSX.Element => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Kundinformation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Företagsuppgifter</h3>
          <dl className="mt-2 space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Namn</dt>
              <dd className="text-sm text-gray-900">{customer.name}</dd>
            </div>
            {customer.organizationNumber && (
              <div>
                <dt className="text-sm text-gray-500">Organisationsnummer</dt>
                <dd className="text-sm text-gray-900">{customer.organizationNumber}</dd>
              </div>
            )}
            {customer.website && (
              <div>
                <dt className="text-sm text-gray-500">Webbplats</dt>
                <dd className="text-sm text-gray-900">
                  <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                    {customer.website}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Adress</h3>
          <dl className="mt-2 space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Gatuadress</dt>
              <dd className="text-sm text-gray-900">{customer.visitingAddress.street}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Postnummer</dt>
              <dd className="text-sm text-gray-900">{customer.visitingAddress.postalCode}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Ort</dt>
              <dd className="text-sm text-gray-900">{customer.visitingAddress.city}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Land</dt>
              <dd className="text-sm text-gray-900">{customer.visitingAddress.country}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700">Ytterligare information</h3>
        <dl className="mt-2 space-y-2">
          {customer.industry && (
            <div>
              <dt className="text-sm text-gray-500">Bransch</dt>
              <dd className="text-sm text-gray-900">{customer.industry}</dd>
            </div>
          )}
          {customer.segment && (
            <div>
              <dt className="text-sm text-gray-500">Segment</dt>
              <dd className="text-sm text-gray-900">{customer.segment}</dd>
            </div>
          )}
          {customer.tags.length > 0 && (
            <div>
              <dt className="text-sm text-gray-500">Taggar</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {customer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};
