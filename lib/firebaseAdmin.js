import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!key) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is not set. Add it to your environment variables.",
    );
  }

  const serviceAccount = JSON.parse(key);
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  return initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export const adminDb = new Proxy(
  {},
  {
    get(_, prop) {
      return getFirestore(getAdminApp())[prop];
    },
  },
);

export const adminAuth = new Proxy(
  {},
  {
    get(_, prop) {
      return getAuth(getAdminApp())[prop];
    },
  },
);

export const adminStorage = new Proxy(
  {},
  {
    get(_, prop) {
      return getStorage(getAdminApp())[prop];
    },
  },
);
