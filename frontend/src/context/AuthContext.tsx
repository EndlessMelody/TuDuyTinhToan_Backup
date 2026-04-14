"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useSyncExternalStore,
} from "react";
import {
  authApi,
  type UserData,
  type LoginRequest,
  type RegisterRequest,
} from "@/lib/api";

interface AuthContextValue {
  isInitializing: boolean;
  isLoggedIn: boolean;
  user: UserData | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isInitializing: true,
  isLoggedIn: false,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null,
  clearError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authApi.isAuthenticated()) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch {
          // Token invalid, clear it
          authApi.logout();
        }
      }
    };
    checkAuth();
  }, []);

  // isInitializing: true on the server / during SSR, false once hydrated on the client.
  const isInitializing = useSyncExternalStore(
    () => () => {},
    () => false, // client snapshot: already initialised
    () => true, // server snapshot: not yet initialised
  );

  const clearError = () => setError(null);

  const login = async (credentials: LoginRequest) => {
    setError(null);
    try {
      const response = await authApi.login(credentials);
      setUser(response.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    }
  };

  const register = async (data: RegisterRequest) => {
    setError(null);
    try {
      const response = await authApi.register(data);
      setUser(response.user);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isInitializing,
        isLoggedIn: !!user,
        user,
        login,
        register,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
