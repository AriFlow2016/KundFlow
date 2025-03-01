import React from 'react';
import { Customer } from '../../../types/customer';
interface CustomerContractsProps {
    customer: Customer;
    onUpdate: (customer: Customer) => void;
}
declare const CustomerContracts: React.FC<CustomerContractsProps>;
export default CustomerContracts;
