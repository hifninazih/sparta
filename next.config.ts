import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/uji-usabilitas",
        destination: "https://forms.gle/MadtY7SHRXj547q38",
        permanent: false,
      },
      {
        source: "/data-wisata",
        destination:
          "https://drive.google.com/drive/folders/14qlu8Z_Usuhcbu7BYnsOOZZuTbXy3w0t?usp=sharing",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
