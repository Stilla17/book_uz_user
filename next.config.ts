import type { NextConfig } from "next";
import initializeBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = initializeBundleAnalyzer({
  enabled: process.env.BUNDLE_ANALYZER_ENABLED === "true",
});

const nextConfig: NextConfig = {
  distDir: "build",
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "backend.book.uz" },

      // ✅ qo‘shildi (Uzcard/Humo)
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
