// components/map-control-panel.tsx
"use client";

import { useMap } from "@vis.gl/react-maplibre";
import { Button, ZoomButton } from "@/components/core/button";
import { Locate, LocateFixed } from "lucide-react";
import { useEffect, useState } from "react";
import { useMapStore } from "@/store/useMapStore";

export default function MapControlPanel() {
  const { "sparta-map": spartaMap } = useMap();
  const { userLocation, setUserLocation } = useMapStore();

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
      return iconToggle ? <LocateFixed /> : <Locate />;
    }
    if (userLocation) {
      return <LocateFixed />;
    }
    return <Locate />;
  };

  const handleZoomIn = () => {
    spartaMap?.getMap().zoomIn({ duration: 400 });
  };

  const handleZoomOut = () => {
    spartaMap?.getMap().zoomOut({ duration: 400 });
  };

  const handleLocateJogja = () => {
    spartaMap?.getMap().flyTo({
      center: [110.3695, -7.797], // Titik 0 KM Jogja
      zoom: 14,
      duration: 1500,
    });
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung fitur lokasi.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;

        setUserLocation([longitude, latitude]);

        spartaMap?.getMap().flyTo({
          center: [longitude, latitude],
          zoom: 17,
          duration: 2000,
          essential: true,
        });

        setIsLocating(false);
      },
      (error) => {
        console.error("Gagal mendapatkan lokasi:", error);
        alert("Gagal mengakses lokasi. Pastikan izin lokasi sudah diberikan.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <Button
          variant={"primary"}
          size={"rect"}
          startIcon={renderLocationIcon()}
          onClick={handleLocateUser}
          disabled={isLocating}
          aria-label="Cari Lokasi Saya"
        />

        <ZoomButton onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      </div>
    </>
  );
}
