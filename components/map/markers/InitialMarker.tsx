// components/marker/InitialMarker.tsx
"use client";

import { useMapStore } from "@/store/useMapStore";
import { Marker } from "@vis.gl/react-maplibre";
import { MapPin } from "lucide-react";

export default function InitialMarker() {
  const { selectedLocation } = useMapStore();

  if (!selectedLocation) return null;

  return (
    <>
      {selectedLocation && (
        <Marker
          longitude={selectedLocation[0]}
          latitude={selectedLocation[1]}
          anchor="bottom"
        >
          <div
            tabIndex={0}
            className="group relative z-20 flex cursor-pointer flex-col items-center transition-transform outline-none hover:scale-110 active:scale-95 animate-in fade-in zoom-in duration-300"
          >
            {/* Tooltip Keterangan */}
            <div className="pointer-events-none absolute -top-10 flex origin-bottom scale-0 flex-col items-center rounded-md border-2 border-black bg-white px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-200 ease-out group-hover:scale-100 group-focus:scale-100">
              <span className="text-xs font-bold whitespace-nowrap text-black">
                Titik Awal Perjalanan
              </span>
            </div>

            {/* Ikon Pin Merah */}
            <div className="text-red-600 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              <MapPin className="size-10 fill-red-100" strokeWidth={2} />
            </div>
          </div>
        </Marker>
      )}
    </>
  );
}
