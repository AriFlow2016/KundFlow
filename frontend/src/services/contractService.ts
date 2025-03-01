import axios from 'axios';
import { Contract } from '../types/contract';

const API_URL = 'http://localhost:3000/api/contracts';

export const contractService = {
  async getCustomerContracts(customerId: string): Promise<Contract[]> {
    const response = await axios.get(`${API_URL}/customer/${customerId}`);
    return response.data;
  },

  async createContract(contract: FormData): Promise<Contract> {
    const response = await axios.post(API_URL, contract, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateContract(id: string, contract: FormData): Promise<Contract> {
    const response = await axios.put(`${API_URL}/${id}`, contract, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteContract(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },

  // För lokala filer behöver vi inte hämta en signerad URL
  getDocumentUrl(url: string): string {
    return url.startsWith('http') ? url : `${axios.defaults.baseURL}${url}`;
  },
};
