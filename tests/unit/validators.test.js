import { describe, expect, it } from "vitest";
import { eventSubmissionSchema, phoneSchema } from "@/lib/validators";
import { KTU_CATEGORIES } from "@/lib/constants";

describe("validators", () => {
  it("accepts valid phone numbers", () => {
    expect(phoneSchema.safeParse("9876543210").success).toBe(true);
  });

  it("rejects invalid phone numbers", () => {
    expect(phoneSchema.safeParse("12345").success).toBe(false);
  });

  it("validates event submission payload", () => {
    const result = eventSubmissionSchema.safeParse({
      title: "Campus Hackathon",
      description: "A 24-hour coding sprint.",
      location: "kochi",
      locationDisplay: "Kochi",
      coordinates: null,
      cost: 0,
      costDisplay: "Free",
      ktuPoints: 10,
      ktuCategory: KTU_CATEGORIES[0].value,
      tags: ["Coding"],
      date: "2026-05-24T10:00:00.000Z",
      phone: "9876543210",
    });
    expect(result.success).toBe(true);
  });
});
