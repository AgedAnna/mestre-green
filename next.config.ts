import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Imagens de promoções/ofertas vêm da API (offerImageLink)
    remotePatterns: [
      { protocol: "https", hostname: "**.mestregreen.com" },
      { protocol: "https", hostname: "media.api-sports.io" },
      // brasões dos times (seed) e bandeiras das seleções
      { protocol: "https", hostname: "**.thesportsdb.com" },
      { protocol: "https", hostname: "flagcdn.com" },
    ],

  },
};

export default nextConfig;
