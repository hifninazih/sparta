// components/marker/SearchAreaResultMarker.tsx
"use client";

import { useAutosuggestStore } from "@/store/useAutosuggestStore";
import { useMapStore } from "@/store/useMapStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/useSearchStore";
import { Marker } from "@vis.gl/react-maplibre";
import { WisataMarkerPopover } from "../WisataPopup";
import { getCategoryColor } from "@/lib/wisata-categories";
import { Z } from "@/lib/z-index";

export default function SearchAreaResultMarker() {
  const { recommendations } = useRecommendationStore();
  const { viewState, activeWisata, setActiveWisata } = useMapStore();
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
                <div 
                  className="relative z-10 flex cursor-pointer flex-col items-center hover:scale-110 transition-transform animate-in fade-in zoom-in duration-300"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                <div 
                  className={cn(
                    "flex items-center overflow-hidden rounded-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-out origin-center",
                    isZoomedIn ? "px-2.5 py-1 h-auto" : "h-4 w-4 justify-center px-0 py-0"
                  )}
                  style={{ backgroundColor: getCategoryColor(wisata.category) }}
                >
                  <span 
                    className={cn(
                      "truncate font-bold text-black transition-all duration-300 ease-out",
                      isZoomedIn ? "max-w-[120px] opacity-100 text-[12px]" : "max-w-0 opacity-0 text-[0px]"
                    )}
                  >
                    {wisata.name}
                  </span>
                  
                  {/* Dot (Only visible when zoomed out) */}
                  <div 
                    className={cn(
                      "shrink-0 rounded-full bg-black transition-all duration-300",
                      isZoomedIn ? "h-0 w-0 opacity-0" : "h-1 w-1 opacity-100"
                    )}
                  ></div>
                </div>

                {/* Batang Pin Tipis */}
                <div className="h-1.5 w-0.5 bg-black"></div>
              </div>
              </WisataMarkerPopover>
            </Marker>
          );
        })}
    </>
  );
}
