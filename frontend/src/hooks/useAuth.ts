"use client";

import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { UserMe } from "@/types/dashboard";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<UserMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      // Gọi API Me để lấy thông tin từ PostgreSQL (yêu cầu token trong header đã được api.ts xử lý)
      const data = await apiGet<UserMe>("/api/v1/users/me");
      setUser(data);
    } catch (err: any) {
      console.error("Auth fetch failed", err);
      // Nếu 401 thì user chưa được đồng bộ hoặc chưa login
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const syncAndFetch = useCallback(async (session: any) => {
    if (!session) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 1. Gọi endpoint /sync để JIT Provisioning (Đã có token trong header của apiPost)
      await apiPost("/api/v1/auth/sync");
      // 2. Fetch lại profile đầy đủ
      await fetchUser();
    } catch (err: any) {
      console.error("Sync failed", err);
      setError(err.message || "Failed to sync user context");
      setLoading(false);
    }
  }, [fetchUser]);

  useEffect(() => {
    // 1. Kiểm tra session hiện tại
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        syncAndFetch(session);
      } else {
        setLoading(false);
      }
    });

    // 2. Lắng nghe thay đổi trạng thái auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        syncAndFetch(session);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [syncAndFetch]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { 
    user, 
    loading, 
    error, 
    refetch: fetchUser,
    signOut
  };
}
