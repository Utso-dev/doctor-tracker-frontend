"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface PaginationPageProps {
  totalPages: number;
  onPageChange?: (page: number) => void;
  dataLength?: number;
  currentPage?: number;
  setItemsPerPage?: (count: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

function PaginationPage({
  totalPages,
  onPageChange,
  dataLength,
  currentPage,
  setItemsPerPage,
  totalItems,
  itemsPerPage,
}: PaginationPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Resolve current active page and limit (fallback to URL params or defaults)
  const activePage =
    currentPage ?? (Number(searchParams.get("page")) || 1);
  const activeLimit =
    itemsPerPage ?? (Number(searchParams.get("limit")) || 10);
  const effectiveDataLength =
    dataLength ?? (typeof totalItems === "number" ? totalItems : 0);

  const getPagination = () => {
    let pages: (number | string)[] = [];
    if (totalPages <= 7) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (activePage <= 3) {
        pages = [1, 2, 3, 4, "...", totalPages];
      } else if (activePage >= totalPages - 2) {
        pages = [
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        pages = [
          1,
          "...",
          activePage - 1,
          activePage,
          activePage + 1,
          "...",
          totalPages,
        ];
      }
    }
    return pages;
  };

  const effectiveTotalItems =
    typeof totalItems === "number" ? totalItems : effectiveDataLength;
  const startIndex =
    effectiveDataLength > 0 ? (activePage - 1) * activeLimit + 1 : 0;
  const endIndex = Math.min(activePage * activeLimit, effectiveTotalItems);

  // Handle page change (uses custom callback or auto-syncs to URL)
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    if (onPageChange) {
      onPageChange(page);
    } else {
      const current = new URLSearchParams(searchParams.toString());
      current.set("page", String(page));
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    }
  };

  // Handle items per page change (uses custom callback or auto-syncs to URL)
  const handleItemsPerPageChange = (count: number) => {
    if (setItemsPerPage) {
      setItemsPerPage(count);
    } else {
      const current = new URLSearchParams(searchParams.toString());
      current.set("limit", String(count));
      current.set("page", "1");
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    }
  };

  const originalArray = [1, 5, 10, 25, 50, 100];
  const uniqueArray = [
    ...new Set([activeLimit, ...originalArray]),
  ].sort((a, b) => a - b);

  return (
    <div className="py-2">
      <div className="flex justify-end">
        {totalPages > 0 && (
          <div className="flex flex-col sm:flex-row items-center w-full justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePageChange(activePage - 1)}
                disabled={activePage === 1}
                className="px-2.5 py-1.5 flex justify-center items-center border border-borderColor text-headerColor rounded-lg hover:bg-bgColor disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <MdArrowBackIosNew size={13} />
              </button>
              {getPagination().map((page, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    typeof page === "number" && handlePageChange(page)
                  }
                  disabled={page === "..."}
                  className={`min-w-[32px] h-8 px-2 rounded-lg cursor-pointer text-xs font-semibold transition-all ${
                    page === activePage
                      ? "bg-primaryColor text-whiteColor shadow-xs"
                      : page === "..."
                      ? "text-grayColor1 cursor-default"
                      : "text-descriptionColor hover:bg-bgColor border border-borderColor"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handlePageChange(activePage + 1)}
                disabled={activePage === totalPages}
                className="px-2.5 py-1.5 flex justify-center items-center border border-borderColor text-headerColor rounded-lg hover:bg-bgColor disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <MdArrowForwardIos size={13} />
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-descriptionColor">
              <div>
                Showing{" "}
                <span className="font-semibold text-headerColor">
                  {startIndex}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-headerColor">
                  {endIndex}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-headerColor">
                  {effectiveTotalItems}
                </span>{" "}
                entries
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-descriptionColor">Rows:</label>
                <Select
                  value={String(activeLimit)}
                  onValueChange={(value) =>
                    handleItemsPerPageChange(Number(value))
                  }
                >
                  <SelectTrigger className="w-[68px] h-8 text-xs border border-borderColor bg-whiteColor text-headerColor">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-whiteColor border border-borderColor">
                    {uniqueArray.map((opt) => (
                      <SelectItem
                        key={opt}
                        value={String(opt)}
                        className="text-xs text-headerColor"
                      >
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaginationPage;
