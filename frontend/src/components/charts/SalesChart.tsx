import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartProps {
  labels: string[];
  values: number[];
}

export const SalesChart = ({ labels, values }: SalesChartProps): JSX.Element => {
  const data: ChartData<'bar'> = {
    labels,
    datasets: [
      {
        label: 'Försäljning',
        data: values,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
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
        text: 'Försäljning över tid',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value + ' kr';
          },
        },
      },
    },
  } satisfies ChartOptions<'bar'>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Bar data={data} options={options} />
    </div>
  );
};
