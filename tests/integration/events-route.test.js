import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/authHelpers", () => ({
  verifyAuth: vi.fn(() => Promise.resolve({ uid: "user-1" })),
}));

vi.mock("@/lib/firebaseAdmin", () => {
  const docs = [
    {
      id: "event-1",
      data: () => ({
        title: "Demo Event",
        description: "Community meetup",
        tags: ["Music"],
        status: "approved",
        isSponsored: false,
        sponsoredUntil: null,
        createdAt: { toDate: () => new Date("2026-05-24T10:00:00.000Z") },
        updatedAt: { toDate: () => new Date("2026-05-24T10:00:00.000Z") },
        date: { toDate: () => new Date("2026-05-30T10:00:00.000Z") },
        ktuPoints: 10,
        cost: 0,
        location: "kochi",
      }),
    },
  ];

  const query = {
    where: () => query,
    orderBy: () => query,
    limit: () => query,
    get: () => Promise.resolve({ docs }),
  };

  return {
    adminDb: {
      collection: () => query,
    },
  };
});

import { GET } from "@/app/api/events/route";

describe("GET /api/events", () => {
  it("returns events payload", async () => {
    const request = new Request("http://localhost/api/events?limit=10");
    const response = await GET(request);
    const payload = await response.json();
    expect(payload.events).toHaveLength(1);
    expect(payload.total).toBe(1);
    expect(payload.hasMore).toBe(false);
  });
});
