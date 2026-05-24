import { NextResponse } from "next/server";
import { Timestamp, GeoPoint } from "firebase-admin/firestore";
import { adminDb, adminStorage } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/authHelpers";
import { eventSubmissionSchema } from "@/lib/validators";
import { slugifyLocation } from "@/lib/utils";
import sharp from "sharp";

export async function POST(req) {
  try {
    const token = await verifyAuth(req);
    const payload = eventSubmissionSchema.parse(await req.json());
    const userRef = adminDb.collection("users").doc(token.uid);
    const userSnap = await userRef.get();
    const userData = userSnap.exists ? userSnap.data() : null;
    if (!userData) {
      await userRef.set(
        {
          email: token.email ?? "",
          displayName: token.name ?? "",
          photoURL: token.picture ?? "",
          phone: null,
          interests: [],
          preferences: {
            preferredLocation: "",
            maxCost: 0,
            minKtuPoints: 0,
            ktuCategories: [],
          },
          trustedContributor: false,
          eventsSubmitted: 0,
          eventsApproved: 0,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        { merge: true },
      );
    }
    const baseUser = userData ?? {
      eventsSubmitted: 0,
      eventsApproved: 0,
      trustedContributor: false,
    };
    const trustedContributor = baseUser.trustedContributor ?? false;
    const autoApprove = process.env.TRUSTED_AUTO_APPROVE === "true";
    const status = trustedContributor && autoApprove ? "approved" : "pending";

    let posterImageUrl = payload.imageUrl ?? "";
    if (payload.posterImageBase64) {
      const match = payload.posterImageBase64.match(
        /^data:(image\/[a-zA-Z+]+);base64,(.+)$/,
      );
      if (match) {
        const buffer = Buffer.from(match[2], "base64");
        if (buffer.length > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: "Poster image exceeds 5MB limit" },
            { status: 400 },
          );
        }
        const resized = await sharp(buffer).resize({ width: 800 }).jpeg({ quality: 80 }).toBuffer();
        const bucket = adminStorage.bucket();
        const filename = `posters/${token.uid}/${Date.now()}.jpg`;
        const file = bucket.file(filename);
        await file.save(resized, {
          contentType: "image/jpeg",
          metadata: { cacheControl: "public, max-age=31536000" },
        });
        const [url] = await file.getSignedUrl({
          action: "read",
          expires: "03-01-2500",
        });
        posterImageUrl = url;
      }
    }

    const now = Timestamp.now();
    const locationSlug = slugifyLocation(payload.locationDisplay);
    const eventRef = await adminDb.collection("events").add({
      title: payload.title,
      description: payload.description,
      posterImageUrl,
      location: locationSlug,
      locationDisplay: payload.locationDisplay,
      coordinates: payload.coordinates
        ? new GeoPoint(payload.coordinates.latitude, payload.coordinates.longitude)
        : null,
      cost: payload.cost,
      costDisplay: payload.costDisplay,
      ktuPoints: payload.ktuPoints,
      ktuCategory: payload.ktuCategory,
      tags: payload.tags,
      date: Timestamp.fromDate(new Date(payload.date)),
      submittedBy: token.uid,
      submitterName: token.name ?? token.email ?? "Anonymous",
      submitterPhone: payload.phone,
      trustedContributor,
      status,
      rejectionReason: null,
      isSponsored: false,
      sponsoredUntil: null,
      viewCount: 0,
      clickCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    await adminDb.collection("activityLog").add({
      userId: token.uid,
      action: "submit_event",
      eventId: eventRef.id,
      metadata: { status },
      createdAt: now,
    });

    const updatedApproved =
      (baseUser.eventsApproved ?? 0) + (status === "approved" ? 1 : 0);
    await userRef.set(
      {
        eventsSubmitted: (baseUser.eventsSubmitted ?? 0) + 1,
        eventsApproved: updatedApproved,
        trustedContributor: updatedApproved >= 5,
        updatedAt: now,
      },
      { merge: true },
    );

    if (status === "approved") {
      const locationRef = adminDb.collection("locations").doc(locationSlug);
      const locationSnap = await locationRef.get();
      const nextCount = (locationSnap.data()?.eventCount ?? 0) + 1;
      await locationRef.set(
        {
          name: payload.locationDisplay,
          eventCount: nextCount,
          updatedAt: now,
        },
        { merge: true },
      );
    }

    return NextResponse.json({ success: true, id: eventRef.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to submit event" }, { status: 400 });
  }
}
