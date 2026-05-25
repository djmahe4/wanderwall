"use client";

import { KTU_CATEGORIES } from "@/lib/constants";

export default function KtuPointsPill({ points, category }) {
  const categoryMeta = KTU_CATEGORIES.find((item) => item.value === category);
  const colorClass = categoryMeta?.className ?? "bg-charcoal";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white ${colorClass}`}
    >
      {points} pts
      <span className="hidden text-[10px] font-medium sm:inline">
        {category}
      </span>
    </span>
  );
}
