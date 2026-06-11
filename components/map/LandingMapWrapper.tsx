"use client";

import React from "react";
import dynamic from "next/dynamic";

// Memuat LandingMapMockup secara dinamis hanya di browser (client-side)
// untuk menghindari WebGL / window is not defined error pada Next.js Server-side Rendering (SSR)
const LandingMapMockup = dynamic(
  () => import("./LandingMapMockup"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex-1 bg-slate-100 flex items-center justify-center h-full select-none">
        <span className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">
          Memuat Peta...
        </span>
      </div>
    )
  }
);

export default function LandingMapWrapper() {
  return <LandingMapMockup />;
}
