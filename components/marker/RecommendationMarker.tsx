// components/marker/RecommendationMarker.tsx
"use client";

import { cn } from "@/lib/utils";
import { useMapStore } from "@/store/useMapStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import { Marker } from "@vis.gl/react-maplibre";

export default function RecommendationMarker() {
  const { recommendations } = useRecommendationStore();
  const { viewState } = useMapStore();

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <>
      {recommendations.map((wisata, index) => {
        const isZoomedIn = viewState.zoom >= 13;

        // Peringkat 1 Emas, 2 Perak, 3 Perunggu, sisanya warna Primary
        const pinColor =
          index === 0
            ? "bg-[#FFD700]"
            : index === 1
              ? "bg-[#E3E4E5]"
              : index === 2
                ? "bg-[#CD7F32]"
                : "bg-primary";

        return (
          <Marker
            key={`saw-${wisata.id}`}
            longitude={wisata.lng}
            latitude={wisata.lat}
            anchor="bottom"
          >
            <div className="relative z-10 flex flex-col items-center justify-center">
              {isZoomedIn ? (
                /* --- TAMPILAN ZOOM DEKAT (TINGGI): Angka Rank + Nama --- */
                <div className="flex h-7 items-center overflow-hidden rounded-full border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  {/* Kotak Angka (kiri) */}
                  <div
                    className={cn(
                      "flex h-full shrink-0 items-center justify-center border-r-2 border-black px-2 text-xs font-black",
                      pinColor,
                    )}
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
                >
                  {index + 1}
                </div>
              )}

              {/* Batang Pin Kecil (Tetap ada sebagai penunjuk koordinat tanah) */}
              <div className="h-2 w-0.5 bg-black"></div>
              <div className="h-1 w-1 rounded-full bg-black"></div>
            </div>
          </Marker>
        );
      })}
    </>
  );
}
