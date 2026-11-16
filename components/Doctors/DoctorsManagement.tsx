import React from "react";
import {
  getDoctorsServer,
  getDoctorSpecializationsServer,
} from "@/service/doctor/doctor.server";
import { DoctorData, DoctorQueryParams } from "@/service/doctor/doctor.service";
import DoctorFilters from "./DoctorFilters";
import DoctorCreateButton from "./DoctorCreateButton";
import DoctorsTable from "./DoctorsTable";
import PaginationPage from "@/components/reusable/PaginationPage";

interface DoctorsManagementProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function DoctorsManagement({
  searchParams = {},
}: DoctorsManagementProps) {
  // Extract query parameters from server searchParams
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  const specialization =
    typeof searchParams.specialization === "string"
      ? searchParams.specialization
      : undefined;
  const startDate =
    typeof searchParams.startDate === "string"
      ? searchParams.startDate
      : undefined;
  const endDate =
    typeof searchParams.endDate === "string" ? searchParams.endDate : undefined;

  const params: DoctorQueryParams = {
    page,
    limit,
    search,
    specialization:
      specialization && specialization !== "All Specializations"
        ? specialization
        : undefined,
    startDate,
    endDate,
  };

  // Fetch doctors & dynamic specializations concurrently on the server
  const [res, specializations] = await Promise.all([
    getDoctorsServer(params),
    getDoctorSpecializationsServer(),
  ]);

  const doctors: DoctorData[] = res.data || [];
  const pagination = res.pagination || {
    page,
    limit,
    total: doctors.length,
    totalPages: Math.ceil(doctors.length / limit) || 1,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderColor">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-headerColor tracking-tight">
            Doctor Management
          </h2>
          <p className="text-xs sm:text-sm text-descriptionColor mt-1">
            Create, search, filter, and manage doctors and their assigned patients.
          </p>
        </div>

        <DoctorCreateButton />
      </div>

      <DoctorFilters specializations={specializations} />
      <div className="bg-whiteColor rounded-2xl border border-borderColor shadow-xs overflow-hidden">
        <DoctorsTable doctors={doctors} />
        <div className="p-3 border-t border-borderColor bg-whiteColor">
          <PaginationPage
            totalPages={pagination.totalPages}
            dataLength={doctors.length}
            totalItems={pagination.total}
            currentPage={pagination.page}
            itemsPerPage={pagination.limit}
          />
        </div>
      </div>
    </div>
  );
}
