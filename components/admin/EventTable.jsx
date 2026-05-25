"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { formatEventDate } from "@/lib/utils";

export default function EventTable() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEvents(data.events ?? []);
    };
    fetchEvents().catch(() => {});
  }, [user]);

  return (
    <div className="rounded-3xl border border-cream/60 bg-cream p-6 shadow-poster">
      <h3 className="text-lg font-semibold text-charcoal">All events</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase text-charcoal/60">
              <th className="pb-2">Title</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/10">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="py-2 font-semibold text-charcoal">{event.title}</td>
                <td className="py-2 text-charcoal/70">{event.status}</td>
                <td className="py-2 text-charcoal/70">
                  {formatEventDate(event.date)}
                </td>
                <td className="py-2 text-charcoal/70">{event.locationDisplay}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 ? (
          <p className="mt-3 text-sm text-charcoal/60">No events yet.</p>
        ) : null}
      </div>
    </div>
  );
}
