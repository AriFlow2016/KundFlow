import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useRealtime } from '../../contexts/RealtimeContext';

export default function SalesChart() {
  const { charts } = useRealtime();
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Försäljning vs Mål</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={charts.sales}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="target" 
              fill="#94A3B8" 
              name="Mål"
              radius={[4, 4, 0, 0]}
              key={`bar-${Math.random()}`}
            />
            <Bar 
              dataKey="actual" 
              fill="#60A5FA" 
              name="Faktisk"
              radius={[4, 4, 0, 0]}
              key={`bar-${Math.random()}`}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
