// components/marker/RecommendationMarker.tsx
"use client";

import { cn } from "@/lib/utils";
import { useMapStore } from "@/store/useMapStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import { Marker } from "@vis.gl/react-maplibre";
import { WisataMarkerPopover } from "../WisataPopup";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useTourStore } from "@/store/useTourStore";
import { Z } from "@/lib/z-index";
import { AnimatedMapMarker } from "../AnimatedMapMarker";

export default function RecommendationMarker() {
  const { recommendations } = useRecommendationStore();
  const { viewState, activeWisata, setActiveWisata } = useMapStore();
  const { run, stepIndex, nextStep: tourNextStep } = useTourStore();
  const { categories, getCategoryColor } = useCategoryStore();

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <>
      {recommendations.map((wisata, index) => {
        const isZoomedIn = viewState.zoom >= 13;

        // Peringkat 1 Emas, 2 Perak, 3 Perunggu, sisanya warna Kategori
        const pinColor =
          index === 0
            ? "bg-[#FFD700]"
            : index === 1
              ? "bg-[#C0C0C0]"
              : index === 2
                ? "bg-[#CD7F32]"
                : ""; // Kosong agar pakai inline style kategori

        // Style tambahan untuk rank 4 ke atas
        const customStyle = pinColor === "" ? { backgroundColor: getCategoryColor(wisata.category) } : {};

        const isOpen = activeWisata?.gid === wisata.gid;

        return (
          <Marker
            key={`saw-${wisata.gid}`}
            longitude={wisata.lng}
            latitude={wisata.lat}
            anchor="bottom"
            style={{ zIndex: isOpen ? Z.mapPopup : 2 }}
          >
            <WisataMarkerPopover
              wisata={wisata}
              isOpen={isOpen}
              onOpenChange={(open) => {
                setActiveWisata(open ? wisata : null);
              }}
            >
              <AnimatedMapMarker 
                className={cn("relative z-10 flex cursor-pointer flex-col items-center justify-center hover:scale-110 transition-transform", index === 0 && "tour-map-marker")}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div 
                  className={cn(
                    "flex items-center overflow-hidden rounded-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-out origin-center",
                    isZoomedIn ? "h-7" : "h-6"
                  )}
                  style={{ backgroundColor: isZoomedIn ? getCategoryColor(wisata.category) : "" }}
                >
                  {/* Kotak Angka (kiri) */}
                  <div
                    className={cn(
                      "flex shrink-0 items-center justify-center font-black transition-all duration-300 ease-out",
                      isZoomedIn ? "h-full w-7 border-r-2 border-black text-xs" : "h-full w-6 text-xs",
                      pinColor,
                    )}
                    style={!isZoomedIn && pinColor === "" ? { backgroundColor: getCategoryColor(wisata.category) } : customStyle}
                  >
                    {index + 1}
                  </div>
                  {/* Teks Nama (kanan) */}
                  <span 
                    className={cn(
                      "truncate font-bold text-black transition-all duration-300 ease-out",
                      isZoomedIn ? "max-w-[160px] opacity-100 px-2 text-[12px]" : "max-w-0 opacity-0 px-0 text-[0px]"
                    )}
                  >
                    {wisata.name}
                  </span>
                </div>

              {/* Batang Pin Kecil (Tetap ada sebagai penunjuk koordinat tanah) */}
              <div className="h-2 w-0.5 bg-black"></div>
              <div className="h-1 w-1 rounded-full bg-black"></div>
            </AnimatedMapMarker>
            </WisataMarkerPopover>
          </Marker>
        );
      })}
    </>
  );
}
