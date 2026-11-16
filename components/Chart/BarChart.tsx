"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const barOptions = {
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

export function BarChart({
  labels,
  data,
  label = "Patients",
}: {
  labels: string[];
  data: number[];
  label?: string;
}) {
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: "rgba(11, 20, 102, 0.85)",
        borderRadius: 8,
        hoverBackgroundColor: "rgba(214, 174, 41, 0.9)",
      },
    ],
  };

  return (
    <div className="h-[280px] w-full">
      <Bar options={barOptions} data={chartData} />
    </div>
  );
}
