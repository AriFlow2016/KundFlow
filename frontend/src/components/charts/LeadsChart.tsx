import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useRealtime } from '../../contexts/RealtimeContext';

// Dummy-data för demonstration
const data = [
  { name: 'Jan', leads: 4, qualified: 2 },
  { name: 'Feb', leads: 6, qualified: 3 },
  { name: 'Mar', leads: 8, qualified: 5 },
  { name: 'Apr', leads: 12, qualified: 7 },
  { name: 'Maj', leads: 10, qualified: 6 },
  { name: 'Jun', leads: 15, qualified: 8 },
];

export default function LeadsChart() {
  const { charts } = useRealtime();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Leads-trend</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={charts.leads}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem' }}
              formatter={(value: number) => [value, 'Antal']}
              labelStyle={{ color: '#374151' }}
            />
            <Area
              type="monotone"
              dataKey="leads"
              stackId="1"
              stroke="#60A5FA"
              fill="#93C5FD"
              name="Nya leads"
            />
            <Area
              type="monotone"
              dataKey="qualified"
              stackId="2"
              stroke="#34D399"
              fill="#6EE7B7"
              name="Kvalificerade"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
