import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection("locations")
      .orderBy("eventCount", "desc")
      .limit(200)
      .get();
    const locations = snapshot.docs.map((doc) => ({
      id: doc.id,
      slug: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json({ locations });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch locations" }, { status: 500 });
  }
}
