"use client";

import Container from "@/components/layout/Container";
import PendingQueue from "@/components/admin/PendingQueue";
import EventTable from "@/components/admin/EventTable";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Container className="py-12">
        <p className="text-sm text-charcoal/70">Sign in as an admin.</p>
      </Container>
    );
  }

  return (
    <Container className="py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-charcoal">
          Admin dashboard
        </h1>
        <p className="text-sm text-charcoal/70">
          Review new pins and keep the wall curated.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <PendingQueue />
        <EventTable />
      </div>
    </Container>
  );
}
