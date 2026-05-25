import { describe, expect, it } from "vitest";
import { computeWanderScore, formatCost, slugifyLocation } from "@/lib/utils";

describe("utils", () => {
  it("slugifies locations for matching", () => {
    expect(slugifyLocation("Thiruvananthapuram City")).toBe(
      "thiruvananthapuram-city",
    );
  });

  it("formats cost values", () => {
    expect(formatCost(0)).toBe("Free");
    expect(formatCost(200)).toBe("₹200");
  });

  it("computes wander score using preferences", () => {
    const score = computeWanderScore(
      {
        tags: ["Music", "Dance"],
        location: "kochi",
        cost: 0,
        ktuPoints: 20,
      },
      {
        interests: ["Music"],
        preferredLocation: "Kochi",
        maxCost: 100,
        minKtuPoints: 10,
      },
    );
    expect(score).toBeGreaterThanOrEqual(25);
  });
});
