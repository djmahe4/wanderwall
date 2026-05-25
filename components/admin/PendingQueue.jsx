"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export default function PendingQueue() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [rejections, setRejections] = useState({});

  const fetchPending = useCallback(async () => {
    if (!user) return;
    const token = await user.getIdToken();
    const res = await fetch("/api/admin/events?status=pending", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setEvents(data.events ?? []);
  }, [user]);

  useEffect(() => {
    fetchPending().catch(() => {});
  }, [fetchPending]);

  const handleAction = async (eventId, status) => {
    if (!user) return;
    const token = await user.getIdToken();
    await fetch(`/api/admin/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
        rejectionReason: rejections[eventId] ?? "",
      }),
    });
    fetchPending();
  };

  return (
    <div className="rounded-3xl border border-cream/60 bg-cream p-6 shadow-poster">
      <h3 className="text-lg font-semibold text-charcoal">Pending review</h3>
      <div className="mt-4 space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-2xl border border-charcoal/10 bg-white p-4"
          >
            <p className="font-semibold text-charcoal">{event.title}</p>
            <p className="text-xs text-charcoal/60">
              {event.submitterName} · {event.submitterPhone}
            </p>
            <textarea
              placeholder="Optional rejection reason"
              className="mt-3 w-full rounded-2xl border border-charcoal/10 px-3 py-2 text-xs"
              value={rejections[event.id] ?? ""}
              onChange={(eventValue) =>
                setRejections((prev) => ({
                  ...prev,
                  [event.id]: eventValue.target.value,
                }))
              }
            />
            <div className="mt-3 flex gap-2">
              <Button onClick={() => handleAction(event.id, "approved")}>
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAction(event.id, "rejected")}
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
        {events.length === 0 ? (
          <p className="text-sm text-charcoal/60">No pending events.</p>
        ) : null}
      </div>
    </div>
  );
}
