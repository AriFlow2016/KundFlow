import { Customer } from '../../../types/customer';
interface CustomerActivitiesProps {
    customer: Customer;
    onUpdate: (customer: Customer) => void;
}
export default function CustomerActivities({ customer, onUpdate }: CustomerActivitiesProps): import("react/jsx-runtime").JSX.Element;
export {};
