import { Customer } from '../../../types/customer';
interface CustomerContactsProps {
    customer: Customer;
    onUpdate: (customer: Customer) => void;
}
export default function CustomerContacts({ customer, onUpdate }: CustomerContactsProps): import("react/jsx-runtime").JSX.Element;
export {};
