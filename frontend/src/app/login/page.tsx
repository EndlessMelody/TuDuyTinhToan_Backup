"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Column, Row, Heading, Text, Input, Button } from "@/components/OnceUI";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Đăng nhập thành công!");
      // useAuth.ts sẽ tự động nhận diện session change và gọi /sync
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Đã xảy ra lỗi khi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) toast.error(error.message);
  };

  return (
    <Row fill background="page" overflow="hidden">
      {/* Left Side: Illustration / Branding */}
      <Column
        fillHeight
        flex={1}
        background="surface"
        justify="center"
        align="center"
        padding="xl"
        position="relative"
        className="hide-s"
      >
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, var(--brand-solid) 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }}
        />
        <Column gap={24} position="relative" align="center" style={{ maxWidth: '480px' }}>
          <div className="w-16 h-16 bg-[var(--brand-solid)] rounded-[24px] flex items-center justify-center shadow-xl">
              <span className="text-white text-3xl font-bold">T</span>
          </div>
          <Column gap={8} align="center">
            <Heading variant="display-strong-m" align="center">TasteMap</Heading>
            <Text variant="body-default-l" align="center" style={{ opacity: 0.6 }}>
              Khám phá hương vị, kết nối bạn bè thông qua thuật toán AI cá nhân hóa.
            </Text>
          </Column>
          
          <Row gap={12} marginTop={32} className="opacity-40">
             <div className="px-4 py-2 border border-[var(--border-weak)] rounded-full text-xs">Vector Match</div>
             <div className="px-4 py-2 border border-[var(--border-weak)] rounded-full text-xs">Group Referee</div>
             <div className="px-4 py-2 border border-[var(--border-weak)] rounded-full text-xs">JIT Sync</div>
          </Row>
        </Column>
      </Column>

      {/* Right Side: Login Form */}
      <Column
        fillHeight
        flex={1}
        justify="center"
        align="center"
        padding="xl"
        background="page"
      >
        <Column gap={32} style={{ maxWidth: "400px", width: "100%" }}>
          <Column gap={8}>
            <Heading variant="heading-strong-xl">Chào mừng trở lại</Heading>
            <Text variant="body-default-m" style={{ opacity: 0.5 }}>
              Nhập thông tin để tiếp tục hành trình ẩm thực.
            </Text>
          </Column>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Column gap={16}>
              <Column gap={8}>
                <Text variant="body-default-s" weight="strong">Email</Text>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  required
                />
              </Column>
              <Column gap={8}>
                <Text variant="body-default-s" weight="strong">Mật khẩu</Text>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  required
                />
              </Column>
            </Column>

            <Button
              type="submit"
              fillWidth
              size="l"
              loading={loading}
              style={{ marginTop: '8px' }}
            >
              Đăng nhập
            </Button>
          </form>

          <Row align="center" gap={12} style={{ opacity: 0.3 }}>
            <div className="h-[1px] bg-[var(--border-weak)] flex-1" />
            <Text variant="body-default-xs">HOẶC</Text>
            <div className="h-[1px] bg-[var(--border-weak)] flex-1" />
          </Row>

          <Button
            variant="tertiary"
            fillWidth
            size="l"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
               <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
               <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
               <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
               <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Tiếp tục với Google
          </Button>

          <Text variant="body-default-s" align="center" style={{ opacity: 0.5 }}>
            Chưa có tài khoản? <span className="text-[var(--brand-solid)] cursor-pointer hover:underline">Tham gia ngay</span>
          </Text>
        </Column>
      </Column>

      <style jsx global>{`
        @media (max-width: 768px) {
          .hide-s { display: none !important; }
        }
      `}</style>
    </Row>
  );
}
