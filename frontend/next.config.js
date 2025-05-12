// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
