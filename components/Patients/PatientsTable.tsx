"use client";

import React from "react";
import { Phone, Stethoscope } from "lucide-react";
import { PatientData } from "@/service/patient/patient.service";
import { DoctorData } from "@/service/doctor/doctor.service";
import DynamicTable from "@/components/reusable/DynamicTable";
import PatientRowActions from "./PatientRowActions";

interface PatientsTableProps {
  patients: PatientData[];
  doctors: DoctorData[];
}

export default function PatientsTable({
  patients,
  doctors,
}: PatientsTableProps) {
  // Columns definition on the client side so formatters are valid
  const columns = [
    {
      label: "Patient Name",
      accessor: "name",
      formatter: (val: string, row: PatientData) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primaryColor/10 border border-primaryColor/20 flex items-center justify-center text-primaryColor font-bold text-sm">
            {val.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-headerColor leading-tight">{val}</p>
            <p className="text-sm text-grayColor1 mt-0.5">
              {row.email || row.address || "No email"}
            </p>
          </div>
        </div>
      ),
    },
    {
      label: "Age / Gender",
      accessor: "age",
      formatter: (val: number, row: PatientData) => (
        <span className="text-sm text-descriptionColor font-medium">
          {val} yrs • {row.gender}
        </span>
      ),
    },
    {
      label: "Condition",
      accessor: "condition",
      formatter: (val: string) => {
        const colorMap: Record<string, string> = {
          Stable: "bg-greenColor/15 text-greenColor border-greenColor/30",
          Critical: "bg-redColor/15 text-redColor border-redColor/30",
          Recovered: "bg-blueColor/15 text-blueColor border-blueColor/30",
          "Under Treatment":
            "bg-orengeColor/15 text-orengeColor border-orengeColor/30",
        };

        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium border ${colorMap[val] ||
              "bg-bgColor text-descriptionColor border-borderColor"
              }`}
          >
            {val}
          </span>
        );
      },
    },
    {
      label: "Assigned Doctor",
      accessor: "doctor",
      formatter: (doc: any) => {
        if (!doc)
          return <span className="text-sm text-grayColor1">Unassigned</span>;
        const doctorName = typeof doc === "object" ? doc.name : "Assigned";
        const spec = typeof doc === "object" ? doc.specialization : "";

        return (
          <div className="text-sm">
            <p className="font-medium text-headerColor flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-primaryColor" />
              {doctorName}
            </p>
            {spec && <p className="text-sm text-grayColor1">{spec}</p>}
          </div>
        );
      },
    },
    {
      label: "Contact",
      accessor: "phone",
      formatter: (val: string) => (
        <span className="text-sm text-descriptionColor flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-grayColor1" />
          {val}
        </span>
      ),
    },
    {
      label: "Admission Date",
      accessor: "admissionDate",
      formatter: (val: string) => {
        if (!val) return "—";
        return (
          <span className="text-sm text-grayColor1">
            {new Date(val).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      },
    },
    {
      label: "Actions",
      accessor: "_id",
      formatter: (_: any, row: PatientData) => (
        <PatientRowActions patient={row} doctors={doctors} />
      ),
    },
  ];

  return (
    <DynamicTable
      columns={columns}
      data={patients}
      loading={false}
      noDataMessage="No patients matching your search or filters"
    />
  );
}
