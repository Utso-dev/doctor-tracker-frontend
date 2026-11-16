"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { DoctorData, DoctorService } from "@/service/doctor/doctor.service";
import DoctorModal from "./DoctorModal";

interface DoctorRowActionsProps {
  doctor: DoctorData;
}

export default function DoctorRowActions({ doctor }: DoctorRowActionsProps) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${doctor.name}? This will also delete all associated patients.`
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await DoctorService.delete(doctor._id!);
      router.refresh();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete doctor.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href={`/dashboard/doctors/${doctor._id}`}
          title="View Doctor Details & Patients"
          className="p-1.5 text-primaryColor hover:bg-primaryColor/10 rounded-lg transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4" />
        </Link>
        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          title="Edit Doctor"
          className="p-1.5 text-blueColor hover:bg-blueColor/15 rounded-lg transition-colors cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete Doctor"
          className="p-1.5 text-redColor hover:bg-redColor/15 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Edit Doctor Modal */}
      {isEditModalOpen && (
        <DoctorModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            router.refresh();
          }}
          doctor={doctor}
        />
      )}
    </>
  );
}
