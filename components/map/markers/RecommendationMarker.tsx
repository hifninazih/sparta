// components/marker/RecommendationMarker.tsx
"use client";

import { cn } from "@/lib/utils";
import { useMapStore } from "@/store/useMapStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import { Marker } from "@vis.gl/react-maplibre";
import { WisataMarkerPopover } from "../WisataPopup";
import { getCategoryColor } from "@/lib/wisata-categories";

export default function RecommendationMarker() {
  const { recommendations } = useRecommendationStore();
  const { viewState, activeWisata, setActiveWisata } = useMapStore();

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
            style={{ zIndex: isOpen ? 100 : 2 }}
          >
            <WisataMarkerPopover
              wisata={wisata}
              isOpen={isOpen}
              onOpenChange={(open) => setActiveWisata(open ? wisata : null)}
            >
              <div 
                className="relative z-10 flex cursor-pointer flex-col items-center justify-center hover:scale-110 transition-transform"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
              {isZoomedIn ? (
                /* --- TAMPILAN ZOOM DEKAT (TINGGI): Angka Rank + Nama --- */
                <div 
                  className="flex h-7 items-center overflow-hidden rounded-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: getCategoryColor(wisata.category) }}
                >
                  {/* Kotak Angka (kiri) */}
                  <div
                    className={cn(
                      "flex h-full shrink-0 items-center justify-center border-r-2 border-black px-2 text-xs font-black",
                      pinColor,
                    )}
                    style={customStyle}
                  >
                    {index + 1}
                  </div>
                  {/* Teks Nama (kanan) */}
                  <span className="max-w-40 truncate px-2 text-[12px] font-bold text-black">
                    {wisata.name}
                  </span>
                </div>
              ) : (
                /* --- TAMPILAN ZOOM JAUH (RENDAH): Hanya Angka Rank --- */
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border-2 border-black text-xs font-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
                    pinColor,
                  )}
                  style={customStyle}
                >
                  {index + 1}
                </div>
              )}

              {/* Batang Pin Kecil (Tetap ada sebagai penunjuk koordinat tanah) */}
              <div className="h-2 w-0.5 bg-black"></div>
              <div className="h-1 w-1 rounded-full bg-black"></div>
            </div>
            </WisataMarkerPopover>
          </Marker>
        );
      })}
    </>
  );
}
