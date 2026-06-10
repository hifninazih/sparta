// components/map-control-panel.tsx
"use client";

import { useMap } from "@vis.gl/react-maplibre";
import { ZoomButton } from "@/components/map/MapControls";
import { Locate, LocateFixed, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useMapStore } from "@/store/useMapStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MapControlPanel() {
  const { "sparta-map": spartaMap } = useMap();
  const { userLocation, setUserLocation } = useMapStore();
  const { recommendations, mobileSnap } = useRecommendationStore();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const [isLocating, setIsLocating] = useState(false);
  const [iconToggle, setIconToggle] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLocating) {
      interval = setInterval(() => {
        setIconToggle((prev) => !prev);
      }, 400);
    } else {
      setIconToggle(false);
    }

    return () => clearInterval(interval);
  }, [isLocating]);

  const renderLocationIcon = () => {
    if (isLocating) {
      return iconToggle ? <LocateFixed className="size-5" /> : <Locate className="size-5" />;
    }
    if (userLocation) {
      return <LocateFixed className="size-5" />;
    }
    return <Locate className="size-5" />;
  };

  const handleZoomIn = () => {
    spartaMap?.getMap().zoomIn({ duration: 400 });
  };

  const handleZoomOut = () => {
    spartaMap?.getMap().zoomOut({ duration: 400 });
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      toast.error("Lokasi tidak tersedia", {
        description: "Browser Anda tidak mendukung fitur lokasi.",
      });
      return;
    }

    setIsLocating(true);
    const toastId = toast.loading("Mencari lokasi Anda...", {
      icon: <Loader2 className="size-5 animate-spin text-black" />,
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        const hasRecs = recommendations.length > 0;

        setUserLocation([longitude, latitude]);

        spartaMap?.getMap().flyTo({
          center: [longitude, latitude],
          zoom: 17,
          duration: 2000,
          essential: true,
          padding: isDesktop
            ? { left: hasRecs ? 384 : 0, top: 0, bottom: 0, right: 0 }
            : {
                bottom: hasRecs ? window.innerHeight * (Number(mobileSnap) || 0.6) : 0,
                top: 80,
                left: 0,
                right: 0,
              },
        });

        setIsLocating(false);
        toast.dismiss(toastId);
        toast.success("Lokasi ditemukan!", {
          description: "Peta diarahkan ke posisi Anda.",
        });
      },
      (error) => {
        console.error("Gagal mendapatkan lokasi:", error);
        setIsLocating(false);
        toast.dismiss(toastId);
        toast.error("Gagal mengakses lokasi", {
          description: "Pastikan izin lokasi sudah diberikan di browser Anda.",
        });
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleLocateUser}
          disabled={isLocating}
          aria-label="Cari Lokasi Saya"
          className={cn(
            "flex items-center justify-center rounded-md border-2 border-black bg-primary p-2.5 outline-none transition-all duration-150",
            "shadow-[1px_2px_0px_rgba(0,0,0,1)]",
            "hover:-translate-x-px hover:-translate-y-0.5 hover:cursor-pointer hover:shadow-[2px_4px_0px_rgba(0,0,0,1)]",
            "active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_rgba(0,0,0,1)]",
            "disabled:pointer-events-none disabled:opacity-60",
          )}
        >
          {renderLocationIcon()}
        </button>

        <ZoomButton onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      </div>
    </>
  );
}
