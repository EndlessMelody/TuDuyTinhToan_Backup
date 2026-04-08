"use client";

import React, {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import { MOCK_USER } from "@/constants/mock-data";

export type AuthUser = typeof MOCK_USER;

interface AuthContextValue {
  isInitializing: boolean;
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (method: "google" | "email") => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isInitializing: true,
  isLoggedIn: false,
  user: null,
  login: async () => {},
  logout: () => {},
});

const STORAGE_KEY = "tastemap_auth";

function readPersistedAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true" ? MOCK_USER : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Read localStorage synchronously on first client render (safe: guarded by typeof window check)
  const [user, setUser] = useState<AuthUser | null>(readPersistedAuth);

  // isInitializing: true on the server / during SSR, false once hydrated on the client.
  // useSyncExternalStore is the React-safe way to detect client vs server without
  // calling setState inside an effect (which the React Compiler flags as a cascade).
  const isInitializing = useSyncExternalStore(
    () => () => {},
    () => false, // client snapshot: already initialised
    () => true, // server snapshot: not yet initialised
  );

  const login = async (method: "google" | "email") => {
    await new Promise((r) => setTimeout(r, method === "google" ? 800 : 1200));
    setUser(MOCK_USER);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{ isInitializing, isLoggedIn: !!user, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
