import { Customer } from '../../../types/customer';
interface CustomerTasksProps {
    customer: Customer;
    onUpdate: (customer: Customer) => void;
}
export default function CustomerTasks({ customer, onUpdate }: CustomerTasksProps): import("react/jsx-runtime").JSX.Element;
export {};
