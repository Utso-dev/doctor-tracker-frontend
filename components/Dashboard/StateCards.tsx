"use client";

import React from "react";
import { Skeleton } from "../ui/skeleton";

export interface StatCardItem {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendColor?: string;
}

export default function StatCards({
  statCards,
  isLoading = false,
}: {
  statCards: StatCardItem[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-whiteColor border border-borderColor flex flex-col gap-3 shadow-xs"
          >
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-16 h-8" />
            <Skeleton className="w-32 h-3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, idx) => (
        <div
          key={idx}
          className="p-4 rounded-2xl bg-whiteColor border border-borderColor/90  hover:shadow-lg transition-all duration-200 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="md:text-base text-sm font-semibold text-descriptionColor uppercase tracking-wider">
              {card.title}
            </p>
            {card.icon && (
              <div className="w-9 h-9 rounded-xl bg-bgColor flex items-center justify-center text-primaryColor  transition-colors duration-200">
                {card.icon}
              </div>
            )}
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-headerColor tracking-tight">
              {card.value}
            </h3>
            {card.subtitle && (
              <span className="text-xs font-semibold text-greenColor bg-greenColor/15 px-2 py-0.5 rounded-full">
                {card.subtitle}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
