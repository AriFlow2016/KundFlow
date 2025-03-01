import React from 'react';
import { Customer } from '../../../types/customer';
interface ProspectInfoProps {
    customer: Customer;
    onUpdate: (customer: Customer) => void;
}
declare const ProspectInfo: React.FC<ProspectInfoProps>;
export default ProspectInfo;
