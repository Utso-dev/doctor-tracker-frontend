"use client";

import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  RefreshCw,
  Stethoscope,
  Users,
} from "lucide-react";
import StatCards, { StatCardItem } from "./StateCards";
import DashboardCharts from "./DashboardCharts";
import {
  DashboardService,
  DashboardStats,
} from "@/service/dashboard/dashboard.service";

interface DashboardClientViewProps {
  initialStats: DashboardStats | null;
  initialError?: string;
}

export default function DashboardClientView({
  initialStats,
  initialError,
}: DashboardClientViewProps) {
  const [stats, setStats] = useState<DashboardStats | null>(initialStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    initialError && !initialStats ? initialError : ""
  );



  const criticalCount =
    stats?.conditionStats?.find((c) => c.condition === "Critical")?.count || 0;

  const statCards: StatCardItem[] = [
    {
      title: "Total Doctors",
      value: stats?.totalDoctors ?? 0,
      subtitle: "Active Staff",
      icon: <Stethoscope className="w-5 h-5 text-primaryColor" />,
    },
    {
      title: "Total Patients",
      value: stats?.totalPatients ?? 0,
      subtitle: "Registered",
      icon: <Users className="w-5 h-5 text-primaryColor" />,
    },
    {
      title: "Avg Patients / Doctor",
      value: stats?.averagePatientsPerDoctor ?? 0,
      subtitle: "Ratio",
      icon: <Activity className="w-5 h-5 text-secondaryColor" />,
    },
    {
      title: "Critical Cases",
      value: criticalCount,
      subtitle: "Attention Needed",
      icon: <AlertTriangle className="w-5 h-5 text-redColor" />,
    },
  ];

  return (
    <div className="space-y-6">

      <StatCards statCards={statCards} isLoading={loading} />
      <DashboardCharts stats={stats} loading={loading} />
    </div>
  );
}
