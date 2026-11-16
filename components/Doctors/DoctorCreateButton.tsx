"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import DoctorModal from "./DoctorModal";

export default function DoctorCreateButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primaryColor text-whiteColor text-xs sm:text-sm font-medium hover:opacity-95 shadow-md shadow-primaryColor/20 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4 text-whiteColor" />
        <span>Add New Doctor</span>
      </button>

      {isOpen && (
        <DoctorModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSuccess={() => {
            setIsOpen(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
