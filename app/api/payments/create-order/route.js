import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/authHelpers";
import { getRazorpayClient } from "@/lib/razorpay";

export async function POST(req) {
  try {
    const token = await verifyAuth(req);
    const { eventId } = await req.json();
    if (!eventId) {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
    }

    const eventSnap = await adminDb.collection("events").doc(eventId).get();
    if (!eventSnap.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    const event = eventSnap.data();
    if (event.submittedBy !== token.uid || event.status !== "approved") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const amountInr = Number(process.env.ADVERTISEMENT_PRICE_INR ?? 499);
    const amount = amountInr * 100;
    const client = getRazorpayClient();
    const order = await client.orders.create({
      amount,
      currency: "INR",
      receipt: `ww_${eventId}_${Date.now()}`,
      notes: {
        eventId,
        userId: token.uid,
      },
    });

    await adminDb.collection("sponsorships").add({
      eventId,
      userId: token.uid,
      razorpayOrderId: order.id,
      razorpayPaymentId: null,
      razorpaySignature: null,
      amount,
      durationDays: 30,
      status: "pending",
      createdAt: Timestamp.now(),
      completedAt: null,
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create order" }, { status: 400 });
  }
}
