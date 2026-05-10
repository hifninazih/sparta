"use client";

import { useRef, useState, useEffect } from "react";
import Map, { MapRef, Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import {
  Button,
  ZoomButton,
  MapStyleToggle,
  CompassButton,
} from "@/components/button";
import { useMapStore } from "@/store/useMapStore";
import {
  Locate,
  LocateFixed,
  LogIn,
  MapPinSearch,
  Map as MapIcon,
} from "lucide-react";
import { SearchInput } from "@/components/search-input";
import { PreferensiDialog } from "@/components/preferensi-dialog";

export default function Maps() {
  const {
    viewState,
    setViewState,
    maxZoom,
    minZoom,
    userLocation,
    setUserLocation,
    isSatellite,
    toggleMapStyle,
  } = useMapStore();

  const streetStyle =
    "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

  const satelliteStyle = {
    version: 8,
    sources: {
      "esri-satellite": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        maxzoom: 18,
        attribution:
          "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      },
    },
    layers: [
      {
        id: "satellite-layer",
        type: "raster",
        source: "esri-satellite",
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  };

  const currentMapStyle = isSatellite ? satelliteStyle : streetStyle;

  const mapRef = useRef<MapRef>(null);

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

  const handleZoomIn = () => {
    mapRef.current?.getMap().zoomIn({ duration: 400 });
  };

  const handleZoomOut = () => {
    mapRef.current?.getMap().zoomOut({ duration: 400 });
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

        mapRef.current?.getMap().flyTo({
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

  const handleResetCompass = () => {
    mapRef.current?.getMap().easeTo({
      bearing: 0,
      pitch: 0,
      duration: 500,
    });
  };

  const renderLocationIcon = () => {
    if (isLocating) {
      return iconToggle ? <LocateFixed /> : <Locate />;
    }
    if (userLocation) {
      return <LocateFixed />;
    }
    return <Locate />;
  };

  const handleSearchSubmit = (keyword: string) => {
    console.log("Mencari wisata dengan kata kunci:", keyword);
    // Di sini kamu bisa memanggil API pencarian atau filter data GeoJSON
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-slate-100">
      <Map
        ref={mapRef}
        initialViewState={viewState}
        maxZoom={maxZoom}
        minZoom={minZoom}
        onMove={(e) => setViewState(e.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle={currentMapStyle}
      >
        {userLocation && (
          <Marker longitude={userLocation[0]} latitude={userLocation[1]}>
            <div className="relative flex items-center justify-center">
              <div className="absolute h-8 w-8 animate-ping rounded-full bg-blue-600 opacity-75"></div>
              <div className="relative h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-md"></div>
            </div>
          </Marker>
        )}
      </Map>

      {/* =========================================
          PANEL ATAS
      ========================================= */}
      {/* Judul web */}
      <div className="absolute top-0 left-0 z-10 hidden flex-col items-end gap-5 select-none sm:flex">
        <div className="bg-primary flex items-center gap-4 rounded-br-2xl border-r-2 border-b-4 p-3">
          <MapIcon />
          <div className="flex flex-col">
            <h1 className="font-bold">SPARTA</h1>
            <p className="text-sm">Sistem Pemetaan dan Rekomendasi Wisata</p>
          </div>
        </div>
      </div>

      {/* Input pencarian */}
      <div className="absolute top-5 left-1/2 z-10 hidden w-full -translate-x-1/2 sm:block sm:max-w-md">
        <SearchInput
          onSearch={handleSearchSubmit}
          // Bisa ditambahkan properti input standar lainnya
          // onChange={(e) => console.log(e.target.value)}
        />
      </div>

      {/* Tombol Login */}
      <div className="absolute top-5 right-4 z-10 hidden flex-col items-end gap-5 sm:flex">
        <Button variant={"primary"} size={"lg"} startIcon={<LogIn />}>
          <p>Login</p>
        </Button>
      </div>

      <div className="absolute top-40 right-4 z-10 flex flex-col items-end gap-5">
        {(viewState.bearing !== 0 || viewState.pitch !== 0) && (
          <CompassButton
            onReset={handleResetCompass}
            bearing={viewState.bearing}
          />
        )}
      </div>

      {/* =========================================
          PANEL ATAS MOBILE
      ========================================= */}
      <div className="absolute top-0 left-1/2 z-10 flex w-full -translate-x-1/2 items-center justify-between gap-2 px-3 pt-4 sm:hidden">
        <SearchInput
          onSearch={handleSearchSubmit}
          // Bisa ditambahkan properti input standar lainnya
          // onChange={(e) => console.log(e.target.value)}
        />
        <Button
          variant={"primary"}
          size={"rect"}
          startIcon={<LogIn />}
        ></Button>
      </div>

      {/* =========================================
          PANEL BAWAH
      ========================================= */}
      {/* Tombol Rekomendasi Wisata */}
      <div className="absolute bottom-10 left-4 z-10 flex flex-col items-end gap-5">
        <PreferensiDialog>
          <Button variant={"gradient"} size={"lg"} startIcon={<MapPinSearch />}>
            Rekomendasi Wisata
          </Button>
        </PreferensiDialog>
      </div>

      {/* Tombol Cari Lokasi dan Zoom */}
      <div className="absolute right-4 bottom-32 z-10 flex flex-col items-end gap-5 sm:bottom-35">
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
      </div>

      {/* Toggle Basemap */}
      <div className="absolute right-4 bottom-10 z-10 flex flex-col items-end gap-5">
        <MapStyleToggle isSatellite={isSatellite} onToggle={toggleMapStyle} />
      </div>
    </div>
  );
}
