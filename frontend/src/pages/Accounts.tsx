import { useState } from 'react';
import { Account } from '../types';
import { FaPhone, FaEnvelope, FaBuilding, FaSort, FaFilter } from 'react-icons/fa';
import { StatCard } from '../components/StatCard';

const initialAccounts: Account[] = [
  {
    id: 1,
    name: 'Företag AB',
    orgNumber: '556123-4567',
    phone: '08-123 45 67',
    email: 'info@foretagab.se',
    address: 'Storgatan 1',
    city: 'Stockholm',
    postalCode: '111 23',
    status: 'active',
    lastContact: '2025-01-02',
  },
  {
    id: 2,
    name: 'Tech Solutions AB',
    orgNumber: '556789-0123',
    phone: '08-987 65 43',
    email: 'info@techsolutions.se',
    address: 'Teknikvägen 2',
    city: 'Göteborg',
    postalCode: '411 03',
    status: 'lead',
    lastContact: '2025-01-01',
  },
];

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [showNewAccountForm, setShowNewAccountForm] = useState(false);
  const [newAccount, setNewAccount] = useState<Partial<Account>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Account>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Statistik för StatCards
  const stats = {
    totalAccounts: accounts.length,
    activeAccounts: accounts.filter(a => a.status === 'active').length,
    newThisMonth: accounts.filter(a => new Date(a.lastContact).getMonth() === new Date().getMonth()).length,
  };

  const handleCall = (phoneNumber: string) => {
    // Implementera Click-to-Call logik här
    console.log('Ringer:', phoneNumber);
  };

  const handleSort = (field: keyof Account) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedAccounts = accounts
    .filter(account => {
      if (filterStatus !== 'all' && account.status !== filterStatus) return false;
      return (
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.orgNumber.includes(searchTerm) ||
        account.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
            <h1 className="text-3xl font-bold text-gray-900">Konton</h1>
            <button
              onClick={() => setShowNewAccountForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaBuilding className="mr-2" />
              Nytt Konto
            </button>
          </div>

          {/* Statistik kort */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Totalt antal konton"
              value={stats.totalAccounts}
              color="primary"
            />
            <StatCard
              title="Aktiva konton"
              value={stats.activeAccounts}
              color="success"
              change="+5%"
              trend="up"
            />
            <StatCard
              title="Nya denna månad"
              value={stats.newThisMonth}
              color="info"
            />
          </div>

          {/* Sök och filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Sök på företagsnamn, org.nummer eller stad..."
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
              <option value="lead">Leads</option>
              <option value="inactive">Inaktiva</option>
            </select>
          </div>
        </div>

        {/* Kontotabell */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Företag
                    <FaSort className="ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontaktuppgifter
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('city')}
                >
                  <div className="flex items-center">
                    Plats
                    <FaSort className="ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Åtgärder
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-blue-600">{account.name}</div>
                        <div className="text-sm text-gray-500">{account.orgNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center">
                      <button 
                        onClick={() => handleCall(account.phone)}
                        className="text-gray-400 hover:text-blue-600 mr-2"
                      >
                        <FaPhone />
                      </button>
                      {account.phone}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <FaEnvelope className="text-gray-400 mr-2" />
                      {account.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{account.city}</div>
                    <div className="text-sm text-gray-500">{account.address}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      account.status === 'active' ? 'bg-green-100 text-green-800' :
                      account.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {account.status}
                    </span>
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

        {/* Formulär för nytt konto */}
        {showNewAccountForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
              <h2 className="text-xl font-semibold mb-4">Lägg till nytt konto</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const account: Account = {
                  id: accounts.length + 1,
                  name: newAccount.name || '',
                  orgNumber: newAccount.orgNumber || '',
                  phone: newAccount.phone || '',
                  email: newAccount.email || '',
                  address: newAccount.address || '',
                  city: newAccount.city || '',
                  postalCode: newAccount.postalCode || '',
                  status: 'lead',
                  lastContact: new Date().toISOString(),
                };
                setAccounts([...accounts, account]);
                setShowNewAccountForm(false);
                setNewAccount({});
              }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Företagsnamn</label>
                  <input
                    type="text"
                    required
                    value={newAccount.name || ''}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organisationsnummer</label>
                  <input
                    type="text"
                    value={newAccount.orgNumber || ''}
                    onChange={(e) => setNewAccount({ ...newAccount, orgNumber: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <input
                    type="text"
                    value={newAccount.phone || ''}
                    onChange={(e) => setNewAccount({ ...newAccount, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-post</label>
                  <input
                    type="email"
                    value={newAccount.email || ''}
                    onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adress</label>
                  <input
                    type="text"
                    value={newAccount.address || ''}
                    onChange={(e) => setNewAccount({ ...newAccount, address: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Postnummer</label>
                  <input
                    type="text"
                    value={newAccount.postalCode || ''}
                    onChange={(e) => setNewAccount({ ...newAccount, postalCode: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stad</label>
                  <input
                    type="text"
                    value={newAccount.city || ''}
                    onChange={(e) => setNewAccount({ ...newAccount, city: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewAccountForm(false)}
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
