import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/authHelpers";
import { serializeEvent } from "@/lib/serializers";

const DEFAULT_LIMIT = 24;
const MAX_QUERY = 500;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");
    const minCost = Number(searchParams.get("minCost") ?? 0);
    const maxCostParam = searchParams.get("maxCost");
    const maxCost = maxCostParam ? Number(maxCostParam) : null;
    const minKtu = Number(searchParams.get("minKtu") ?? 0);
    const maxKtuParam = searchParams.get("maxKtu");
    const maxKtu = maxKtuParam ? Number(maxKtuParam) : null;
    const ktuCategory = searchParams.getAll("ktuCategory");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const search = searchParams.get("search")?.toLowerCase() ?? "";
    const limit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
    const offset = Number(searchParams.get("offset") ?? 0);
    const mine = searchParams.get("mine") === "true";
    const statusOverride = searchParams.get("status");

    let submittedBy = null;
    if (mine) {
      if (!req.headers.get("authorization")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const token = await verifyAuth(req);
      submittedBy = token.uid;
    }

    let query = adminDb.collection("events");
    if (mine && submittedBy) {
      query = query.where("submittedBy", "==", submittedBy);
      if (statusOverride) {
        query = query.where("status", "==", statusOverride);
      }
    } else {
      query = query.where("status", "==", statusOverride ?? "approved");
    }

    if (location) {
      query = query.where("location", "==", location);
    }

    if (ktuCategory.length > 0) {
      query = query.where("ktuCategory", "in", ktuCategory.slice(0, 10));
    }

    query = query
      .orderBy("isSponsored", "desc")
      .orderBy("sponsoredUntil", "desc")
      .orderBy("createdAt", "desc");

    const snapshot = await query.limit(MAX_QUERY).get();
    let events = snapshot.docs.map((doc) =>
      serializeEvent({ id: doc.id, ...doc.data() }),
    );

    if (search) {
      events = events.filter((event) => {
        const haystack = `${event.title ?? ""} ${event.description ?? ""} ${
          event.tags?.join(" ") ?? ""
        }`.toLowerCase();
        return haystack.includes(search);
      });
    }

    events = events.filter((event) => {
      if (minCost && event.cost < minCost) return false;
      if (maxCost !== null && event.cost > maxCost) return false;
      if (minKtu && event.ktuPoints < minKtu) return false;
      if (maxKtu !== null && event.ktuPoints > maxKtu) return false;
      if (dateFrom && event.date) {
        const start = new Date(dateFrom);
        if (new Date(event.date) < start) return false;
      }
      if (dateTo && event.date) {
        const end = new Date(dateTo);
        if (new Date(event.date) > end) return false;
      }
      return true;
    });

    const total = events.length;
    const paginated = events.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return NextResponse.json({ events: paginated, total, hasMore });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
