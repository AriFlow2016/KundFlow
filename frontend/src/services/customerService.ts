import { type Customer } from '../types/customer';
import { config } from '../config';

const API_URL = `${config.apiBaseUrl}/api/customers`;

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

const defaultOptions = {
  credentials: 'include' as const,
  headers: defaultHeaders,
};

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    const response = await fetch(API_URL, defaultOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.statusText}`);
    }
    return response.json();
  },

  async getCustomer(id: string): Promise<Customer> {
    const response = await fetch(`${API_URL}/${id}`, defaultOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch customer: ${response.statusText}`);
    }
    return response.json();
  },

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const response = await fetch(API_URL, {
      ...defaultOptions,
      method: 'POST',
      body: JSON.stringify(customer),
    });
    if (!response.ok) {
      throw new Error(`Failed to create customer: ${response.statusText}`);
    }
    return response.json();
  },

  async updateCustomer(customer: Customer): Promise<Customer> {
    const response = await fetch(`${API_URL}/${customer.id}`, {
      ...defaultOptions,
      method: 'PUT',
      body: JSON.stringify(customer),
    });
    if (!response.ok) {
      throw new Error(`Failed to update customer: ${response.statusText}`);
    }
    return response.json();
  },

  async deleteCustomer(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      ...defaultOptions,
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete customer: ${response.statusText}`);
    }
  },
};
