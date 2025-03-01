import { useState, useEffect } from 'react';
import { Lead } from '../types/lead';
import { LeadService } from '../services/leadService';

export const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const leadService = new LeadService();
      const loadedLeads = await leadService.getLeads();
      setLeads(loadedLeads);
      setError(null);
    } catch (err) {
      setError('Failed to load leads');
      console.error('Error loading leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleLeadUpdate = async (updatedLead: Lead) => {
    try {
      const leadService = new LeadService();
      await leadService.updateLead(updatedLead);
      setLeads(leads.map(l => 
        l.id === updatedLead.id ? updatedLead : l
      ));
      setSelectedLead(updatedLead);
    } catch (err) {
      setError('Failed to update lead');
      console.error('Error updating lead:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="text-red-600 font-medium">{error}</div>
        <button
          onClick={loadLeads}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Försök igen
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Sök leads..."
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {leads.map(lead => (
              <div
                key={lead.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedLead?.id === lead.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleLeadSelect(lead)}
              >
                <h3 className="text-sm font-medium text-gray-900">{lead.name}</h3>
                <p className="text-sm text-gray-500">{lead.company}</p>
                <p className="text-sm text-gray-500">{lead.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-2/3 p-6">
        {selectedLead ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Lead Information</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLead.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLead.company}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLead.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLead.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLead.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLead.notes}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Välj en lead för att se detaljer
          </div>
        )}
      </div>
    </div>
  );
};
