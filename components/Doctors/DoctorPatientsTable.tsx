"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Phone, Plus, Search, Trash2 } from "lucide-react";
import { DoctorData, DoctorService } from "@/service/doctor/doctor.service";
import { PatientData } from "@/service/patient/patient.service";
import DynamicTable, { ColumnConfig } from "@/components/reusable/DynamicTable";
import PatientModal from "../Patients/PatientModal";

const CONDITION_COLORS: Record<string, string> = {
  Stable: "bg-greenColor/15 text-greenColor border-greenColor/30",
  Critical: "bg-redColor/15 text-redColor border-redColor/30",
  Recovered: "bg-blueColor/15 text-blueColor border-blueColor/30",
  "Under Treatment": "bg-orengeColor/15 text-orengeColor border-orengeColor/30",
};

interface DoctorPatientsTableProps {
  patients: PatientData[];
  doctor: DoctorData;
}

export default function DoctorPatientsTable({
  patients,
  doctor,
}: DoctorPatientsTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [selectedPatientForEdit, setSelectedPatientForEdit] =
    useState<PatientData | null>(null);

  // Handle removing a patient directly
  const handleRemovePatient = async (
    patientId: string,
    patientName: string
  ) => {
    if (!confirm(`Are you sure you want to remove patient "${patientName}"?`)) {
      return;
    }

    try {
      await DoctorService.deletePatient(doctor._id!, patientId);
      router.refresh();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to remove patient.");
    }
  };

  // Instant client-side search filtering (no server loop)
  const filteredPatients = patients.filter((p) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.condition?.toLowerCase().includes(q)
    );
  });

  // Columns definition for DynamicTable
  const columns: ColumnConfig[] = [
    {
      label: "Patient Name",
      accessor: "name",
      formatter: (val: string, row: PatientData) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primaryColor/10 border border-primaryColor/20 text-primaryColor font-bold flex items-center justify-center text-sm shrink-0">
            {val.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-headerColor leading-tight">
              {val}
            </p>
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
        <span className="text-sm font-medium text-descriptionColor">
          {val} yrs • {row.gender}
        </span>
      ),
    },
    {
      label: "Condition",
      accessor: "condition",
      formatter: (val: string) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold border ${CONDITION_COLORS[val] ||
            "bg-bgColor text-descriptionColor border-borderColor"
            }`}
        >
          {val}
        </span>
      ),
    },
    {
      label: "Contact Phone",
      accessor: "phone",
      formatter: (val: string) => (
        <span className="text-sm text-descriptionColor flex items-center gap-1.5 font-medium">
          <Phone className="w-4 h-4 text-grayColor1" />
          {val}
        </span>
      ),
    },
    {
      label: "Admission Date",
      accessor: "admissionDate",
      formatter: (val: string) => (
        <span className="text-sm text-grayColor1">
          {val
            ? new Date(val).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
            : "—"}
        </span>
      ),
    },
    {
      label: "Actions",
      accessor: "_id",
      formatter: (_: any, row: PatientData) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedPatientForEdit(row)}
            title="Edit Patient Details"
            className="p-1.5 text-blueColor hover:bg-blueColor/10 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleRemovePatient(row._id!, row.name)}
            title="Remove Patient"
            className="p-1.5 text-redColor hover:bg-redColor/10 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-whiteColor rounded-2xl border border-borderColor shadow-xs overflow-hidden">
        {/* Header & Controls */}
        <div className="p-5 border-b border-borderColor flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-headerColor">
              Assigned Patients
            </h2>
            <p className="text-sm text-descriptionColor mt-0.5">
              Patients currently undergoing treatment or monitoring under{" "}
              {doctor.name}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-grayColor1 pointer-events-none" />
              <input
                type="text"
                placeholder="Search patient name, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 sm:w-60 h-10 pl-9 pr-3 text-sm rounded-md border border-borderColor text-headerColor outline-none focus:border-primaryColor bg-whiteColor placeholder:text-grayColor1/80 transition-colors"
              />
            </div>

            {/* Add Patient Button */}
            <button
              type="button"
              onClick={() => setIsAddPatientOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-md bg-primaryColor text-whiteColor text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Patient</span>
            </button>
          </div>
        </div>

        {/* Dynamic Table */}
        <DynamicTable
          columns={columns}
          data={filteredPatients}
          loading={false}
          noDataMessage={
            searchTerm
              ? "No patients match your search criteria."
              : `No patients assigned to ${doctor.name} yet.`
          }
        />
      </div>

      {/* Add Patient Modal */}
      {isAddPatientOpen && (
        <PatientModal
          open={isAddPatientOpen}
          onClose={() => setIsAddPatientOpen(false)}
          onSuccess={() => {
            setIsAddPatientOpen(false);
            router.refresh();
          }}
          doctors={[doctor]}
          defaultDoctorId={doctor._id}
        />
      )}

      {/* Edit Patient Modal */}
      {selectedPatientForEdit && (
        <PatientModal
          open={!!selectedPatientForEdit}
          onClose={() => setSelectedPatientForEdit(null)}
          onSuccess={() => {
            setSelectedPatientForEdit(null);
            router.refresh();
          }}
          patient={selectedPatientForEdit}
          doctors={[doctor]}
          defaultDoctorId={doctor._id}
        />
      )}
    </>
  );
}
