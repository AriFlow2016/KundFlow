import { Customer } from '../../../types/customer';
interface CustomerCasesProps {
    customer: Customer;
    onUpdate: (customer: Customer) => void;
}
export default function CustomerCases({ customer, onUpdate }: CustomerCasesProps): import("react/jsx-runtime").JSX.Element;
export {};
