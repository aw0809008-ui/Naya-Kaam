import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Allow preview sandbox host domain
  allowedDevOrigins: ["*.e2b.app", "localhost:3000"],
};

export default nextConfig;
