"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export default function AdvertisePage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch("/api/events?mine=true&status=approved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEvents(data.events ?? []);
    };
    const fetchHistory = async () => {
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch("/api/payments/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHistory(data.sponsorships ?? []);
    };
    fetchEvents().catch(() => {});
    fetchHistory().catch(() => {});
  }, [user]);

  const handlePayment = async () => {
    if (!user || !selected) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: selected }),
      });
      const data = await res.json();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "WanderWall",
        description: "Featured placement",
        order_id: data.orderId,
        handler: async (response) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...response, eventId: selected }),
          });
          if (!verifyRes.ok) {
            toast.error("Payment verification failed.");
          } else {
            toast.success("Your event is now featured!");
          }
        },
        theme: { color: "#2A9D8F" },
      };
      if (!window.Razorpay) {
        toast.error("Razorpay is not loaded yet.");
        return;
      }
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error("Unable to start checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-12 space-y-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div>
        <h1 className="text-3xl font-semibold text-charcoal">Advertise</h1>
        <p className="text-sm text-charcoal/70">
          ₹499 for 30 days of featured placement at the top of the wall.
        </p>
      </div>
      {!user ? (
        <p className="text-sm text-charcoal/70">Sign in to advertise events.</p>
      ) : (
        <div className="space-y-6">
          <div className="rounded-3xl border border-cream/60 bg-cream p-6 shadow-poster">
            <label className="text-xs font-semibold text-charcoal/70">
              Choose an event
            </label>
            <select
              className="mt-2 w-full rounded-2xl border border-charcoal/10 px-3 py-2"
              value={selected}
              onChange={(event) => setSelected(event.target.value)}
            >
              <option value="">Select an event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
            <div className="mt-4 flex justify-end">
              <Button onClick={handlePayment} disabled={!selected || loading}>
                {loading ? "Opening..." : "Boost My Event"}
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-cream/60 bg-cream p-6 shadow-poster">
            <h3 className="text-lg font-semibold text-charcoal">
              Purchase history
            </h3>
            <div className="mt-4 space-y-2 text-sm text-charcoal/70">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-charcoal/10 bg-white px-4 py-3"
                >
                  <span>Order {item.razorpayOrderId}</span>
                  <span className="font-semibold uppercase">{item.status}</span>
                </div>
              ))}
              {history.length === 0 ? (
                <p>No sponsorships yet.</p>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
