import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/authHelpers";

export async function GET(req) {
  try {
    const token = await verifyAuth(req);
    const snapshot = await adminDb
      .collection("sponsorships")
      .where("userId", "==", token.uid)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();
    const sponsorships = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json({ sponsorships });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch history" }, { status: 400 });
  }
}
