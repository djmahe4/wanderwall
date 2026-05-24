import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/authHelpers";
import { profileSchema } from "@/lib/validators";
import { Timestamp } from "firebase-admin/firestore";
import { serializeUser } from "@/lib/serializers";

export async function GET(req) {
  try {
    const token = await verifyAuth(req);
    const userRef = adminDb.collection("users").doc(token.uid);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    return NextResponse.json({
      profile: serializeUser({ id: snapshot.id, ...snapshot.data() }),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req) {
  try {
    const token = await verifyAuth(req);
    const payload = profileSchema.parse(await req.json());
    const userRef = adminDb.collection("users").doc(token.uid);
    await userRef.set(
      {
        ...payload,
        updatedAt: Timestamp.now(),
      },
      { merge: true },
    );
    const snapshot = await userRef.get();
    return NextResponse.json({
      profile: serializeUser({ id: snapshot.id, ...snapshot.data() }),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update profile" }, { status: 400 });
  }
}
