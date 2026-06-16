// components/marker/SelectedSuggestionMarker.tsx
"use client";

import { cn } from "@/lib/utils";
import { useAutosuggestStore } from "@/store/useAutosuggestStore";
import { useMapStore } from "@/store/useMapStore";
import { Marker } from "@vis.gl/react-maplibre";
import { MapPinSearch } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { WisataMarkerPopover } from "../WisataPopup";
import { useCategoryStore } from "@/store/useCategoryStore";
import { Z } from "@/lib/z-index";
import { AnimatedMapMarker } from "../AnimatedMapMarker";

export default function SelectedSuggestionMarker() {
  const { selectedPlace } = useAutosuggestStore();
  const { activeWisata, setActiveWisata } = useMapStore();
  const { categories, getCategoryColor, getCategoryIcon } = useCategoryStore();

  if (!selectedPlace) return null;

  return (
    <>
      {selectedPlace && (
        <Marker
          longitude={selectedPlace.lng}
          latitude={selectedPlace.lat}
          anchor="bottom"
          style={{ zIndex: activeWisata?.gid === selectedPlace.gid ? Z.mapPopup : 3 }}
        >
          <WisataMarkerPopover
            wisata={selectedPlace as any}
            isOpen={activeWisata?.gid === selectedPlace.gid}
            onOpenChange={(open) => setActiveWisata(open ? selectedPlace : null)}
          >
            <AnimatedMapMarker 
              className="relative z-10 flex cursor-pointer flex-col items-center hover:scale-110 transition-transform"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {/* Tooltip Nama yang Menempel (Selalu Muncul) */}
              <div className="pointer-events-none absolute -top-12 z-50 rounded-lg border-2 border-black bg-white px-3 py-1.5 text-xs font-black whitespace-nowrap shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all">
                {selectedPlace.name}
              </div>

              {/* Menggunakan warna kategori (atau Oranye jika dari OSM) agar mencolok dibandingkan marker lain */}
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 border-black",
                  "shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all",
                  "hover:-translate-y-0.5 hover:shadow-[3px_4px_0px_rgba(0,0,0,1)]",
                )}
                style={{ backgroundColor: selectedPlace.category ? getCategoryColor(selectedPlace.category) : "#FF8038" }}
              >
                {selectedPlace.category ? (() => {
                  const iconName = getCategoryIcon(selectedPlace.category);
                  const Icon = (LucideIcons as any)[iconName] || LucideIcons.MapPin;
                  return <Icon className="size-5 text-black" strokeWidth={3} />;
                })() : (
                  <MapPinSearch className="size-5 text-black" strokeWidth={3} />
                )}
              </div>

              {/* Batang Pin */}
              <div className="h-4 w-0.5 bg-black"></div>
              {/* Titik Jangkar di Tanah */}
              <div className="h-2 w-2 rounded-full bg-black"></div>
            </AnimatedMapMarker>
          </WisataMarkerPopover>
        </Marker>
      )}
    </>
  );
}
