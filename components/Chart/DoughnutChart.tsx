"use client";

import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        usePointStyle: true,
        padding: 16,
        font: { size: 12 },
        color: "#4a4c56",
      },
    },
  },
  cutout: "68%",
};

export function DoughnutChart({
  labels,
  data,
}: {
  labels: string[];
  data: number[];
}) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "#83bf6e", // greenColor (Stable)
          "#e12626", // redColor (Critical)
          "#0068ef", // blueColor (Recovered)
          "#ff6a55", // orengeColor (Under Treatment)
          "#d6ae29", // secondaryColor
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  return (
    <div className="h-[280px] w-full flex items-center justify-center">
      <Doughnut options={doughnutOptions} data={chartData} />
    </div>
  );
}
