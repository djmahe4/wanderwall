"use client";

import Container from "@/components/layout/Container";
import EventSubmissionForm from "@/components/forms/EventSubmissionForm";
import { useAuth } from "@/hooks/useAuth";

export default function SubmitPage() {
  const { user } = useAuth();

  return (
    <Container className="py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-charcoal">Submit an event</h1>
        <p className="text-sm text-charcoal/70">
          Pin your event to the wall. We’ll review it before it goes live.
        </p>
      </div>
      {user ? (
        <EventSubmissionForm />
      ) : (
        <div className="rounded-3xl border border-cream/60 bg-cream p-6 shadow-poster text-sm text-charcoal/70">
          Please sign in to submit events.
        </div>
      )}
    </Container>
  );
}
