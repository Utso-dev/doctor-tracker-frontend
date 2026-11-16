"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle } from "lucide-react";
import RootDialog from "@/components/reusable/RootDialog";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DoctorData, DoctorService } from "@/service/doctor/doctor.service";

// Zod Validation Schema
const doctorFormSchema = z.object({
  name: z.string().min(2, "Doctor name must be at least 2 characters"),
  specialization: z.string().min(2, "Specialization is required"),
  hospital: z.string().min(2, "Hospital or Clinic name is required"),
  phone: z.string().min(5, "Contact phone number is required"),
  email: z.string().email("Please enter a valid email address"),
});

type DoctorFormValues = z.infer<typeof doctorFormSchema>;

interface DoctorModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  doctor?: DoctorData | null;
}

export default function DoctorModal({
  open,
  onClose,
  onSuccess,
  doctor,
}: DoctorModalProps) {
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      specialization: "",
      hospital: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    setFormError("");
    if (doctor) {
      reset({
        name: doctor.name || "",
        specialization: doctor.specialization || "",
        hospital: doctor.hospital || "",
        phone: doctor.phone || "",
        email: doctor.email || "",
      });
    } else {
      reset({
        name: "",
        specialization: "",
        hospital: "",
        phone: "",
        email: "",
      });
    }
  }, [doctor, open, reset]);

  const onSubmit = async (values: DoctorFormValues) => {
    setFormError("");
    setFormLoading(true);

    try {
      const payload = {
        name: values.name.trim(),
        specialization: values.specialization.trim(),
        hospital: values.hospital.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
      };

      if (doctor?._id) {
        await DoctorService.update(doctor._id, payload);
      } else {
        await DoctorService.create(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setFormError(
        err.response?.data?.message || err.message || "Failed to save doctor details."
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <RootDialog
      open={open}
      setOpen={(isOpen) => {
        if (!isOpen) onClose();
      }}
      className="bg-whiteColor border border-borderColor rounded-2xl shadow-2xl p-6 sm:max-w-lg"
    >
      <DialogHeader className="pr-8 pb-3 border-b border-borderColor text-left">
        <DialogTitle className="text-lg font-bold text-headerColor">
          {doctor ? "Edit Doctor Profile" : "Register New Doctor"}
        </DialogTitle>
        <DialogDescription className="text-sm text-descriptionColor mt-0.5">
          {doctor
            ? "Update specialist affiliation, department, and contact information."
            : "Register a medical specialist to manage patient assignments."}
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
          label="Doctor Full Name"
          required
          placeholder="e.g. Dr. Sarah Jenkins"
          {...register("name")}
          error={errors.name?.message}
        />

        {/* Specialization and Hospital */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReusableInput
            label="Specialization"
            required
            placeholder="e.g. Cardiology"
            {...register("specialization")}
            error={errors.specialization?.message}
          />

          <ReusableInput
            label="Hospital / Clinic"
            required
            placeholder="e.g. Central City Hospital"
            {...register("hospital")}
            error={errors.hospital?.message}
          />
        </div>

        {/* Phone and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReusableInput
            label="Phone"
            required
            type="tel"
            placeholder="e.g. +1-555-0101"
            {...register("phone")}
            error={errors.phone?.message}
          />

          <ReusableInput
            label="Email Address"
            required
            type="email"
            placeholder="e.g. doctor@hospital.org"
            {...register("email")}
            error={errors.email?.message}
          />
        </div>

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
              : doctor
                ? "Save Changes"
                : "Create Doctor"}
          </button>
        </div>
      </form>
    </RootDialog>
  );
}
