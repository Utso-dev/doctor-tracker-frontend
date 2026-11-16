"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Calendar, RotateCcw, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DoctorService } from "@/service/doctor/doctor.service";

interface DoctorFiltersProps {
  specializations?: string[];
}

export default function DoctorFilters({
  specializations = [],
}: DoctorFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Dynamic specializations loaded from created doctors
  const [specializationList, setSpecializationList] = useState<string[]>(
    specializations || []
  );

  // Keep specialization list fresh
  useEffect(() => {
    if (specializations && specializations.length > 0) {
      setSpecializationList(specializations);
    } else {
      DoctorService.getSpecializations()
        .then((res) => {
          if (res.data?.success && Array.isArray(res.data.data)) {
            setSpecializationList(res.data.data);
          }
        })
        .catch((err) => console.error("Error fetching specializations:", err));
    }
  }, [specializations]);

  // Local state for smooth typing in search input
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const isFirstRender = useRef(true);

  // Sync searchTerm when URL searchParam changes (e.g. back/forward or reset)
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  // Helper to update frontend URL search parameters
  const updateUrlParams = useCallback(
    (newParams: Record<string, string | number | undefined | null>) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, val]) => {
        if (
          val === undefined ||
          val === null ||
          val === "" ||
          val === "All Specializations"
        ) {
          current.delete(key);
        } else {
          current.set(key, String(val));
        }
      });

      const searchStr = current.toString();
      router.push(`${pathname}${searchStr ? `?${searchStr}` : ""}`, {
        scroll: false,
      });
    },
    [searchParams, pathname, router]
  );

  // Debounced search input
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const currentParam = searchParams.get("search") || "";
      if (searchTerm.trim() !== currentParam) {
        updateUrlParams({
          search: searchTerm.trim() || undefined,
          page: 1, // Reset to page 1 on new search
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, updateUrlParams]);

  const resetFilters = () => {
    setSearchTerm("");
    router.push(pathname);
  };

  const currentSpecialization =
    searchParams.get("specialization") || "All Specializations";
  const currentStartDate = searchParams.get("startDate") || "";
  const currentEndDate = searchParams.get("endDate") || "";

  return (
    <div className="bg-whiteColor p-4 rounded-2xl border border-borderColor shadow-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input with taller height (h-11) */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-grayColor1 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, hospital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm rounded-xl border border-borderColor focus:border-primaryColor outline-none transition-all text-headerColor bg-whiteColor placeholder:text-grayColor1/80"
          />
        </div>

        {/* Shadcn Select with Dynamic Specializations */}
        <div>
          <Select
            value={currentSpecialization}
            onValueChange={(val) =>
              updateUrlParams({ specialization: val, page: 1 })
            }
          >
            <SelectTrigger className="w-full h-11 px-3.5 text-xs sm:text-sm rounded-xl border border-borderColor bg-whiteColor text-headerColor focus:ring-0 focus:border-primaryColor">
              <SelectValue placeholder="All Specializations" />
            </SelectTrigger>
            <SelectContent className="bg-whiteColor border border-borderColor rounded-xl shadow-lg max-h-60">
              <SelectItem
                value="All Specializations"
                className="text-xs sm:text-sm cursor-pointer text-headerColor"
              >
                All Specializations
              </SelectItem>
              {specializationList.map((spec) => (
                <SelectItem
                  key={spec}
                  value={spec}
                  className="text-xs sm:text-sm cursor-pointer text-headerColor"
                >
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date range - Start */}
        <div className="relative">
          <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-grayColor1 pointer-events-none" />
          <input
            type="date"
            value={currentStartDate}
            onChange={(e) =>
              updateUrlParams({ startDate: e.target.value, page: 1 })
            }
            className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm rounded-xl border border-borderColor focus:border-primaryColor outline-none transition-all text-headerColor bg-whiteColor"
          />
        </div>

        {/* Date range - End & Reset */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-grayColor1 pointer-events-none" />
            <input
              type="date"
              value={currentEndDate}
              onChange={(e) =>
                updateUrlParams({ endDate: e.target.value, page: 1 })
              }
              className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm rounded-xl border border-borderColor focus:border-primaryColor outline-none transition-all text-headerColor bg-whiteColor"
            />
          </div>
          <button
            type="button"
            onClick={resetFilters}
            title="Reset Filters"
            className="h-11 w-11 shrink-0 flex items-center justify-center rounded-xl border border-borderColor hover:bg-bgColor text-descriptionColor hover:text-headerColor transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
