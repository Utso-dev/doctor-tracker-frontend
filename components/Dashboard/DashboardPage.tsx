import React from "react";
import DashboardClientView from "./DashboardClientView";
import { getDashboardStatsServer } from "@/service/dashboard/dashboard.server";

export default async function DashboardPage() {

  const { data: initialStats, error } = await getDashboardStatsServer();

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderColor">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-headerColor tracking-tight">
            Dashboard & Analytics
          </h2>
          <p className="text-xs sm:text-sm text-descriptionColor mt-1">
            Real-time visual insights, doctor workload distribution, and patient statistics.
          </p>
        </div>
      </div>


      <DashboardClientView
        initialStats={initialStats}
        initialError={error}
      />
    </div>
  );
}
