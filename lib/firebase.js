import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp() {
  // Only initialize when a real API key is present (skip during SSR/build without env vars)
  if (!firebaseConfig.apiKey) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let _auth = null;
let _googleProvider = null;
let _db = null;
let _storage = null;

export function getClientAuth() {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!_auth) _auth = getAuth(app);
  return _auth;
}

export function getClientDb() {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!_db) _db = getFirestore(app);
  return _db;
}

export function getClientStorage() {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!_storage) _storage = getStorage(app);
  return _storage;
}

export function getGoogleProvider() {
  if (!_googleProvider) _googleProvider = new GoogleAuthProvider();
  return _googleProvider;
}

// Convenience lazy singletons kept for backward-compat
export const auth = new Proxy(
  {},
  {
    get(_, prop) {
      const instance = getClientAuth();
      if (!instance) return undefined;
      const value = instance[prop];
      return typeof value === "function" ? value.bind(instance) : value;
    },
  },
);
export const googleProvider = new Proxy(
  {},
  {
    get(_, prop) {
      const instance = getGoogleProvider();
      const value = instance[prop];
      return typeof value === "function" ? value.bind(instance) : value;
    },
  },
);
export const db = new Proxy(
  {},
  {
    get(_, prop) {
      const instance = getClientDb();
      if (!instance) return undefined;
      const value = instance[prop];
      return typeof value === "function" ? value.bind(instance) : value;
    },
  },
);
export const storage = new Proxy(
  {},
  {
    get(_, prop) {
      const instance = getClientStorage();
      if (!instance) return undefined;
      const value = instance[prop];
      return typeof value === "function" ? value.bind(instance) : value;
    },
  },
);
