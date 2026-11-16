"use client";

import React from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";
import { PatientData } from "@/service/patient/patient.service";

interface DoctorStatsCardsProps {
  patients: PatientData[];
}

export default function DoctorStatsCards({ patients }: DoctorStatsCardsProps) {
  const total = patients.length;
  const stable = patients.filter((p) => p.condition === "Stable").length;
  const critical = patients.filter((p) => p.condition === "Critical").length;
  const treatment = patients.filter(
    (p) => p.condition === "Under Treatment"
  ).length;
  const recovered = patients.filter((p) => p.condition === "Recovered").length;

  const stats = [
    {
      label: "Total",
      value: total,
      icon: Users,
      badgeColor: "text-grayColor1",
      textColor: "text-headerColor",
      iconColor: "text-primaryColor",
    },
    {
      label: "Stable",
      value: stable,
      icon: Activity,
      badgeColor: "text-greenColor",
      textColor: "text-greenColor",
      iconColor: "text-greenColor",
    },
    {
      label: "Critical",
      value: critical,
      icon: AlertTriangle,
      badgeColor: "text-redColor",
      textColor: "text-redColor",
      iconColor: "text-redColor",
    },
    {
      label: "Treatment",
      value: treatment,
      icon: Clock,
      badgeColor: "text-orengeColor",
      textColor: "text-orengeColor",
      iconColor: "text-orengeColor",
    },
    {
      label: "Recovered",
      value: recovered,
      icon: CheckCircle2,
      badgeColor: "text-blueColor",
      textColor: "text-blueColor",
      iconColor: "text-blueColor",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="p-3.5 rounded-xl bg-whiteColor border border-borderColor flex flex-col justify-between shadow-2xs"
        >
          <span
            className={`text-sm font-semibold uppercase flex items-center gap-1.5 ${s.badgeColor}`}
          >
            <s.icon className={`w-4 h-4 ${s.iconColor}`} /> {s.label}
          </span>
          <span className={`text-xl font-bold mt-1 ${s.textColor}`}>
            {s.value}
          </span>
        </div>
      ))}
    </div>
  );
}
