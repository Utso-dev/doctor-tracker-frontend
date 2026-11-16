import React from "react";
import { getPatientsServer } from "@/service/patient/patient.server";
import { getDoctorsServer } from "@/service/doctor/doctor.server";
import { PatientData, PatientQueryParams } from "@/service/patient/patient.service";
import { DoctorData } from "@/service/doctor/doctor.service";
import PatientFilters from "./PatientFilters";
import PatientCreateButton from "./PatientCreateButton";
import PatientsTable from "./PatientsTable";
import PaginationPage from "@/components/reusable/PaginationPage";

interface PatientsManagementProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function PatientsManagement({
  searchParams = {},
}: PatientsManagementProps) {
  // Extract query parameters from server searchParams
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  const condition =
    typeof searchParams.condition === "string"
      ? searchParams.condition
      : undefined;
  const doctorId =
    typeof searchParams.doctorId === "string"
      ? searchParams.doctorId
      : undefined;
  const startDate =
    typeof searchParams.startDate === "string"
      ? searchParams.startDate
      : undefined;
  const endDate =
    typeof searchParams.endDate === "string" ? searchParams.endDate : undefined;

  const params: PatientQueryParams = {
    page,
    limit,
    search,
    condition:
      condition && condition !== "All Conditions" ? condition : undefined,
    doctorId: doctorId && doctorId !== "All Doctors" ? doctorId : undefined,
    startDate,
    endDate,
  };

  // Fetch patients & doctors concurrently on the server (SSR)
  const [patientsRes, doctorsRes] = await Promise.all([
    getPatientsServer(params),
    getDoctorsServer({ limit: 10 }),
  ]);

  const patients: PatientData[] = patientsRes.data || [];
  const doctors: DoctorData[] = doctorsRes.data || [];

  const pagination = patientsRes.pagination || {
    page,
    limit,
    total: patients.length,
    totalPages: Math.ceil(patients.length / limit) || 1,
  };

  return (
    <div className="space-y-6">
      {/* Header Banner (Server Rendered) with Client Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderColor">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-headerColor tracking-tight">
            Patient Management
          </h2>
          <p className="text-xs sm:text-sm text-descriptionColor mt-1">
            Complete registry of patients, health conditions, and doctor assignments.
          </p>
        </div>

        <PatientCreateButton doctors={doctors} />
      </div>
      <PatientFilters doctors={doctors} />

      {/* Table Section */}
      <div className="bg-whiteColor rounded-2xl border border-borderColor shadow-xs overflow-hidden">
        <PatientsTable patients={patients} doctors={doctors} />

        {/* Common Reusable Pagination */}
        <div className="p-3 border-t border-borderColor bg-whiteColor">
          <PaginationPage
            totalPages={pagination.totalPages}
            dataLength={patients.length}
            totalItems={pagination.total}
            currentPage={pagination.page}
            itemsPerPage={pagination.limit}
          />
        </div>
      </div>
    </div>
  );
}
