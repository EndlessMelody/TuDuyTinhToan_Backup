"use client";

import React, { createContext, useContext, useState } from "react";
import { MOCK_USER } from "@/constants/mock-data";

export type AuthUser = typeof MOCK_USER;

interface AuthContextValue {
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (method: "google" | "email") => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
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
  const [user, setUser] = useState<AuthUser | null>(readPersistedAuth);

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
    <AuthContext.Provider value={{ isLoggedIn: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
