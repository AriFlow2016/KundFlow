import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ConversionChartProps {
  labels: string[];
  values: number[];
}

export const ConversionChart = ({ labels, values }: ConversionChartProps): JSX.Element => {
  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'Konverteringsgrad',
        data: values,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
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
        text: 'Konverteringsgrad över tid',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          },
        },
      },
    },
  } satisfies ChartOptions<'line'>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Affärsutfall</h3>
      <div className="h-72">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
