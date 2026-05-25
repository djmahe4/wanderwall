"use client";

import { useEffect, useState } from "react";
import { KTU_CATEGORIES, COST_FILTERS } from "@/lib/constants";
import TagChip from "@/components/ui/TagChip";
import WanderModeToggle from "./WanderModeToggle";

export default function FilterBar({ filters, onChange }) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await fetch("/api/locations");
      const data = await res.json();
      setLocations(data.locations ?? []);
    };
    fetchLocations().catch(() => {});
  }, []);

  const toggleCategory = (category) => {
    const current = filters.ktuCategory ?? [];
    if (current.includes(category)) {
      onChange({ ...filters, ktuCategory: current.filter((c) => c !== category) });
    } else {
      onChange({ ...filters, ktuCategory: [...current, category] });
    }
  };

  return (
    <div className="sticky top-[72px] z-30 rounded-3xl border border-cream/60 bg-cream/90 p-4 shadow-poster backdrop-blur">
      <div className="grid gap-4 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <label className="text-xs font-semibold text-charcoal/70">Location</label>
          <select
            className="mt-1 w-full rounded-2xl border border-charcoal/10 bg-white px-3 py-2 text-sm"
            value={filters.location ?? ""}
            onChange={(event) =>
              onChange({ ...filters, location: event.target.value })
            }
          >
            <option value="">Anywhere</option>
            {locations.map((location) => (
              <option key={location.id} value={location.slug}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal/70">Cost</label>
          <select
            className="mt-1 w-full rounded-2xl border border-charcoal/10 bg-white px-3 py-2 text-sm"
            value={filters.maxCost ?? ""}
            onChange={(event) =>
              onChange({
                ...filters,
                maxCost: event.target.value ? Number(event.target.value) : "",
              })
            }
          >
            {COST_FILTERS.map((filter) => (
              <option key={filter.label} value={filter.value ?? ""}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal/70">
            Min KTU Points
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.minKtu ?? 0}
            onChange={(event) =>
              onChange({ ...filters, minKtu: Number(event.target.value) })
            }
            className="mt-2 w-full accent-teal"
          />
          <p className="text-xs text-charcoal/60">{filters.minKtu ?? 0}+ points</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal/70">Date</label>
          <div className="mt-1 grid gap-2">
            <input
              type="date"
              className="w-full rounded-2xl border border-charcoal/10 bg-white px-3 py-2 text-sm"
              value={filters.dateFrom ?? ""}
              onChange={(event) =>
                onChange({ ...filters, dateFrom: event.target.value })
              }
            />
            <input
              type="date"
              className="w-full rounded-2xl border border-charcoal/10 bg-white px-3 py-2 text-sm"
              value={filters.dateTo ?? ""}
              onChange={(event) =>
                onChange({ ...filters, dateTo: event.target.value })
              }
            />
          </div>
        </div>
        <div className="lg:col-span-2 flex flex-col justify-between gap-2">
          <div>
            <label className="text-xs font-semibold text-charcoal/70">
              KTU Category
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {KTU_CATEGORIES.map((category) => (
                <TagChip
                  key={category.value}
                  label={category.label}
                  active={(filters.ktuCategory ?? []).includes(category.value)}
                  onClick={() => toggleCategory(category.value)}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <WanderModeToggle
              enabled={filters.wanderMode ?? false}
              onToggle={(value) => onChange({ ...filters, wanderMode: value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
