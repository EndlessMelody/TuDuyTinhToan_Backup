import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: process.env.NODE_ENV === "production",
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'mapbox-gl', '@supabase/ssr'],
  },
};

export default nextConfig;
