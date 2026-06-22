import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/uji-usabilitas",
        destination: "https://forms.gle/MadtY7SHRXj547q38",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
