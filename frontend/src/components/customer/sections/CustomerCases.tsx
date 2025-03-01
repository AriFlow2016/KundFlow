import React from 'react';
import { Customer } from '../../../types/customer';

interface CustomerCasesProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
}

export default function CustomerCases({ customer, onUpdate }: CustomerCasesProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Ärenden</h3>
      <p className="text-gray-500">Ärendehantering kommer snart...</p>
    </div>
  );
}
