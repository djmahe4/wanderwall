import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/authHelpers";
import { Timestamp } from "firebase-admin/firestore";
import { serializeUser } from "@/lib/serializers";

export async function POST(req) {
  try {
    const token = await verifyAuth(req);
    const userRef = adminDb.collection("users").doc(token.uid);
    const snapshot = await userRef.get();
    const now = Timestamp.now();
    if (!snapshot.exists) {
      await userRef.set({
        email: token.email ?? "",
        displayName: token.name ?? "",
        photoURL: token.picture ?? "",
        phone: null,
        interests: [],
        preferences: {
          preferredLocation: "",
          maxCost: 0,
          minKtuPoints: 0,
          ktuCategories: [],
        },
        trustedContributor: false,
        eventsSubmitted: 0,
        eventsApproved: 0,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      await userRef.set(
        {
          displayName: token.name ?? "",
          photoURL: token.picture ?? "",
          updatedAt: now,
        },
        { merge: true },
      );
    }
    const refreshed = await userRef.get();
    return NextResponse.json({
      profile: serializeUser({ id: refreshed.id, ...refreshed.data() }),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to sync user" }, { status: 401 });
  }
}
