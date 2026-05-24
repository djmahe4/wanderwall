 "use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncProfile = async (currentUser) => {
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
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Welcome to WanderWall!");
    } catch (error) {
      console.error(error);
      toast.error("Unable to sign in");
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    toast.success("Signed out");
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      signIn: handleSignIn,
      signOut: handleSignOut,
      refreshProfile: async () => syncProfile(auth.currentUser),
    }),
    [user, profile, loading],
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
