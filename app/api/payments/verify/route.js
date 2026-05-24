import { NextResponse } from "next/server";
import crypto from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/authHelpers";
import { paymentVerifySchema } from "@/lib/validators";

export async function POST(req) {
  try {
    const token = await verifyAuth(req);
    const payload = paymentVerifySchema.parse(await req.json());
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${payload.razorpay_order_id}|${payload.razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== payload.razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const sponsorshipSnap = await adminDb
      .collection("sponsorships")
      .where("razorpayOrderId", "==", payload.razorpay_order_id)
      .limit(1)
      .get();
    if (sponsorshipSnap.empty) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const sponsorshipDoc = sponsorshipSnap.docs[0];
    if (sponsorshipDoc.data().userId !== token.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (sponsorshipDoc.data().eventId !== payload.eventId) {
      return NextResponse.json({ error: "Event mismatch" }, { status: 400 });
    }
    if (sponsorshipDoc.data().status === "completed") {
      return NextResponse.json({ success: true });
    }
    const sponsorshipRef = sponsorshipDoc.ref;

    const now = Timestamp.now();
    await sponsorshipRef.set(
      {
        razorpayPaymentId: payload.razorpay_payment_id,
        razorpaySignature: payload.razorpay_signature,
        status: "completed",
        completedAt: now,
      },
      { merge: true },
    );

    const sponsoredUntil = Timestamp.fromDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    );
    await adminDb.collection("events").doc(payload.eventId).set(
      {
        isSponsored: true,
        sponsoredUntil,
        updatedAt: now,
      },
      { merge: true },
    );

    await adminDb.collection("activityLog").add({
      userId: token.uid,
      action: "purchase_sponsorship",
      eventId: payload.eventId,
      metadata: {},
      createdAt: now,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to verify payment" }, { status: 400 });
  }
}
