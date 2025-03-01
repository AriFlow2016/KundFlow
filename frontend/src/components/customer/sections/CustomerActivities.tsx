import React from 'react';
import { Customer } from '../../../types/customer';

interface CustomerActivitiesProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
}

export default function CustomerActivities({ customer, onUpdate }: CustomerActivitiesProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Aktiviteter</h3>
      <p className="text-gray-500">Aktivitetslogg kommer snart...</p>
    </div>
  );
}
