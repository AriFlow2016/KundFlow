import React from 'react';
import { Customer } from '../../../types/customer';

interface CustomerTasksProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
}

export default function CustomerTasks({ customer, onUpdate }: CustomerTasksProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Uppgifter</h3>
      <p className="text-gray-500">Uppgiftshantering kommer snart...</p>
    </div>
  );
}
