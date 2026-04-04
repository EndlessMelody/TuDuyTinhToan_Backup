"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Column, Row, Heading, Text } from "@/components/OnceUI";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Supabase's auth.onAuthStateChange or getSession will handle the hash/code in the URL
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error exchanging code for session:", error.message);
        router.push("/login?error=" + encodeURIComponent(error.message));
        return;
      }

      if (session) {
        // useAuth.ts hook in DashboardLayout will pick up this session and call /sync
        router.push("/");
      } else {
        // Fallback for no session
        router.push("/login");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <Row fill background="page" align="center" justify="center">
      <Column padding="xl" gap={16} align="center">
        <div className="w-12 h-12 border-4 border-[var(--brand-solid)] border-t-transparent rounded-full animate-spin" />
        <Heading variant="heading-strong-m">Đang xác thực bảo mật...</Heading>
        <Text variant="body-default-s" style={{ opacity: 0.5 }}>
          Vui lòng đợi trong giây lát khi chúng tôi kết nối tài khoản.
        </Text>
      </Column>
    </Row>
  );
}
