 "use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { getClientAuth, getGoogleProvider } from "@/lib/firebase";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncProfile = useCallback(async (currentUser) => {
    if (!currentUser) return;
    const token = await currentUser.getIdToken();
    const res = await fetch("/api/user/sync", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error("Failed to sync profile");
    }
    const data = await res.json();
    setProfile(data.profile);
  }, []);

  useEffect(() => {
    const authInstance = getClientAuth();
    if (!authInstance) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await syncProfile(currentUser);
        } catch (error) {
          console.error(error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [syncProfile]);

  const handleSignIn = async () => {
    const authInstance = getClientAuth();
    if (!authInstance) {
      toast.error("Firebase is not configured.");
      return;
    }
    try {
      await signInWithPopup(authInstance, getGoogleProvider());
      toast.success("Welcome to WanderWall!");
    } catch (error) {
      console.error(error);
      toast.error("Unable to sign in");
    }
  };

  const handleSignOut = async () => {
    const authInstance = getClientAuth();
    if (!authInstance) return;
    await signOut(authInstance);
    toast.success("Signed out");
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      signIn: handleSignIn,
      signOut: handleSignOut,
      refreshProfile: async () => {
        const authInstance = getClientAuth();
        if (!authInstance) return;
        await syncProfile(authInstance.currentUser);
      },
    }),
    [user, profile, loading, syncProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
