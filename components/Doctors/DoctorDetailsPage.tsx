import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getDoctorByIdServer,
  getDoctorPatientsServer,
} from "@/service/doctor/doctor.server";
import DoctorProfileHeader from "./DoctorProfileHeader";
import DoctorStatsCards from "./DoctorStatsCards";
import DoctorPatientsTable from "./DoctorPatientsTable";

export default async function DoctorDetailsPage({
  doctorId,
}: {
  doctorId: string;
}) {
  // Concurrent server-side data fetching
  const [doctor, patients] = await Promise.all([
    getDoctorByIdServer(doctorId),
    getDoctorPatientsServer(doctorId, { limit: 100 }),
  ]);

  if (!doctor) {
    return (
      <div className="p-8 text-center bg-whiteColor rounded-2xl border border-borderColor space-y-4">
        <p className="text-redColor font-semibold">Doctor not found</p>
        <Link
          href="/dashboard/doctors"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primaryColor text-whiteColor text-sm font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Doctor List</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumb */}
      <div>
        <Link
          href="/dashboard/doctors"
          className="inline-flex items-center gap-2 text-sm font-semibold text-descriptionColor hover:text-primaryColor transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-secondaryColor" />
          <span>Back to Doctors</span>
        </Link>
      </div>

      {/* TOP SECTION: Doctor Profile Card (Header & Stats) */}
      <div className="bg-whiteColor rounded-2xl border border-borderColor p-6 shadow-xs">
        <DoctorProfileHeader doctor={doctor} />
        <DoctorStatsCards patients={patients} />
      </div>

      {/* BOTTOM SECTION: Assigned Patients Table */}
      <DoctorPatientsTable patients={patients} doctor={doctor} />
    </div>
  );
}
