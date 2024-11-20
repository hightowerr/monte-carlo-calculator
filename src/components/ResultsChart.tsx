import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { SimulationResult } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  results: SimulationResult;
}

export function ResultsChart({ results }: Props) {
  const getBinData = () => {
    const min = Math.min(...results.data);
    const max = Math.max(...results.data);
    const binCount = 30;
    const binSize = (max - min) / binCount;
    const bins = new Array(binCount).fill(0);

    results.data.forEach(value => {
      const binIndex = Math.min(
        Math.floor((value - min) / binSize),
        binCount - 1
      );
      bins[binIndex]++;
    });

    const labels = bins.map((_, i) => 
      (min + (i * binSize) + (binSize / 2)).toFixed(2)
    );

    return { bins, labels };
  };

  const { bins, labels } = getBinData();

  const data = {
    labels,
    datasets: [
      {
        label: 'Frequency',
        data: bins,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
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
        text: 'Distribution of Results',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <Bar data={data} options={options} />
      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Mean</p>
          <p className="text-lg font-semibold">{results.mean.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Median</p>
          <p className="text-lg font-semibold">{results.median.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">95th Percentile</p>
          <p className="text-lg font-semibold">{results.percentiles[95].toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}