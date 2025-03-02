import { type Customer } from '../types/customer';
import { config } from '../config';

export class CustomerService {
  private readonly apiUrl = `${config.apiBaseUrl}/api/customers`;

  async getCustomers(): Promise<Customer[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.statusText}`);
      }
      return await response.json() as Customer[];
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  async getCustomer(id: string): Promise<Customer> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch customer: ${response.statusText}`);
      }
      return await response.json() as Customer;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      });
      if (!response.ok) {
        throw new Error(`Failed to create customer: ${response.statusText}`);
      }
      return await response.json() as Customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  async updateCustomer(customer: Customer): Promise<Customer> {
    try {
      const response = await fetch(`${this.apiUrl}/${customer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      });
      if (!response.ok) {
        throw new Error(`Failed to update customer: ${response.statusText}`);
      }
      return await response.json() as Customer;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete customer: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }
}
