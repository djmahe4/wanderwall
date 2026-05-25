import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAdmin } from "@/lib/authHelpers";
import { serializeEvent } from "@/lib/serializers";

export async function GET(req) {
  try {
    await verifyAdmin(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    let query = adminDb.collection("events");
    if (status) {
      query = query.where("status", "==", status);
    }
    const snapshot = await query.orderBy("createdAt", "desc").limit(200).get();
    const events = snapshot.docs.map((doc) =>
      serializeEvent({ id: doc.id, ...doc.data() }),
    );
    return NextResponse.json({ events });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
