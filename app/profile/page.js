"use client";

import Container from "@/components/layout/Container";
import ProfileEditor from "@/components/forms/ProfileEditor";
import { useAuth } from "@/hooks/useAuth";
import Badge from "@/components/ui/Badge";
import Image from "next/image";

export default function ProfilePage() {
  const { user, profile } = useAuth();

  if (!user) {
    return (
      <Container className="py-12">
        <p className="text-sm text-charcoal/70">Sign in to view your profile.</p>
      </Container>
    );
  }

  return (
    <Container className="py-12 space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-cream/60 bg-cream p-6 shadow-poster sm:flex-row sm:items-center">
        <Image
          src={user.photoURL || "/avatar-placeholder.svg"}
          alt={user.displayName || "User"}
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            {user.displayName}
          </h1>
          <p className="text-sm text-charcoal/70">{user.email}</p>
          {profile?.trustedContributor ? (
            <Badge className="mt-2 bg-teal/10 text-teal">
              Trusted Contributor
            </Badge>
          ) : null}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-cream/60 bg-cream p-6 shadow-poster">
          <h3 className="text-sm font-semibold text-charcoal">Stats</h3>
          <p className="mt-2 text-xs text-charcoal/70">
            Events submitted: {profile?.eventsSubmitted ?? 0}
          </p>
          <p className="text-xs text-charcoal/70">
            Events approved: {profile?.eventsApproved ?? 0}
          </p>
        </div>
        <div className="lg:col-span-2">
          <ProfileEditor />
        </div>
      </div>
    </Container>
  );
}
