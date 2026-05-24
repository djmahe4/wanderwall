"use client";

import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";

export function useEvents(filters = {}) {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(filters.search ?? "");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries({ ...filters, search: debouncedSearch }).forEach(
      ([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        if (Array.isArray(value)) {
          value.forEach((item) => params.append(key, item));
          return;
        }
        params.append(key, String(value));
      },
    );
    return params.toString();
  }, [filters, debouncedSearch]);

  useEffect(() => {
    let active = true;
    const fetchEvents = async () => {
      setLoading(true);
      const res = await fetch(`/api/events?${queryString}`);
      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await res.json();
      if (active) {
        setEvents(data.events ?? []);
        setTotal(data.total ?? 0);
        setHasMore(Boolean(data.hasMore));
        setLoading(false);
      }
    };
    fetchEvents().catch(() => {
      if (active) {
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [queryString]);

  return { events, total, hasMore, loading };
}
