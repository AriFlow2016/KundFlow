import { Customer } from '../../../types/customer';
interface CustomerBasicInfoProps {
    customer: Customer;
    onUpdate: (customer: Customer) => void;
}
export default function CustomerBasicInfo({ customer, onUpdate }: CustomerBasicInfoProps): import("react/jsx-runtime").JSX.Element;
export {};
