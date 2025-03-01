import { Customer } from '../types/customer';

export class CustomerService {
  private apiUrl = '/api/customers';

  async getCustomers(): Promise<Customer[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  async getCustomer(id: string): Promise<Customer> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
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
        throw new Error('Failed to create customer');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
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
        throw new Error('Failed to update customer');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }
}
