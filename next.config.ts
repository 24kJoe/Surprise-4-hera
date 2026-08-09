import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // قم بتعديل 50mb للحد الذي يناسب مشروعك (مثلاً 100mb)
    },
  },
};

export default nextConfig;