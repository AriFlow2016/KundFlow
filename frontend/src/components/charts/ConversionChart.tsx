import React from 'react';
import Chart from 'chart.js/auto';
import { ChartConfiguration } from 'chart.js';

interface ConversionChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

const ConversionChart: React.FC<ConversionChartProps> = ({ data }) => {
  const chartRef = React.useRef<HTMLCanvasElement>(null);
  const chartInstance = React.useRef<Chart | null>(null);

  React.useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const config: ChartConfiguration = {
          type: 'line',
          data: {
            labels: data.labels,
            datasets: [
              {
                label: 'Konvertering',
                data: data.values,
                fill: false,
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: 'Konverteringsgrad',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  },
                },
              },
            },
          },
        };

        chartInstance.current = new Chart(ctx, config);
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Affärsutfall</h3>
      <div className="h-72">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default ConversionChart;
