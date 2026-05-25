import { Timestamp } from "firebase-admin/firestore";

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value.toDate) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return null;
};

export function serializeEvent(event) {
  return {
    ...event,
    date: toDate(event.date),
    sponsoredUntil: toDate(event.sponsoredUntil),
    createdAt: toDate(event.createdAt),
    updatedAt: toDate(event.updatedAt),
  };
}

export function serializeUser(user) {
  return {
    ...user,
    createdAt: toDate(user.createdAt),
    updatedAt: toDate(user.updatedAt),
  };
}
