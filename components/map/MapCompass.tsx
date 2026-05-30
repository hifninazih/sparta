// components/MapCompass.tsx
"use client";

import { useMap } from "@vis.gl/react-maplibre";
import { useMapStore } from "@/store/useMapStore";
import { Compass } from "lucide-react";
import { Button, CompassButtonComponent } from "@/components/core/button";

import { cn } from "@/lib/utils";

export default function MapCompass() {
  const { "sparta-map": spartaMap } = useMap();

  // Ambil state bearing dan pitch dari Zustand
  const { viewState } = useMapStore();
  const { bearing, pitch } = viewState;

  // Logika kemunculan: Hanya muncul jika peta sedang tidak menghadap Utara (0) atau tidak datar (0)
  const isVisible = bearing !== 0 || pitch !== 0;

  // Logika Reset
  const handleResetCompass = () => {
    spartaMap?.getMap().easeTo({
      bearing: 0,
      pitch: 0,
      duration: 500,
    });
  };

  if (!isVisible) return null;

  return (
    <>
      <CompassButtonComponent
        bearing={bearing}
        pitch={pitch}
        onReset={handleResetCompass}
      />
    </>
  );
}
