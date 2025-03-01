import { Customer } from '../../types/customer';
interface CustomerCardProps {
    customer: Customer;
    onUpdate: (customer: Customer) => void;
    onClose?: () => void;
}
export default function CustomerCard({ customer, onUpdate, onClose }: CustomerCardProps): import("react/jsx-runtime").JSX.Element;
export {};
