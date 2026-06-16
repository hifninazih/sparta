// components/marker/SearchAreaResultMarker.tsx
"use client";

import * as LucideIcons from "lucide-react";
import { useAutosuggestStore } from "@/store/useAutosuggestStore";
import { useMapStore } from "@/store/useMapStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/useSearchStore";
import { Marker } from "@vis.gl/react-maplibre";
import { WisataMarkerPopover } from "../WisataPopup";
import { useCategoryStore } from "@/store/useCategoryStore";
import { Z } from "@/lib/z-index";
import { AnimatedMapMarker } from "../AnimatedMapMarker";

export default function SearchAreaResultMarker() {
  const { recommendations } = useRecommendationStore();
  const { viewState, activeWisata, setActiveWisata } = useMapStore();
  const { getCategoryColor, getCategoryIcon } = useCategoryStore();
  const { results } = useSearchStore();
  const { selectedPlace } = useAutosuggestStore();

  // PERBAIKAN LOGIKA:
  // Sembunyikan titik hijau JIKA lagi ada hasil Rekomendasi (SAW),
  // ATAU JIKA memang hasil pencariannya (BBOX) masih kosong.
  if (recommendations.length > 0 || results.length === 0) return null;

  return (
    <>
      {results
        // --- LOGIKA ANTI-DUPLIKAT (Hapus titik hijau jika sudah ada titik oranye) ---
        .filter((wisata) => {
          if (!selectedPlace) return true;
          return selectedPlace.gid !== `local-${wisata.gid}`;
        })
        .map((wisata) => {
          const isZoomedIn = viewState.zoom >= 13;
          const isOpen = activeWisata?.gid === wisata.gid;
          const iconName = getCategoryIcon(wisata.category);
          const Icon = (LucideIcons as any)[iconName] || LucideIcons.MapPin;

          return (
            <Marker
              key={`search-${wisata.gid}`}
              longitude={wisata.lng}
              latitude={wisata.lat}
              anchor="bottom"
              style={{ zIndex: isOpen ? Z.mapPopup : 1 }}
            >
              <WisataMarkerPopover
                wisata={wisata}
                isOpen={isOpen}
                onOpenChange={(open) => setActiveWisata(open ? wisata : null)}
              >
                <AnimatedMapMarker 
                  className="relative z-10 flex cursor-pointer flex-col items-center hover:scale-110 transition-transform"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                <div 
                  className={cn(
                    "flex items-center overflow-hidden rounded-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-out origin-center",
                    isZoomedIn ? "px-2 py-1 h-auto gap-1" : "h-6 w-6 justify-center p-0"
                  )}
                  style={{ backgroundColor: getCategoryColor(wisata.category) }}
                >
                  <Icon className={cn("text-black shrink-0 transition-all duration-300", isZoomedIn ? "h-3 w-3" : "h-3.5 w-3.5")} />
                  <span 
                    className={cn(
                      "truncate font-bold text-black transition-all duration-300 ease-out",
                      isZoomedIn ? "max-w-[120px] opacity-100 text-[11px]" : "max-w-0 opacity-0 text-[0px]"
                    )}
                  >
                    {wisata.name}
                  </span>
                </div>

                {/* Batang Pin Tipis */}
                <div className="h-1.5 w-0.5 bg-black"></div>
              </AnimatedMapMarker>
              </WisataMarkerPopover>
            </Marker>
          );
        })}
    </>
  );
}
