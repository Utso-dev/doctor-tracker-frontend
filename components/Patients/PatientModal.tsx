"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle } from "lucide-react";
import RootDialog from "@/components/reusable/RootDialog";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  PatientData,
  PatientService,
} from "@/service/patient/patient.service";
import { DoctorData, DoctorService } from "@/service/doctor/doctor.service";

// Zod Validation Schema
const patientFormSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  age: z
    .union([z.number(), z.string()])
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 150, {
      message: "Please enter a valid age between 0 and 150",
    }),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  condition: z.enum(["Stable", "Critical", "Recovered", "Under Treatment"], {
    errorMap: () => ({ message: "Please select a health condition" }),
  }),
  doctor: z.string().min(1, "Please select an assigned doctor"),
  phone: z.string().min(5, "Contact phone number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().optional(),
  admissionDate: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface PatientModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patient?: PatientData | null;
  doctors?: DoctorData[];
  defaultDoctorId?: string;
}

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const CONDITION_OPTIONS = [
  { value: "Stable", label: "Stable" },
  { value: "Critical", label: "Critical" },
  { value: "Recovered", label: "Recovered" },
  { value: "Under Treatment", label: "Under Treatment" },
];

export default function PatientModal({
  open,
  onClose,
  onSuccess,
  patient,
  doctors = [],
  defaultDoctorId,
}: PatientModalProps) {
  const [availableDoctors, setAvailableDoctors] = useState<DoctorData[]>(doctors);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      age: "",
      gender: "Male",
      condition: "Under Treatment",
      doctor: defaultDoctorId || "",
      phone: "",
      email: "",
      address: "",
      admissionDate: new Date().toISOString().split("T")[0],
    },
  });

  // Fetch doctors if not passed or empty
  useEffect(() => {
    if (doctors && doctors.length > 0) {
      setAvailableDoctors(doctors);
    } else if (open) {
      DoctorService.getAll({ limit: 100 })
        .then((res) => {
          if (res.data?.success || res.data?.data) {
            setAvailableDoctors(res.data.data || []);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch doctors in PatientModal:", err);
        });
    }
  }, [doctors, open]);

  // Sync form values with selected patient or defaults on open
  useEffect(() => {
    setFormError("");
    if (patient) {
      reset({
        name: patient.name || "",
        age: patient.age !== undefined ? String(patient.age) : "",
        gender: patient.gender || "Male",
        condition: patient.condition || "Under Treatment",
        doctor:
          typeof patient.doctor === "object"
            ? patient.doctor?._id || ""
            : patient.doctor || "",
        phone: patient.phone || "",
        email: patient.email || "",
        address: patient.address || "",
        admissionDate: patient.admissionDate
          ? new Date(patient.admissionDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      reset({
        name: "",
        age: "",
        gender: "Male",
        condition: "Under Treatment",
        doctor: defaultDoctorId || availableDoctors[0]?._id || "",
        phone: "",
        email: "",
        address: "",
        admissionDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [patient, open, availableDoctors, reset]);

  const onSubmit = async (values: PatientFormValues) => {
    setFormError("");
    setFormLoading(true);

    try {
      const payload = {
        name: values.name.trim(),
        age: Number(values.age),
        gender: values.gender,
        condition: values.condition,
        doctor: values.doctor,
        phone: values.phone.trim(),
        email: values.email?.trim() || undefined,
        address: values.address?.trim() || undefined,
        admissionDate: values.admissionDate
          ? new Date(values.admissionDate)
          : new Date(),
      };

      if (patient?._id) {
        await PatientService.update(patient._id, payload);
      } else {
        await PatientService.create(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setFormError(
        err.response?.data?.message || err.message || "Failed to save patient."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const doctorOptions = availableDoctors.map((doc) => ({
    value: doc._id || "",
    label: `${doc.name} (${doc.specialization})`,
  }));

  return (
    <RootDialog
      open={open}
      setOpen={(isOpen) => {
        if (!isOpen) onClose();
      }}
      className="bg-whiteColor border border-borderColor rounded-2xl shadow-2xl p-6 sm:max-w-xl"
    >
      <DialogHeader className="pr-8 pb-3 border-b border-borderColor text-left">
        <DialogTitle className="text-lg font-bold text-headerColor">
          {patient ? "Edit Patient Details" : "Register New Patient"}
        </DialogTitle>
        <DialogDescription className="text-sm text-descriptionColor mt-0.5">
          {patient
            ? "Update health status, assigned specialist, and contact details."
            : "Complete the form below to register and assign a patient to a doctor."}
        </DialogDescription>
      </DialogHeader>

      {formError && (
        <div className="mt-4 p-3 rounded-xl bg-redColor/10 text-redColor text-sm flex items-center gap-2 border border-redColor/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        {/* Full Name */}
        <ReusableInput
          label="Patient Full Name"
          required
          placeholder="e.g. John Doe"
          {...register("name")}
          error={errors.name?.message}
        />

        {/* Age and Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReusableInput
            label="Age"
            required
            type="number"
            placeholder="e.g. 45"
            {...register("age")}
            error={errors.age?.message}
          />

          <div>
            <label className="text-sm text-headerColor font-medium block mb-1.5">
              Gender <span className="text-redColor">*</span>
            </label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <SelecteInputField
                  value={field.value}
                  onValueChange={field.onChange}
                  options={GENDER_OPTIONS}
                />
              )}
            />
            {errors.gender?.message && (
              <p className="text-redColor text-xs mt-1.5">
                {errors.gender.message}
              </p>
            )}
          </div>
        </div>

        {/* Condition and Assigned Doctor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-headerColor font-medium block mb-1.5">
              Condition <span className="text-redColor">*</span>
            </label>
            <Controller
              name="condition"
              control={control}
              render={({ field }) => (
                <SelecteInputField
                  value={field.value}
                  onValueChange={field.onChange}
                  options={CONDITION_OPTIONS}
                />
              )}
            />
            {errors.condition?.message && (
              <p className="text-redColor text-xs mt-1.5">
                {errors.condition.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-headerColor font-medium block mb-1.5">
              Assigned Doctor <span className="text-redColor">*</span>
            </label>
            <Controller
              name="doctor"
              control={control}
              render={({ field }) => (
                <SelecteInputField
                  placeholder="Select Doctor"
                  value={field.value}
                  onValueChange={field.onChange}
                  options={doctorOptions}
                />
              )}
            />
            {errors.doctor?.message && (
              <p className="text-redColor text-xs mt-1.5">
                {errors.doctor.message}
              </p>
            )}
          </div>
        </div>

        {/* Phone and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReusableInput
            label="Phone"
            required
            type="tel"
            placeholder="+1-555-0100"
            {...register("phone")}
            error={errors.phone?.message}
          />

          <ReusableInput
            label="Email"
            type="email"
            placeholder="patient@example.com"
            {...register("email")}
            error={errors.email?.message}
          />
        </div>

        {/* Address */}
        <ReusableInput
          label="Address"
          placeholder="Street address, City"
          {...register("address")}
          error={errors.address?.message}
        />

        {/* Admission Date */}
        <ReusableInput
          label="Admission Date"
          type="date"
          {...register("admissionDate")}
          error={errors.admissionDate?.message}
        />

        {/* Modal Actions */}
        <div className="pt-4 border-t border-borderColor flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-md border border-borderColor text-sm font-medium text-descriptionColor hover:bg-bgColor cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formLoading}
            className="px-5 py-2.5 rounded-md bg-primaryColor text-whiteColor text-sm font-medium hover:opacity-95 shadow-md shadow-primaryColor/20 disabled:opacity-50 cursor-pointer transition-all"
          >
            {formLoading
              ? "Saving..."
              : patient
                ? "Save Changes"
                : "Register Patient"}
          </button>
        </div>
      </form>
    </RootDialog>
  );
}
