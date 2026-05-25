import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/authHelpers";
import { Timestamp } from "firebase-admin/firestore";
import { serializeEvent } from "@/lib/serializers";

export async function GET(req, { params }) {
  try {
    const eventRef = adminDb.collection("events").doc(params.id);
    const snapshot = await eventRef.get();
    if (!snapshot.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const event = serializeEvent({ id: snapshot.id, ...snapshot.data() });

    let token = null;
    if (req.headers.get("authorization")) {
      token = await verifyAuth(req);
    }

    if (event.status !== "approved" && (!token || token.uid !== event.submittedBy)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await eventRef.set(
      {
        viewCount: (event.viewCount ?? 0) + 1,
        updatedAt: Timestamp.now(),
      },
      { merge: true },
    );
    if (token) {
      await adminDb.collection("activityLog").add({
        userId: token.uid,
        action: "view_event",
        eventId: event.id,
        metadata: {},
        createdAt: Timestamp.now(),
      });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}
