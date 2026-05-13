"use client";

import { useRecommendationStore } from "@/store/useRecommendationStore";
import { X, MapPin, Star, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

export function RecommendationSidebar() {
  const {
    recommendations,
    isLoading,
    clearRecommendations,
    activeWisataId,
    setActiveWisataId,
  } = useRecommendationStore();

  // Format ke Rupiah
  const formatRp = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format Jarak
  const formatDist = (distM: number) => {
    if (distM < 1000) return `${Math.round(distM)}m`;
    return `${(distM / 1000).toFixed(1)} km`;
  };

  if (isLoading) {
    return (
      <div className="absolute top-24 left-4 z-20 flex w-80 items-center justify-center rounded-xl border-2 border-black bg-white p-8 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
          <p className="text-sm font-bold">Menghitung matriks SAW...</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="absolute top-24 bottom-10 left-4 z-20 flex w-80 flex-col overflow-hidden rounded-xl border-2 border-black bg-slate-50 shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all sm:w-96">
      {/* Header Sidebar */}
      <div className="flex items-center justify-between border-b-2 border-black bg-[#DCFFBC] px-4 py-3">
        <div>
          <h2 className="text-lg leading-tight font-black">Top Rekomendasi</h2>
          <p className="text-xs font-semibold">Berdasarkan preferensi Anda</p>
        </div>
        <button
          onClick={clearRecommendations}
          className="rounded-md border-2 border-transparent p-1 transition-colors hover:border-black hover:bg-white"
        >
          <X className="size-5" strokeWidth={2.5} />
        </button>
      </div>

      {/* List Item */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {recommendations.map((item, index) => (
          <div
            key={item.id}
            onMouseEnter={() => setActiveWisataId(item.id)}
            onMouseLeave={() => setActiveWisataId(null)}
            className={cn(
              "group relative flex cursor-pointer flex-col gap-2 rounded-lg border-2 border-black bg-white p-3 transition-all",
              "hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]",
              activeWisataId === item.id
                ? "-translate-y-1 bg-blue-50 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                : "",
            )}
          >
            {/* Badge Ranking & Score */}
            <div className="bg-primary absolute -top-3 -right-2 flex items-center gap-1 rounded-full border-2 border-black px-2 py-0.5 text-xs font-black shadow-sm">
              <span>#{index + 1}</span>
              <span className="opacity-50">|</span>
              <span>{(item.score * 100).toFixed(1)}</span>
            </div>

            <h3 className="line-clamp-1 pr-12 text-sm font-bold">
              {item.name}
            </h3>

            <div className="grid grid-cols-2 gap-y-1 text-xs font-semibold text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                <span>{formatDist(item.distance_m)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="size-3.5 fill-yellow-400 text-yellow-500" />
                <span>{item.rating}</span>
              </div>
              <div className="col-span-2 flex items-center gap-1 text-black">
                <Ticket className="size-3.5" />
                <span>{formatRp(item.price)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
