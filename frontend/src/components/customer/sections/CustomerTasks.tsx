import { type Customer } from '../../../types/customer';

interface Props {
  customer: Customer;
}

export const CustomerTasks = ({ customer }: Props): JSX.Element => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Uppgifter</h2>
      <div className="space-y-4">
        {customer.tasks.map((task) => (
          <div key={task.id} className="border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Tilldelad: {task.assignedTo}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  task.status === 'TODO' ? 'bg-yellow-100 text-yellow-800' :
                  task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.status === 'TODO' ? 'Att göra' :
                   task.status === 'IN_PROGRESS' ? 'Pågående' :
                   'Klar'}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  Förfaller: {task.dueDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
