"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BarChart } from "../Chart/BarChart";
import { DoughnutChart } from "../Chart/DoughnutChart";
import { LineChart } from "../Chart/LineChart";
import { DashboardStats } from "@/service/dashboard/dashboard.service";

interface DashboardChartsProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

export default function DashboardCharts({
  stats,
  loading = false,
}: DashboardChartsProps) {
  // Chart data extraction
  const doctorLabels =
    stats?.patientsPerDoctor?.map((d) => d.doctorName) || [];
  const doctorPatientCounts =
    stats?.patientsPerDoctor?.map((d) => d.patientCount) || [];

  const conditionLabels =
    stats?.conditionStats?.map((c) => c.condition) || [];
  const conditionCounts =
    stats?.conditionStats?.map((c) => c.count) || [];

  const timelineLabels =
    stats?.dateBasedStats?.map((d) => d.date) || [];
  const timelineCounts =
    stats?.dateBasedStats?.map((d) => d.count) || [];

  return (
    <div className="space-y-6">
      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patients Per Doctor (Bar Chart) */}
        <div className="lg:col-span-2 bg-whiteColor rounded-2xl p-5 border border-borderColor shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-headerColor">
                Patients per Doctor
              </h3>
              <p className="text-sm text-descriptionColor mt-0.5">
                Workload distribution across medical specialists
              </p>
            </div>
            <Link
              href="/dashboard/doctors"
              className="text-sm text-primaryColor font-medium flex items-center gap-1 hover:underline"
            >
              <span>View all doctors</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {doctorLabels.length > 0 ? (
            <BarChart
              labels={doctorLabels}
              data={doctorPatientCounts}
              label="Patients Assigned"
            />
          ) : (
            <div className="h-70 flex items-center justify-center text-xs text-grayColor1">
              {loading
                ? "Loading chart data..."
                : "No doctor assignments recorded yet"}
            </div>
          )}
        </div>

        {/* Condition Distribution (Doughnut Chart) */}
        <div className="bg-whiteColor rounded-2xl p-5 border border-borderColor shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-headerColor">
                Patient Conditions
              </h3>
              <p className="text-sm text-descriptionColor mt-0.5">
                Current health status breakdown
              </p>
            </div>
            <Link
              href="/dashboard/patients"
              className="text-sm text-primaryColor font-medium flex items-center gap-1 hover:underline"
            >
              <span>View list</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {conditionLabels.length > 0 ? (
            <DoughnutChart labels={conditionLabels} data={conditionCounts} />
          ) : (
            <div className="h-70 flex items-center justify-center text-xs text-grayColor1">
              {loading
                ? "Loading condition data..."
                : "No patient records found"}
            </div>
          )}
        </div>
      </div>

      {/* Date-Based Trends (Line Chart) */}
      <div className="bg-whiteColor rounded-2xl p-5 border border-borderColor shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-headerColor">
              Registration & Admission Timeline
            </h3>
            <p className="text-sm text-descriptionColor mt-0.5">
              Daily patient onboarding trends over time
            </p>
          </div>
        </div>

        {timelineLabels.length > 0 ? (
          <LineChart
            labels={timelineLabels}
            data={timelineCounts}
            label="Daily Admissions"
          />
        ) : (
          <div className="h-70 flex items-center justify-center text-sm text-grayColor1">
            {loading
              ? "Loading timeline trends..."
              : "No admissions recorded yet"}
          </div>
        )}
      </div>
    </div>
  );
}
