import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/new-route",
        permanent: true,
      },
    ];
  }
};

export default nextConfig;
