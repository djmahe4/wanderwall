import { z } from "zod";
import { KTU_CATEGORIES } from "./constants";

export const phoneSchema = z
  .string()
  .regex(/^(\+91)?[6-9]\d{9}$/, "Enter a valid Indian phone number");

export const eventSubmissionSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  location: z.string().min(2).max(80),
  locationDisplay: z.string().min(2).max(120),
  coordinates: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .nullable()
    .optional(),
  cost: z.number().min(0),
  costDisplay: z.string().min(2).max(40),
  ktuPoints: z.number().min(0).max(100),
  ktuCategory: z.enum(KTU_CATEGORIES.map((item) => item.value)),
  tags: z.array(z.string()).max(8),
  date: z.string(),
  imageUrl: z.string().url().optional(),
  posterImageBase64: z.string().optional(),
  phone: phoneSchema,
});

export const profileSchema = z.object({
  interests: z.array(z.string()).optional(),
  phone: phoneSchema.optional().nullable(),
  preferences: z
    .object({
      preferredLocation: z.string().optional(),
      maxCost: z.number().min(0).optional(),
      minKtuPoints: z.number().min(0).max(100).optional(),
      ktuCategories: z.array(z.string()).optional(),
    })
    .optional(),
});

export const paymentVerifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  eventId: z.string(),
});
