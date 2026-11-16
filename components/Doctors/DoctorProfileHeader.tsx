"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Calendar, Edit2, Mail, Phone } from "lucide-react";
import { DoctorData } from "@/service/doctor/doctor.service";
import DoctorModal from "./DoctorModal";

interface DoctorProfileHeaderProps {
  doctor: DoctorData;
}

export default function DoctorProfileHeader({
  doctor,
}: DoctorProfileHeaderProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const formattedJoinedDate = doctor.createdAt
    ? new Date(doctor.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "—";

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-borderColor">
        {/* Avatar & Basic Info */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-primaryColor text-whiteColor flex items-center justify-center text-2xl font-bold shadow-md shadow-primaryColor/20 shrink-0">
            {doctor.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-headerColor tracking-tight">
                {doctor.name}
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-primaryColor/10 text-primaryColor border border-primaryColor/20">
                {doctor.specialization}
              </span>
            </div>

            {/* Hospital & contact details in an elegant single line with simple icons */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-descriptionColor">
              <p className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-grayColor1 shrink-0" />
                <span>{doctor.hospital}</span>
              </p>

              <span className="text-grayColor1/40 hidden sm:inline">•</span>

              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-grayColor1 shrink-0" />
                <span>{doctor.phone}</span>
              </p>

              <span className="text-grayColor1/40 hidden sm:inline">•</span>

              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-grayColor1 shrink-0" />
                <span>{doctor.email}</span>
              </p>

              <span className="text-grayColor1/40 hidden sm:inline">•</span>

              <p className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-grayColor1 shrink-0" />
                <span>Joined: {formattedJoinedDate}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action: Edit Profile */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primaryColor text-whiteColor text-sm font-medium hover:opacity-95 shadow-md shadow-primaryColor/20 transition-all cursor-pointer"
          >
            <Edit2 className="w-4 h-4 text-whiteColor" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Edit Doctor Modal */}
      <DoctorModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => router.refresh()}
        doctor={doctor}
      />
    </>
  );
}
