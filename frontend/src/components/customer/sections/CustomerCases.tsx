import { type Customer } from '../../../types/customer';

interface Props {
  customer: Customer;
}

export const CustomerCases = ({ customer }: Props): JSX.Element => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Ärenden</h2>
      <div className="space-y-4">
        {customer.cases.map((case_) => (
          <div key={case_.id} className="border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{case_.title}</h3>
                <p className="text-sm text-gray-500">{case_.description}</p>
                {case_.solution && (
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>Lösning:</strong> {case_.solution}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  case_.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' :
                  case_.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {case_.status === 'OPEN' ? 'Öppet' :
                   case_.status === 'IN_PROGRESS' ? 'Pågående' :
                   'Avslutat'}
                </span>
                <span className="text-sm text-gray-500 mt-1">{case_.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
