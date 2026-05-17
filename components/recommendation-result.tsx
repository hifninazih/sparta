// component/recommendation-result.tsx
"use client";

import { useState, useEffect } from "react";
import {
  useRecommendationStore,
  WisataRecommendation,
} from "@/store/useRecommendationStore";
import { X, MapPin, Star, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/drawer";
import { useMap } from "@vis.gl/react-maplibre";

interface SidebarProps {
  onSelectWisata: (wisata: WisataRecommendation) => void;
}

export function RecommendationResult() {
  const {
    recommendations,
    isLoading,
    clearRecommendations,
    activeWisataId,
    setActiveWisataId,
  } = useRecommendationStore();

  const { "sparta-map": spartaMap } = useMap();

  const isDesktop = useMediaQuery("(min-width: 640px)");

  // 1. VAUL SNAP POINTS: Gunakan Desimal [20%, 50%, 100%]
  const snapPoints = [0.2, 0.6, 1];
  const [snap, setSnap] = useState<number | string | null>(snapPoints[1]);

  // Kembalikan snap ke tengah jika data baru masuk atau dikosongkan
  useEffect(() => {
    if (recommendations.length > 0) {
      setSnap(snapPoints[1]);
    }
  }, [recommendations.length]);

  // Fungsi untuk flyTo ke titik rekomendasi
  const handleWisataSelect = (wisata: any) => {
    if (!spartaMap) return;

    spartaMap.getMap().flyTo({
      center: [wisata.lng, wisata.lat],
      zoom: 16,
      duration: 1200,
      essential: true,
      padding: isDesktop
        ? { left: 400, top: 0, bottom: 0, right: 0 } // Geser pusat ke kanan (karena ada sidebar kiri)
        : { bottom: window.innerHeight * 0.3, top: 0, left: 0, right: 0 }, // Geser pusat ke atas (karena ada laci bawah)
    });
  };

  const formatRp = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDist = (distM: number) => {
    if (distM < 1000) return `${Math.round(distM)}m`;
    return `${(distM / 1000).toFixed(1)} km`;
  };

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 z-20 flex w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border-2 border-black bg-white p-8 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
          <p className="text-sm font-bold">Mencari rekomendasi...</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  const ContentList = (
    <div className="space-y-3">
      {recommendations.map((item, index) => (
        <div
          key={item.id}
          onMouseEnter={() => isDesktop && setActiveWisataId(item.id)}
          onMouseLeave={() => isDesktop && setActiveWisataId(null)}
          onClick={() => {
            setActiveWisataId(item.id);
            handleWisataSelect(item);

            if (!isDesktop) {
              // 2. TURUNKAN LACI KE 20% (Minimize)
              setSnap(snapPoints[1]);
            }
          }}
          className={cn(
            "group relative flex cursor-pointer flex-col gap-2 rounded-lg border-2 border-black bg-white p-3 transition-all",
            "hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:scale-[0.98]",
            activeWisataId === item.id
              ? "border-blue-600 bg-blue-50 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
              : "",
          )}
        >
          <div className="bg-primary absolute -top-3 -right-2 flex items-center gap-1 rounded-full border-2 border-black px-2 py-0.5 text-xs font-black shadow-sm">
            <span>#{index + 1}</span>
            <span className="opacity-50">|</span>
            <span>{(item.score * 100).toFixed(1)}</span>
          </div>
          <h3 className="line-clamp-1 pr-12 text-sm font-bold">{item.name}</h3>
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
  );

  if (isDesktop) {
    return (
      <div className="absolute top-24 bottom-10 left-4 z-20 flex w-80 flex-col overflow-hidden rounded-xl border-2 border-black bg-slate-50 shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all lg:w-96">
        <div className="flex items-center justify-between border-b-2 border-black bg-[#DCFFBC] px-4 py-3">
          <div>
            <h2 className="text-lg leading-tight font-black">
              Top Rekomendasi
            </h2>
            <p className="text-xs font-semibold text-gray-700">
              Berdasarkan preferensi Anda
            </p>
          </div>
          <button
            onClick={clearRecommendations}
            className="rounded-md border-2 border-transparent p-1 transition-colors hover:border-black hover:bg-white"
          >
            <X className="size-5" strokeWidth={2.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{ContentList}</div>
      </div>
    );
  }

  // =========================================
  // RENDER LACI MOBILE
  // =========================================
  return (
    <Drawer
      open={recommendations.length > 0}
      onOpenChange={(open) => {
        if (!open) clearRecommendations();
      }}
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={false} // Peta tetap interaktif di belakangnya
      dismissible={false} // Laci tidak bisa di-swipe habis (harus ditutup lewat tombol X)
    >
      {/* 3. KUNCI KETINGGIAN LACI (h-[85vh]) AGAR FISIKA SNAP VAUL BEKERJA */}
      <DrawerContent className="h-[85vh] shadow-[0px_-4px_0px_rgba(0,0,0,1)]">
        <DrawerHeader className="flex flex-row items-center justify-between pb-2 text-left">
          <div>
            <DrawerTitle>Top Rekomendasi</DrawerTitle>
            <DrawerDescription>
              Geser ke atas untuk melihat list
            </DrawerDescription>
          </div>
          <button
            onClick={clearRecommendations}
            className="rounded-md border-2 border-transparent p-1 transition-colors hover:border-black hover:bg-gray-100"
          >
            <X className="size-5 text-black" strokeWidth={2.5} />
          </button>
        </DrawerHeader>

        {/* 4. AREA SCROLL */}
        <div className="overflow-y-auto p-4 pt-5 pb-10">{ContentList}</div>
      </DrawerContent>
    </Drawer>
  );
}
