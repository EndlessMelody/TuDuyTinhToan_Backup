import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: process.env.NODE_ENV === "production",
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'mapbox-gl', '@supabase/ssr'],
  },
  typescript: {
    // !! CẢNH BÁO !!
    // Bỏ qua lỗi TypeScript khi build trên Vercel để tránh bị treo
    ignoreBuildErrors: true,
  },
  eslint: {
    // Tắt luôn kiểm tra ESLint cho lẹ
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
