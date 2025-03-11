import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 启用 JSON 导入
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
