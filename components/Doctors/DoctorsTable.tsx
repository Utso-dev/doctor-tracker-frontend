"use client";

import React from "react";
import Link from "next/link";
import { Building2, Phone, Users } from "lucide-react";
import { DoctorData } from "@/service/doctor/doctor.service";
import DynamicTable from "@/components/reusable/DynamicTable";
import DoctorRowActions from "./DoctorRowActions";

interface DoctorsTableProps {
  doctors: DoctorData[];
}

export default function DoctorsTable({ doctors }: DoctorsTableProps) {
  // Table Columns defined in Client Component so formatters are valid
  const columns = [
    {
      label: "Doctor Name",
      accessor: "name",
      formatter: (val: string, row: DoctorData) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primaryColor/10 border border-primaryColor/20 flex items-center justify-center text-primaryColor font-bold text-sm">
            {val.charAt(0).toUpperCase()}
          </div>
          <div>
            <Link
              href={`/dashboard/doctors/${row._id}`}
              className="font-semibold text-headerColor leading-tight hover:text-primaryColor hover:underline transition-colors"
            >
              {val}
            </Link>
            <p className="text-sm text-grayColor1 mt-0.5">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      label: "Specialization",
      accessor: "specialization",
      formatter: (val: string) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold bg-primaryColor/10 text-primaryColor border border-primaryColor/20">
          {val}
        </span>
      ),
    },
    {
      label: "Hospital",
      accessor: "hospital",
      formatter: (val: string) => (
        <span className="text-sm text-descriptionColor flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-grayColor1" />
          {val}
        </span>
      ),
    },
    {
      label: "Phone",
      accessor: "phone",
      formatter: (val: string) => (
        <span className="text-sm text-descriptionColor flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-grayColor1" />
          {val}
        </span>
      ),
    },
    {
      label: "Patients",
      accessor: "patientCount",
      formatter: (val: number, row: DoctorData) => (
        <Link
          href={`/dashboard/doctors/${row._id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-greenColor/15 text-greenColor hover:bg-greenColor/25 border border-greenColor/30 transition-colors cursor-pointer"
        >
          <Users className="w-3 h-3" />
          <span>{val || 0} Patients</span>
        </Link>
      ),
    },
    {
      label: "Created",
      accessor: "createdAt",
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
      formatter: (_: any, row: DoctorData) => <DoctorRowActions doctor={row} />,
    },
  ];

  return (
    <DynamicTable
      columns={columns}
      data={doctors}
      loading={false}
      noDataMessage="No doctors matching your search or filters"
    />
  );
}
