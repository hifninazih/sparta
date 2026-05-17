// maps/page.tsx
"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import Map, { MapProvider, MapLayerMouseEvent } from "@vis.gl/react-maplibre";

// Style and Icon
import { CircleQuestionMark } from "lucide-react";
import { cn } from "@/lib/utils";
import { satelliteStyle, streetStyle } from "@/lib/basemaps";

// UI Component
import { Button } from "@/components/button";
import { PreferensiDialog } from "@/components/preferensi-dialog";
import { RecommendationResult } from "@/components/recommendation-result";

// Komponen jadi
import BasemapsToggle from "@/components/BasemapsToggle";
import MapControlPanel from "@/components/MapControlPanel";
import SearchThisAreaButton from "@/components/SearchThisAreaButton";
import GlobalSearch from "@/components/global-search";

// Marker komponen
import MarkerGPS from "@/components/marker/GPSMarker";
import InitialMarker from "@/components/marker/InitialMarker";
import RecommendationMarker from "@/components/marker/RecommendationMarker";
import SearchAreaResultMarker from "@/components/marker/SearchAreaResultMarker";
import SelectedSuggestionMarker from "@/components/marker/SelectedSuggestionMarker";

// Store
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMapStore } from "@/store/useMapStore";
import { useWizardStore } from "@/store/useWizardStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import { useSearchStore } from "@/store/useSearchStore";
import MapCompass from "@/components/MapCompass";

export default function Maps() {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const {
    viewState,
    setViewState,
    maxZoom,
    minZoom,
    setSelectedLocation,
    isSatellite,
  } = useMapStore();
  const { isPickingLocation, setIsPickingLocation, setIsOpen, setStep } =
    useWizardStore();
  const { recommendations } = useRecommendationStore();
  const { isSearching, setShowSearchAreaBtn, showSearchAreaBtn } =
    useSearchStore();

  const handleMapClick = (event: MapLayerMouseEvent) => {
    if (!isPickingLocation) return;

    const { lng, lat } = event.lngLat;

    setSelectedLocation([lng, lat]);

    setIsPickingLocation(false);
    setStep(1);
    setIsOpen(true);
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-slate-100">
      <MapProvider>
        <Map
          id="sparta-map"
          initialViewState={viewState}
          maxZoom={maxZoom}
          minZoom={minZoom}
          onMove={(e) => setViewState(e.viewState)}
          onClick={handleMapClick}
          onDragStart={() => setShowSearchAreaBtn(true)}
          onZoomStart={() => setShowSearchAreaBtn(true)}
          style={{ width: "100%", height: "100%" }}
          mapStyle={isSatellite ? satelliteStyle : streetStyle}
          cursor={isPickingLocation ? "crosshair" : "grab"}
        >
          {/* MARKER 1: LOKASI GPS */}
          <MarkerGPS />

          {/* MARKER 2: TITIK AWAL PERJALANAN */}
          <InitialMarker />

          {/* MARKER 3: REKOMENDASI WISATA (SAW) */}
          <RecommendationMarker />

          {/* MARKER 4: HASIL PENCARIAN AREA */}
          <SearchAreaResultMarker />

          {/* MARKER 5: Hasil search query */}
          <SelectedSuggestionMarker />
        </Map>

        {/* Hasil Rekomendasi */}
        <RecommendationResult />

        {/* PANEL ATAS */}
        {/* Tombol Telusuri Top Center */}
        <div
          className={cn(
            "absolute top-20 left-1/2 z-10 flex -translate-x-1/2 transition-all duration-300 lg:top-6",
            (showSearchAreaBtn || isSearching) && recommendations.length === 0
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-10 opacity-0",
          )}
        >
          <SearchThisAreaButton />
        </div>

        {/* Input pencarian dengan fungsi baru */}
        <div className="absolute top-5 left-4 z-10 hidden w-full max-w-sm sm:block sm:w-80">
          <GlobalSearch />
        </div>

        {/* Tombol Panduan */}
        <div className="absolute top-5 right-4 z-10 hidden flex-col items-end gap-5 sm:flex">
          <Button
            variant={"primary"}
            size={"rect"}
            startIcon={<CircleQuestionMark />}
          >
            <p>Panduan</p>
          </Button>
        </div>

        <div className="absolute top-40 right-4 z-10 flex flex-col items-end gap-5">
          <MapCompass />
        </div>

        {/* PANEL ATAS MOBILE */}
        <div className="absolute top-0 left-1/2 z-10 flex w-full -translate-x-1/2 items-center justify-between gap-2 px-3 pt-4 sm:hidden">
          <GlobalSearch />
          <Button
            variant={"primary"}
            size={"rect"}
            startIcon={<CircleQuestionMark />}
          ></Button>
        </div>

        {/* =========================================
          PANEL BAWAH
      ========================================= */}
        {/* Tombol Rekomendasi Wisata */}
        <div
          className={`absolute bottom-10 left-4 z-10 flex flex-col items-end gap-5 transition-all duration-300 ${recommendations.length !== 0 && !isDesktop ? "bottom-15" : "bottom-10"}`}
        >
          <PreferensiDialog />
        </div>

        {/* MAP CONTROL */}
        <div
          className={`trasition-all absolute right-4 bottom-32 z-10 flex flex-col items-end gap-5 duration-300 sm:bottom-40 ${recommendations.length !== 0 && !isDesktop ? "bottom-37" : "bottom-32"}`}
        >
          <MapControlPanel />
        </div>

        {/* TOGGLE BASEMAPS */}
        <div
          className={`absolute right-4 z-10 flex flex-col items-end gap-5 transition-all duration-300 ${recommendations.length !== 0 && !isDesktop ? "bottom-15" : "bottom-10"}`}
        >
          <BasemapsToggle />
        </div>
      </MapProvider>
    </div>
  );
}
