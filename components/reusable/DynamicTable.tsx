"use client";

import Image from "next/image";
import React from "react";
import Loader from "./Loader";

export interface ColumnConfig {
  label: React.ReactNode;
  width?: any;
  accessor: string;
  formatter?: (value: any, row: any) => React.ReactNode;
}

export interface DynamicTableProps {
  columns: any;
  data: any[];
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onView?: (row: any) => void;
  onDelete?: (id: any) => void;
  noDataMessage?: string;
  totalpage?: number;
  totalItems?: number;
  setItemsPerPage?: (n: number) => void;
  loading?: boolean;
  error?: string;
  border?: boolean;
  renderFooter?: (colSpan: number) => React.ReactNode;
}

export default function DynamicTable({
  columns,
  data,
  border = true,
  loading = false,
  onView,
  onDelete,
  noDataMessage = "No data found!",
  error,
  renderFooter,
}: DynamicTableProps) {
  return (
    <div className="w-full">
      {/* Table Wrapper with Border & Radius */}
      <div
        className={` overflow-hidden ${border ? "" : ""
          }`}
      >
        <div className={`overflow-auto bg-whiteColor ${border ? "p-2" : ""}`}>
          <table
            className={`min-w-[1000px] w-full text-left bg-whiteColor ${border ? "p-2" : ""
              }`}
          >
            <thead className="sticky top-0 text-whiteColor  overflow-hidden p-2">
              <tr>
                {columns.map((col: any, index: number) => (
                  <th
                    key={index}
                    style={{ width: col.width || "auto" }}
                    className={`${index === 0
                      ? "rounded-l-xl"
                      : index === columns.length - 1 && !onView && !onDelete
                        ? "rounded-r-xl"
                        : ""
                      } px-4 py-4 text-xs font-semibold uppercase tracking-wider bg-primaryColor text-whiteColor `}
                  >
                    {col.label}
                  </th>
                ))}
                {(onView || onDelete) && (
                  <th className="rounded-r-xl px-4 py-4 text-xs font-semibold uppercase tracking-wider bg-primaryColor text-whiteColor ">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-borderColor">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (onView || onDelete ? 1 : 0)}
                    className="px-4 py-12 text-center text-descriptionColor text-sm"
                  >
                    <Loader />
                  </td>
                </tr>
              ) : data?.length > 0 ? (
                data.map((row, i) => (
                  <tr key={i} className="hover:bg-bgColor/50 transition-colors">
                    {columns.map((col: any, idx: number) => (
                      <td
                        key={idx}
                        style={{ width: col.width || "auto" }}
                        className="px-4 py-3.5 text-sm text-descriptionColor"
                      >
                        {col.formatter
                          ? col.formatter(row[col.accessor], row)
                          : row[col.accessor] ?? "—"}
                      </td>
                    ))}
                    {(onView || onDelete) && (
                      <td className="px-4 py-3.5 text-sm text-descriptionColor">
                        {onView && (
                          <button
                            type="button"
                            onClick={() => onView(row)}
                            className="mr-2"
                            title="View"
                          >
                            <Image
                              src="/icons/view.svg"
                              alt="View"
                              width={16}
                              height={16}
                              className="cursor-pointer"
                            />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(row._id || row.id)}
                            className="mr-2"
                            title="Delete"
                          >
                            <Image
                              src="/icons/delete.svg"
                              alt="Delete"
                              width={16}
                              height={16}
                              className="cursor-pointer"
                            />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (onView || onDelete ? 1 : 0)}
                    className="px-4 py-12 text-center text-descriptionColor text-sm"
                  >
                    {error ? (
                      <p className="text-redColor text-base font-semibold">
                        {error}
                      </p>
                    ) : (
                      <p className="text-base text-grayColor1 font-medium">
                        {noDataMessage}
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
            {renderFooter && (
              <tfoot>
                {renderFooter(columns.length + (onView || onDelete ? 1 : 0))}
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
