import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Imagens de promoções/ofertas vêm da API (offerImageLink)
    remotePatterns: [
      { protocol: "https", hostname: "**.mestregreen.com" },
      { protocol: "https", hostname: "media.api-sports.io" },
    ],
  },
};

export default nextConfig;
