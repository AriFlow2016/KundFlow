import { Customer } from '../../../types/customer';

interface CustomerActivitiesProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
}

const CustomerActivities = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Aktiviteter</h3>
      <p className="text-gray-500">Kommer snart...</p>
    </div>
  );
};

export default CustomerActivities;
