import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  }
  // ,experimental: {
  //   cpus: 2,
  // },
};

export default nextConfig;
