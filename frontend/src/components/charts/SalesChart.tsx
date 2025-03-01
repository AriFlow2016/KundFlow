import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useRealtime } from '../../contexts/RealtimeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

export const SalesChart: React.FC<SalesChartProps> = () => {
  const { charts } = useRealtime();
  const data = {
    labels: charts.sales.map((sale) => sale.name),
    values: charts.sales.map((sale) => sale.actual),
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Försäljning',
        data: data.values,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Försäljning per månad',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `${value.toLocaleString()} kr`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SalesChart;
