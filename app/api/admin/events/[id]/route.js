import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAdmin } from "@/lib/authHelpers";
import { slugifyLocation } from "@/lib/utils";

export async function PUT(req, { params }) {
  try {
    await verifyAdmin(req);
    const { status, rejectionReason } = await req.json();
    const eventRef = adminDb.collection("events").doc(params.id);
    const snapshot = await eventRef.get();
    if (!snapshot.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const event = snapshot.data();
    const now = Timestamp.now();
    const updatedStatus = status ?? event.status;
    await eventRef.set(
      {
        status: updatedStatus,
        rejectionReason: updatedStatus === "rejected" ? rejectionReason ?? "" : null,
        updatedAt: now,
      },
      { merge: true },
    );

    if (updatedStatus === "approved") {
      const locationSlug = slugifyLocation(event.locationDisplay);
      const locationRef = adminDb.collection("locations").doc(locationSlug);
      const locationSnap = await locationRef.get();
      const nextCount = (locationSnap.data()?.eventCount ?? 0) + 1;
      await locationRef.set(
        {
          name: event.locationDisplay,
          eventCount: nextCount,
          updatedAt: now,
        },
        { merge: true },
      );

      const userRef = adminDb.collection("users").doc(event.submittedBy);
      const userSnap = await userRef.get();
      const eventsApproved = (userSnap.data()?.eventsApproved ?? 0) + 1;
      const trustedContributor = eventsApproved >= 5;
      await userRef.set(
        {
          eventsApproved,
          trustedContributor,
          updatedAt: now,
        },
        { merge: true },
      );
      await eventRef.set(
        {
          trustedContributor,
        },
        { merge: true },
      );

      await adminDb.collection("activityLog").add({
        userId: event.submittedBy,
        action: "event_approved",
        eventId: snapshot.id,
        metadata: {},
        createdAt: now,
      });
    }

    if (updatedStatus === "rejected") {
      await adminDb.collection("activityLog").add({
        userId: event.submittedBy,
        action: "event_rejected",
        eventId: snapshot.id,
        metadata: { reason: rejectionReason ?? "" },
        createdAt: now,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update event" }, { status: 400 });
  }
}
