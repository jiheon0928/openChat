/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://34.225.172.232:3000/:path*",
      },
      {
        source: "/api/socket.io/:path*",
        destination: "http://34.225.172.232:3000/socket.io/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
