// components/marker/GPSMarker.tsx
"use client";

import { useMapStore } from "@/store/useMapStore";
import { Marker } from "@vis.gl/react-maplibre";

export default function GPSMarker() {
  const { userLocation } = useMapStore();

  if (!userLocation) return null;

  return (
    <Marker
      longitude={userLocation[0]}
      latitude={userLocation[1]}
      rotationAlignment="map"
    >
      <div className="pointer-events-none relative flex items-center justify-center animate-in fade-in zoom-in duration-300">
        <div className="absolute h-8 w-8 animate-ping rounded-full bg-blue-600 opacity-75"></div>
        <div className="relative h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-md"></div>
      </div>
    </Marker>
  );
}
