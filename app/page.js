"use client";

import { useMemo, useState } from "react";
import Container from "@/components/layout/Container";
import FilterBar from "@/components/wall/FilterBar";
import MasonryGrid from "@/components/wall/MasonryGrid";
import WallEmptyState from "@/components/wall/WallEmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { QUICK_FILTERS } from "@/lib/constants";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";
import { computeWanderScore } from "@/lib/utils";

export default function Home() {
  const { profile } = useAuth();
  const [filters, setFilters] = useState({
    limit: 24,
    minKtu: 0,
    wanderMode: false,
    sort: "newest",
  });
  const [search, setSearch] = useState("");

  const { events, loading } = useEvents({
    location: filters.location,
    maxCost: filters.maxCost,
    minKtu: filters.minKtu,
    ktuCategory: filters.ktuCategory,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    limit: filters.limit,
    offset: filters.offset,
    search,
  });

  const sortedEvents = useMemo(() => {
    if (!profile || filters.sort !== "relevance") return events;
    return [...events].sort(
      (a, b) =>
        computeWanderScore(b, {
          interests: profile.interests,
          preferredLocation: profile.preferences?.preferredLocation,
          maxCost: profile.preferences?.maxCost,
          minKtuPoints: profile.preferences?.minKtuPoints,
        }) -
        computeWanderScore(a, {
          interests: profile.interests,
          preferredLocation: profile.preferences?.preferredLocation,
          maxCost: profile.preferences?.maxCost,
          minKtuPoints: profile.preferences?.minKtuPoints,
        }),
    );
  }, [events, profile, filters.sort]);

  const handleQuickFilter = (filter) => {
    if (filter.value === "today") {
      const today = new Date().toISOString().split("T")[0];
      setFilters((prev) => ({ ...prev, dateFrom: today, dateTo: today }));
    }
    if (filter.value === "week") {
      const today = new Date();
      const week = new Date(today);
      week.setDate(today.getDate() + 7);
      setFilters((prev) => ({
        ...prev,
        dateFrom: today.toISOString().split("T")[0],
        dateTo: week.toISOString().split("T")[0],
      }));
    }
    if (filter.value === "free") {
      setFilters((prev) => ({ ...prev, maxCost: 0 }));
    }
    if (filter.value === "ktu") {
      setFilters((prev) => ({ ...prev, minKtu: 50 }));
    }
  };

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden bg-gradient-to-r from-terracotta/90 via-terracotta to-teal/80 py-16 text-cream">
        <Container className="space-y-6">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em]">
            <span className="rounded-full bg-cream/20 px-3 py-1">🧭📍</span>
            Living event wall
          </div>
          <h1 className="text-4xl font-semibold">
            Wander through events. Wall-to-wall discovery.
          </h1>
          <p className="max-w-2xl text-sm text-cream/80">
            Pin your event to the wall, discover what’s happening near you, and
            earn KTU activity points along the way.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              className="w-full rounded-full border border-cream/30 bg-cream/10 px-5 py-3 text-sm text-cream placeholder:text-cream/70"
              placeholder="Search by event, club, or keyword"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="rounded-full border border-cream/30 bg-cream/10 px-5 py-3 text-sm text-cream"
              value={filters.sort}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, sort: event.target.value }))
              }
            >
              <option value="newest">Sort by Newest</option>
              <option value="relevance">Sort by Relevance</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleQuickFilter(filter)}
                className="rounded-full border border-cream/40 px-3 py-1 text-xs font-semibold text-cream/90 hover:bg-cream/10"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      <Container className="mt-8 space-y-8">
        <FilterBar filters={filters} onChange={setFilters} />
        <div className="rounded-3xl bg-corkboard p-6 shadow-inner">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-72" />
              ))}
            </div>
          ) : sortedEvents.length === 0 ? (
            <WallEmptyState />
          ) : (
            <MasonryGrid events={sortedEvents} wanderMode={filters.wanderMode} />
          )}
        </div>
      </Container>
    </div>
  );
}
