import { type Customer } from '../../../types/customer';

interface Props {
  customer: Customer;
}

export const CustomerActivities = ({ customer }: Props): JSX.Element => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Aktiviteter</h2>
      <div className="space-y-4">
        {customer.activities.map((activity) => (
          <div key={activity.id} className="border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                <p className="text-sm text-gray-500">{activity.description}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
