// components/marker/SearchAreaResultMarker.tsx
"use client";

import { useAutosuggestStore } from "@/store/useAutosuggestStore";
import { useMapStore } from "@/store/useMapStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import { useSearchStore } from "@/store/useSearchStore";
import { Marker } from "@vis.gl/react-maplibre";
import { WisataMarkerPopover } from "../WisataPopup";
import { getCategoryColor } from "@/lib/wisata-categories";

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
              style={{ zIndex: isOpen ? 100 : 1 }}
            >
              <WisataMarkerPopover
                wisata={wisata}
                isOpen={isOpen}
                onOpenChange={(open) => setActiveWisata(open ? wisata : null)}
              >
                <div 
                  className="relative z-10 flex cursor-pointer flex-col items-center hover:scale-110 transition-transform"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                {isZoomedIn ? (
                  /* --- TAMPILAN ZOOM DEKAT --- */
                  <div 
                    className="flex items-center rounded-full border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    style={{ backgroundColor: getCategoryColor(wisata.category) }}
                  >
                    <span className="max-w-30 truncate text-[12px] font-bold text-black">
                      {wisata.name}
                    </span>
                  </div>
                ) : (
                  /* --- TAMPILAN ZOOM JAUH --- */
                  <div 
                    className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    style={{ backgroundColor: getCategoryColor(wisata.category) }}
                  >
                    <div className="h-1 w-1 rounded-full bg-black"></div>
                  </div>
                )}

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
