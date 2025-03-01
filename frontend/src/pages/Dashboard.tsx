import { FaChartLine, FaUsers, FaBuilding, FaHandshake } from 'react-icons/fa';
import type { StatCard } from '../components/StatCard';
import { useRealtime } from '../contexts/RealtimeContext';
import { SalesChart } from '../components/charts/SalesChart';

export const Dashboard = (): JSX.Element => {
  const { loading, error } = useRealtime();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Totala affärsmöjligheter"
          value="4.2 MSEK"
          icon={<FaChartLine className="text-blue-500" />}
          change="12%"
          trend="up"
        />
        <StatCard
          title="Aktiva konton"
          value="156"
          icon={<FaBuilding className="text-green-500" />}
          change="5%"
          trend="up"
        />
        <StatCard
          title="Nya leads"
          value="24"
          icon={<FaUsers className="text-purple-500" />}
          change="8%"
          trend="up"
        />
        <StatCard
          title="Konverteringsgrad"
          value="32%"
          icon={<FaHandshake className="text-orange-500" />}
          change="2%"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Försäljningsutveckling</h2>
          {loading ? (
            <p className="text-gray-500">Laddar...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <SalesChart />
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Senaste aktiviteter</h2>
          <p className="text-gray-500">Kommer snart...</p>
        </div>
      </div>
    </div>
  );
};
