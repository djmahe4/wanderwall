import { NextResponse } from "next/server";
import crypto from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    const bodyText = await req.text();
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(bodyText)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(bodyText);
    const eventType = payload.event;
    if (!["order.paid", "payment.captured"].includes(eventType)) {
      return NextResponse.json({ received: true });
    }

    const orderId = payload.payload?.order?.entity?.id;
    const paymentId = payload.payload?.payment?.entity?.id ?? null;
    if (!orderId) {
      return NextResponse.json({ received: true });
    }

    const sponsorshipSnap = await adminDb
      .collection("sponsorships")
      .where("razorpayOrderId", "==", orderId)
      .limit(1)
      .get();
    if (sponsorshipSnap.empty) {
      return NextResponse.json({ received: true });
    }
    const sponsorshipDoc = sponsorshipSnap.docs[0];
    if (sponsorshipDoc.data().status === "completed") {
      return NextResponse.json({ received: true });
    }

    const now = Timestamp.now();
    await sponsorshipDoc.ref.set(
      {
        status: "completed",
        razorpayPaymentId: paymentId,
        completedAt: now,
      },
      { merge: true },
    );

    const sponsoredUntil = Timestamp.fromDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    );
    await adminDb.collection("events").doc(sponsorshipDoc.data().eventId).set(
      {
        isSponsored: true,
        sponsoredUntil,
        updatedAt: now,
      },
      { merge: true },
    );

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Webhook failure" }, { status: 400 });
  }
}
