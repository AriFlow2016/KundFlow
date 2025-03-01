import { Lead } from '../types/lead';

export class LeadService {
  private apiUrl = '/api/leads';

  async getLeads(): Promise<Lead[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  }

  async getLead(id: string): Promise<Lead> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lead');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching lead:', error);
      throw error;
    }
  }

  async createLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      });
      if (!response.ok) {
        throw new Error('Failed to create lead');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  }

  async updateLead(lead: Lead): Promise<Lead> {
    try {
      const response = await fetch(`${this.apiUrl}/${lead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      });
      if (!response.ok) {
        throw new Error('Failed to update lead');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  }

  async deleteLead(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  }
}
