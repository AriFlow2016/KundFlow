import { useState, useCallback } from 'react';
import { FaCalendarAlt, FaClock, FaChartLine, FaFilter, FaSort, FaTag, FaBuilding, FaUser } from 'react-icons/fa';
import type { Opportunity, OpportunityStage, OpportunityPriority } from '../types/opportunity';
import { StatCard } from '../components/common/StatCard';

type SortableFields = keyof Pick<Opportunity, 
  'title' | 
  'accountName' | 
  'contactName' | 
  'value' | 
  'probability' | 
  'expectedCloseDate' | 
  'stage' | 
  'priority'
>;

const initialOpportunities: readonly Opportunity[] = [
  {
    id: '1',
    title: 'Ny CRM-implementation',
    accountId: '1',
    accountName: 'Företag AB',
    contactId: '1',
    contactName: 'Johan Andersson',
    value: 250000,
    probability: 75,
    expectedCloseDate: '2025-03-15',
    stage: 'proposal',
    status: 'active',
    priority: 'high',
    description: 'Implementation av nytt CRM-system med integration mot befintliga system',
    lastActivity: '2025-01-02',
    nextActivity: '2025-01-10',
    tags: ['CRM', 'Integration', 'Prioriterat'],
    products: [
      { id: 1, name: 'CRM Licenser', quantity: 50, price: 1000 },
      { id: 2, name: 'Implementation', quantity: 1, price: 200000 }
    ]
  },
  {
    id: '2',
    title: 'Uppgradering av IT-infrastruktur',
    accountId: '2',
    accountName: 'Tech Solutions AB',
    contactId: '2',
    contactName: 'Maria Svensson',
    value: 150000,
    probability: 50,
    expectedCloseDate: '2025-02-28',
    stage: 'qualification',
    status: 'active',
    priority: 'medium',
    description: 'Modernisering av serverpark och nätverk',
    lastActivity: '2025-01-01',
    nextActivity: '2025-01-05',
    tags: ['IT', 'Infrastruktur'],
    products: [
      { id: 3, name: 'Servrar', quantity: 3, price: 30000 },
      { id: 4, name: 'Nätverksutrustning', quantity: 1, price: 60000 }
    ]
  }
];

const stageNames: Record<OpportunityStage, string> = {
  prospecting: 'Prospektering',
  qualification: 'Kvalificering',
  proposal: 'Offert',
  negotiation: 'Förhandling',
  closed_won: 'Vunnen',
  closed_lost: 'Förlorad'
} as const;

const priorityColors: Record<OpportunityPriority, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
} as const;

export const Opportunities = (): JSX.Element => {
  const [opportunities, setOpportunities] = useState<readonly Opportunity[]>(initialOpportunities);
  const [showNewOpportunityForm, setShowNewOpportunityForm] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState<Partial<Opportunity>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortableFields>('expectedCloseDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStage, setFilterStage] = useState<OpportunityStage | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<OpportunityPriority | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<readonly string[]>([]);

  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(value);
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleDateString('sv-SE');
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent): void => {
    e.preventDefault();
    const newId = String(opportunities.length + 1);
    const opportunity: Opportunity = {
      id: newId,
      title: newOpportunity.title || '',
      accountId: newOpportunity.accountId || '',
      accountName: newOpportunity.accountName || '',
      contactId: newOpportunity.contactId || '',
      contactName: newOpportunity.contactName || '',
      value: newOpportunity.value || 0,
      probability: newOpportunity.probability || 0,
      expectedCloseDate: newOpportunity.expectedCloseDate || new Date().toISOString().split('T')[0],
      stage: newOpportunity.stage || 'prospecting',
      status: 'active',
      priority: newOpportunity.priority || 'medium',
      description: newOpportunity.description || '',
      lastActivity: new Date().toISOString().split('T')[0],
      nextActivity: newOpportunity.nextActivity || '',
      tags: newOpportunity.tags || [],
      products: newOpportunity.products || []
    };
    setOpportunities(prev => [...prev, opportunity]);
    setNewOpportunity({});
    setShowNewOpportunityForm(false);
  }, [newOpportunity, opportunities.length]);

  const stats = {
    totalValue: opportunities
      .filter(o => o.status === 'active')
      .reduce((sum, opp) => sum + (opp.value * (opp.probability / 100)), 0),
    activeOpportunities: opportunities.filter(o => o.status === 'active').length,
    winRate: Math.round(
      (opportunities.filter(o => o.stage === 'closed_won').length /
        opportunities.filter(o => o.stage === 'closed_won' || o.stage === 'closed_lost').length) * 100
    ) || 0
  } as const;

  const allTags = Array.from(new Set(opportunities.flatMap(opp => opp.tags))) as readonly string[];

  const handleSort = useCallback((field: SortableFields): void => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const toggleTag = useCallback((tag: string): void => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  const filteredAndSortedOpportunities = opportunities
    .filter(opportunity => {
      if (filterStage !== 'all' && opportunity.stage !== filterStage) return false;
      if (filterPriority !== 'all' && opportunity.priority !== filterPriority) return false;
      if (selectedTags.length > 0 && !selectedTags.some(tag => opportunity.tags.includes(tag))) return false;
      
      const searchFields = [
        opportunity.title,
        opportunity.accountName,
        opportunity.contactName,
        opportunity.description
      ].map(field => field.toLowerCase());
      
      return searchFields.some(field => field.includes(searchTerm.toLowerCase()));
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Affärsmöjligheter</h1>
            <button
              onClick={() => setShowNewOpportunityForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaChartLine className="mr-2" />
              Ny Affärsmöjlighet
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Viktat säljvärde"
              value={formatCurrency(stats.totalValue)}
              color="primary"
            />
            <StatCard
              title="Aktiva affärer"
              value={stats.activeOpportunities.toString()}
              color="success"
            />
            <StatCard
              title="Vinstgrad"
              value={`${stats.winRate}%`}
              color="info"
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Sök på titel, företag, kontakt..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <FaFilter className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value as OpportunityStage | 'all')}
                className="px-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Alla stadier</option>
                {Object.entries(stageNames).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as OpportunityPriority | 'all')}
                className="px-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Alla prioriteringar</option>
                <option value="high">Hög</option>
                <option value="medium">Medium</option>
                <option value="low">Låg</option>
              </select>
            </div>

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

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Affärsmöjlighet
                    <FaSort className="ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kund & Kontakt
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('value')}
                >
                  <div className="flex items-center">
                    Värde
                    <FaSort className="ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stadium & Prioritet
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('expectedCloseDate')}
                >
                  <div className="flex items-center">
                    Datum
                    <FaSort className="ml-1" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedOpportunities.map((opportunity) => (
                <tr key={opportunity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-blue-600">{opportunity.title}</div>
                        <div className="text-sm text-gray-500">{opportunity.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FaBuilding className="text-gray-400 mr-2" />
                        {opportunity.accountName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaUser className="text-gray-400 mr-2" />
                        {opportunity.contactName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(opportunity.value)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {opportunity.probability}% sannolikhet
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {stageNames[opportunity.stage]}
                      </span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        priorityColors[opportunity.priority]
                      }`}>
                        {opportunity.priority === 'high' ? 'Hög' : 
                         opportunity.priority === 'medium' ? 'Medium' : 'Låg'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        {formatDate(opportunity.expectedCloseDate)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaClock className="text-gray-400 mr-2" />
                        Nästa: {formatDate(opportunity.nextActivity)}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showNewOpportunityForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
              <h2 className="text-xl font-semibold mb-4">Lägg till ny affärsmöjlighet</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Formulärfält här... */}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
