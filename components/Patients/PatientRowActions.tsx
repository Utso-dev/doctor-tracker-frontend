"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2 } from "lucide-react";
import { PatientData, PatientService } from "@/service/patient/patient.service";
import { DoctorData } from "@/service/doctor/doctor.service";
import PatientModal from "./PatientModal";

interface PatientRowActionsProps {
  patient: PatientData;
  doctors: DoctorData[];
}

export default function PatientRowActions({
  patient,
  doctors,
}: PatientRowActionsProps) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete patient "${patient.name}"?`)) {
      return;
    }

    try {
      setDeleting(true);
      await PatientService.delete(patient._id!);
      router.refresh();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete patient.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          title="Edit Patient"
          className="p-1.5 text-blueColor hover:bg-blueColor/15 rounded-lg transition-colors cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete Patient"
          className="p-1.5 text-redColor hover:bg-redColor/15 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Edit Patient Modal */}
      {isEditModalOpen && (
        <PatientModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            router.refresh();
          }}
          patient={patient}
          doctors={doctors}
        />
      )}
    </>
  );
}
