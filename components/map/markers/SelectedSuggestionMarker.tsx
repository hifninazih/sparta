// components/marker/SelectedSuggestionMarker.tsx
"use client";

import { cn } from "@/lib/utils";
import { useAutosuggestStore } from "@/store/useAutosuggestStore";
import { Marker } from "@vis.gl/react-maplibre";
import { MapPinSearch } from "lucide-react";

export default function SelectedSuggestionMarker() {
  const { selectedPlace } = useAutosuggestStore();

  if (!selectedPlace) return null;

  return (
    <>
      {selectedPlace && (
        <Marker
          longitude={selectedPlace.lng}
          latitude={selectedPlace.lat}
          anchor="bottom"
        >
          <div className="group animate-in fade-in slide-in-from-top-4 relative z-50 flex cursor-pointer flex-col items-center duration-300">
            {/* Tooltip Nama yang Menempel (Selalu Muncul) */}
            <div className="pointer-events-none absolute -top-12 z-50 rounded-lg border-2 border-black bg-white px-3 py-1.5 text-xs font-black whitespace-nowrap shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all">
              {selectedPlace.name}
            </div>

            {/* Pin Shape Soft Neo-brutalism */}
            {/* Menggunakan warna Oranye (#FF8038) agar mencolok dibandingkan marker lain */}
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 border-black",
                "shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all",
                "hover:-translate-y-0.5 hover:shadow-[3px_4px_0px_rgba(0,0,0,1)]",
                "bg-[#FF8038]",
              )}
            >
              <MapPinSearch className="size-5 text-black" strokeWidth={3} />
            </div>

            {/* Batang Pin */}
            <div className="h-4 w-0.5 bg-black"></div>
            {/* Titik Jangkar di Tanah */}
            <div className="h-2 w-2 rounded-full bg-black"></div>
          </div>
        </Marker>
      )}
    </>
  );
}
