"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#0b1466",
      titleFont: { size: 13, weight: "bold" as const },
      bodyFont: { size: 12 },
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: { size: 11 },
        color: "#777980",
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "#e5e7eb",
      },
      ticks: {
        font: { size: 11 },
        color: "#777980",
        stepSize: 1,
      },
    },
  },
};

export function LineChart({
  label = "Registrations",
  labels,
  data,
}: {
  label?: string;
  labels: string[];
  data: number[];
}) {
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        borderColor: "#0b1466",
        backgroundColor: "rgba(11, 20, 102, 0.08)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#d6ae29",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div className="h-[280px] w-full">
      <Line options={options} data={chartData} />
    </div>
  );
}
