import { adminAuth } from "./firebaseAdmin";

export async function verifyAuth(req) {
  const header = req.headers.get("authorization");
  if (!header) {
    throw new Error("Missing authorization header");
  }

  const token = header.startsWith("Bearer ")
    ? header.replace("Bearer ", "")
    : null;
  if (!token) {
    throw new Error("Invalid authorization header");
  }

  return adminAuth.verifyIdToken(token);
}

export async function verifyAdmin(req) {
  const decoded = await verifyAuth(req);
  const adminUids = process.env.ADMIN_UIDS
    ? process.env.ADMIN_UIDS.split(",").map((uid) => uid.trim())
    : [];
  if (!adminUids.includes(decoded.uid)) {
    throw new Error("Forbidden");
  }
  return decoded;
}
