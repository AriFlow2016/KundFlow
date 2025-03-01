import { useState } from 'react';
import { Lead } from '../types';

// Dummy-data för demonstration
const initialLeads: Lead[] = [
  {
    id: 1,
    company: 'Företag AB',
    contactPerson: 'Anna Andersson',
    email: 'anna@foretagab.se',
    phone: '08-123 45 67',
    status: 'new',
    notes: 'Intresserad av våra tjänster',
    createdAt: new Date('2025-01-02'),
  },
  {
    id: 2,
    company: 'Tech Solutions AB',
    contactPerson: 'Erik Eriksson',
    email: 'erik@techsolutions.se',
    phone: '08-987 65 43',
    status: 'contacted',
    notes: 'Uppföljning nästa vecka',
    createdAt: new Date('2025-01-03'),
  },
];

const statusLabels = {
  new: { text: 'Ny', color: 'bg-green-100 text-green-800' },
  contacted: { text: 'Kontaktad', color: 'bg-blue-100 text-blue-800' },
  qualified: { text: 'Kvalificerad', color: 'bg-purple-100 text-purple-800' },
  lost: { text: 'Förlorad', color: 'bg-gray-100 text-gray-800' },
};

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({});

  const handleNewLead = (e: React.FormEvent) => {
    e.preventDefault();
    const lead: Lead = {
      id: leads.length + 1,
      company: newLead.company || '',
      contactPerson: newLead.contactPerson || '',
      email: newLead.email || '',
      phone: newLead.phone || '',
      status: 'new',
      notes: newLead.notes || '',
      createdAt: new Date(),
    };
    setLeads([...leads, lead]);
    setShowNewLeadForm(false);
    setNewLead({});
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <button
              onClick={() => setShowNewLeadForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Ny Lead
            </button>
          </div>

          {showNewLeadForm && (
            <div className="mb-8 bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Lägg till ny lead</h2>
              <form onSubmit={handleNewLead} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Företag</label>
                  <input
                    type="text"
                    value={newLead.company || ''}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kontaktperson</label>
                  <input
                    type="text"
                    value={newLead.contactPerson || ''}
                    onChange={(e) => setNewLead({ ...newLead, contactPerson: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-post</label>
                  <input
                    type="email"
                    value={newLead.email || ''}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <input
                    type="text"
                    value={newLead.phone || ''}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Anteckningar</label>
                  <textarea
                    value={newLead.notes || ''}
                    onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewLeadForm(false)}
                    className="bg-white text-gray-700 px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    Avbryt
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Spara
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Företag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontaktperson
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skapad
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.company}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.contactPerson}</div>
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusLabels[lead.status].color}`}>
                        {statusLabels[lead.status].text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.createdAt.toLocaleDateString('sv-SE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
