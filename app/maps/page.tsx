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
import { Locate, LocateFixed, LogIn, MapPinSearch } from "lucide-react";

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

      <div className="absolute gap-5 items-end flex-col flex left-4 top-5 z-10 ">
        <Button variant={"gradient"} size={"lg"} startIcon={<MapPinSearch />}>
          Rekomendasi Wisata
        </Button>
      </div>

      <div className="absolute gap-5 items-end flex-col flex right-4 top-5 z-10 ">
        <Button variant={"primary"} size={"lg"} startIcon={<LogIn />}>
          Login
        </Button>
      </div>

      <div className="absolute gap-5 items-end flex-col flex right-4 top-40 z-10 ">
        {(viewState.bearing !== 0 || viewState.pitch !== 0) && (
          <CompassButton
            onReset={handleResetCompass}
            bearing={viewState.bearing}
          />
        )}
      </div>

      <div className="absolute gap-5 items-end flex-col flex right-4 bottom-35 z-10 ">
        <div className="flex gap-2 flex-col items-center">
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

      <div className="absolute gap-5 items-end flex-col flex right-4 bottom-10 z-10 ">
        <MapStyleToggle isSatellite={isSatellite} onToggle={toggleMapStyle} />
      </div>
    </div>
  );
}
