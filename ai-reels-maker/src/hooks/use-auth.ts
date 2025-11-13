"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import {
  firebaseConfigured,
  listenToUser,
  signInWithGoogle,
  signOutUser,
} from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = firebaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return () => {};
    }
    const unsub = listenToUser((next) => {
      setUser(next);
      setLoading(false);
    });
    return () => unsub();
  }, [configured]);

  const login = useCallback(async () => {
    if (!configured) {
      console.warn("Firebase auth not configured. Skipping login.");
      return;
    }
    try {
      setLoading(true);
      const nextUser = await signInWithGoogle();
      setUser(nextUser);
    } finally {
      setLoading(false);
    }
  }, [configured]);

  const logout = useCallback(async () => {
    if (!configured) {
      return;
    }
    try {
      setLoading(true);
      await signOutUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [configured]);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: Boolean(user),
    configured,
  };
}
