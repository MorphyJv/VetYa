import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ["localhost:3000", "0.0.0.0:3000", "192.168.10.147:3000"]
  }
};

export default nextConfig;
