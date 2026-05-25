"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/layout/Container";
import EventDetailHero from "@/components/event/EventDetailHero";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import Badge from "@/components/ui/Badge";

export default function EventDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const headers = {};
      if (user) {
        const token = await user.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch(`/api/events/${params.id}`, { headers });
      const data = await res.json();
      setEvent(data.event ?? null);
      setLoading(false);
    };
    fetchEvent().catch(() => setLoading(false));
  }, [params.id, user]);

  if (loading) {
    return (
      <Container className="py-12">
        <p className="text-sm text-charcoal/60">Loading event...</p>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container className="py-12">
        <p className="text-sm text-charcoal/60">Event not found.</p>
      </Container>
    );
  }

  return (
    <Container className="py-12 space-y-8">
      <EventDetailHero event={event} />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-cream/60 bg-cream p-6 shadow-poster">
          <h2 className="text-lg font-semibold text-charcoal">About the event</h2>
          <p className="mt-3 text-sm text-charcoal/70">{event.description}</p>
        </div>
        <div className="rounded-3xl border border-cream/60 bg-cream p-6 shadow-poster space-y-4">
          <h3 className="text-lg font-semibold text-charcoal">Interested?</h3>
          <p className="text-sm text-charcoal/70">
            Save this event and get reminders as the date approaches.
          </p>
          <Button>Interested</Button>
          {event.isSponsored ? (
            <Badge className="bg-teal/10 text-teal">
              Promoted by {event.submitterName}
            </Badge>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
