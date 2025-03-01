import { useState } from 'react';
import { Contact } from '../types';
import { FaPhone, FaMobile, FaEnvelope, FaUserPlus, FaSort, FaFilter, FaTag } from 'react-icons/fa';
import { StatCard } from '../components/StatCard';

const initialContacts: Contact[] = [
  {
    id: 1,
    firstName: 'Johan',
    lastName: 'Andersson',
    title: 'VD',
    email: 'johan.andersson@foretagab.se',
    phone: '08-123 45 67',
    mobile: '070-123 45 67',
    accountId: 1,
    accountName: 'Företag AB',
    status: 'active',
    lastContact: '2025-01-02',
    notes: 'Föredrar kontakt via telefon på förmiddagar',
    preferredContact: 'phone',
    tags: ['VIP', 'Beslutsfattare']
  },
  {
    id: 2,
    firstName: 'Maria',
    lastName: 'Svensson',
    title: 'Inköpschef',
    email: 'maria.svensson@techsolutions.se',
    phone: '08-987 65 43',
    mobile: '070-987 65 43',
    accountId: 2,
    accountName: 'Tech Solutions AB',
    status: 'active',
    lastContact: '2025-01-01',
    notes: 'Arbetar mest remote, föredrar mail',
    preferredContact: 'email',
    tags: ['Inköp', 'Tech']
  }
];

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [showNewContactForm, setShowNewContactForm] = useState(false);
  const [newContact, setNewContact] = useState<Partial<Contact>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Contact>('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Statistik för StatCards
  const stats = {
    totalContacts: contacts.length,
    activeContacts: contacts.filter(c => c.status === 'active').length,
    newThisMonth: contacts.filter(c => new Date(c.lastContact).getMonth() === new Date().getMonth()).length,
  };

  // Samla alla unika taggar
  const allTags = Array.from(new Set(contacts.flatMap(contact => contact.tags)));

  const handleCall = (type: 'phone' | 'mobile', number: string) => {
    // Implementera Click-to-Call logik här
    console.log(`Ringer ${type}:`, number);
  };

  const handleSort = (field: keyof Contact) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredAndSortedContacts = contacts
    .filter(contact => {
      if (filterStatus !== 'all' && contact.status !== filterStatus) return false;
      if (selectedTags.length > 0 && !selectedTags.some(tag => contact.tags.includes(tag))) return false;
      
      const searchFields = [
        contact.firstName,
        contact.lastName,
        contact.email,
        contact.accountName,
        contact.title
      ].map(field => field.toLowerCase());
      
      return searchFields.some(field => field.includes(searchTerm.toLowerCase()));
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      return aValue < bValue ? -direction : direction;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Kontakter</h1>
            <button
              onClick={() => setShowNewContactForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaUserPlus className="mr-2" />
              Ny Kontakt
            </button>
          </div>

          {/* Statistik kort */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Totalt antal kontakter"
              value={stats.totalContacts}
              color="primary"
            />
            <StatCard
              title="Aktiva kontakter"
              value={stats.activeContacts}
              color="success"
              change="+3%"
              trend="up"
            />
            <StatCard
              title="Nya denna månad"
              value={stats.newThisMonth}
              color="info"
            />
          </div>

          {/* Sök, filter och taggar */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Sök på namn, företag, titel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <FaFilter className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Alla status</option>
                <option value="active">Aktiva</option>
                <option value="inactive">Inaktiva</option>
              </select>
            </div>

            {/* Taggar */}
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  } hover:bg-blue-200`}
                >
                  <FaTag className="mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Kontakttabell */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastName')}
                >
                  <div className="flex items-center">
                    Namn
                    <FaSort className="ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontaktuppgifter
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('accountName')}
                >
                  <div className="flex items-center">
                    Företag
                    <FaSort className="ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Taggar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Åtgärder
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-blue-600">
                          {contact.firstName} {contact.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{contact.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-900 flex items-center">
                        <button 
                          onClick={() => handleCall('phone', contact.phone)}
                          className="text-gray-400 hover:text-blue-600 mr-2"
                          title="Ring kontor"
                        >
                          <FaPhone />
                        </button>
                        {contact.phone}
                      </div>
                      <div className="text-sm text-gray-900 flex items-center">
                        <button 
                          onClick={() => handleCall('mobile', contact.mobile)}
                          className="text-gray-400 hover:text-blue-600 mr-2"
                          title="Ring mobil"
                        >
                          <FaMobile />
                        </button>
                        {contact.mobile}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaEnvelope className="text-gray-400 mr-2" />
                        {contact.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{contact.accountName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        contact.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {contact.status}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map(tag => (
                          <span 
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Redigera</button>
                    <button className="text-blue-600 hover:text-blue-900">Visa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal för ny kontakt */}
        {showNewContactForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
              <h2 className="text-xl font-semibold mb-4">Lägg till ny kontakt</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const contact: Contact = {
                  id: contacts.length + 1,
                  firstName: newContact.firstName || '',
                  lastName: newContact.lastName || '',
                  title: newContact.title || '',
                  email: newContact.email || '',
                  phone: newContact.phone || '',
                  mobile: newContact.mobile || '',
                  accountId: newContact.accountId || 0,
                  accountName: newContact.accountName || '',
                  status: 'active',
                  lastContact: new Date().toISOString(),
                  notes: newContact.notes || '',
                  preferredContact: newContact.preferredContact || 'email',
                  tags: newContact.tags || []
                };
                setContacts([...contacts, contact]);
                setShowNewContactForm(false);
                setNewContact({});
              }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Förnamn</label>
                  <input
                    type="text"
                    required
                    value={newContact.firstName || ''}
                    onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Efternamn</label>
                  <input
                    type="text"
                    required
                    value={newContact.lastName || ''}
                    onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Titel</label>
                  <input
                    type="text"
                    value={newContact.title || ''}
                    onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-post</label>
                  <input
                    type="email"
                    required
                    value={newContact.email || ''}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <input
                    type="text"
                    value={newContact.phone || ''}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobil</label>
                  <input
                    type="text"
                    value={newContact.mobile || ''}
                    onChange={(e) => setNewContact({ ...newContact, mobile: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Företag</label>
                  <input
                    type="text"
                    value={newContact.accountName || ''}
                    onChange={(e) => setNewContact({ ...newContact, accountName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Noteringar</label>
                  <textarea
                    value={newContact.notes || ''}
                    onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewContactForm(false)}
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
          </div>
        )}
      </div>
    </div>
  );
}
