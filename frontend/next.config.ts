// next.config.ts (혹은 next.config.js)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  srcDir: "src",
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "http://34.225.172.232:3000/auth/:path*",
      },
      {
        source: "/api/chat/:path*",
        destination: "http://34.225.172.232:3000/chat/:path*",
      },
    ];
  },
};

export default nextConfig;
