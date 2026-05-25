import Razorpay from "razorpay";

let razorpayClient = null;

export function getRazorpayClient() {
  if (razorpayClient) return razorpayClient;
  razorpayClient = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  return razorpayClient;
}
