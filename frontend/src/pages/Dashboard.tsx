import React from 'react';
import { FaChartLine, FaUsers, FaBuilding, FaHandshake } from 'react-icons/fa';
import { StatCard } from '../components/StatCard';
import { useRealtime } from '../contexts/RealtimeContext';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import SalesChart from '../components/charts/SalesChart';

export default function Dashboard() {
  const { lastUpdate, recentActivities, stats, charts } = useRealtime();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Senast uppdaterad: {format(lastUpdate, 'PPpp', { locale: sv })}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Totala affärsmöjligheter"
          value={`${(stats.totalPipelineValue / 1000000).toFixed(1)} MSEK`}
          icon={<FaChartLine className="text-blue-500" />}
          change={12}
          trend="up"
        />
        <StatCard
          title="Aktiva konton"
          value={stats.activeOpportunities.toString()}
          icon={<FaBuilding className="text-green-500" />}
          change={5}
          trend="up"
        />
        <StatCard
          title="Nya leads"
          value={stats.newLeads.toString()}
          icon={<FaUsers className="text-purple-500" />}
          change={8}
          trend="up"
        />
        <StatCard
          title="Konverteringsgrad"
          value={`${stats.conversionRate}%`}
          icon={<FaHandshake className="text-orange-500" />}
          change={2}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Försäljningsutveckling</h2>
          <SalesChart data={charts.sales} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Senaste aktiviteter</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{activity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
