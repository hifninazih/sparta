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
  const { recommendations, mobileSnap, setMobileSnap } = useRecommendationStore();
  const { isSearching, setShowSearchAreaBtn, showSearchAreaBtn } =
    useSearchStore();

  const handleMapInteraction = () => {
    // Jika mobile dan drawer sedang terbuka (ada rekomendasi), turunkan ke snap TERENDAH (0.25)
    if (!isDesktop && recommendations.length > 0 && mobileSnap !== null) {
      setMobileSnap(0.25); 
    }
    setShowSearchAreaBtn(true);
  };

  const handleMapClick = (event: MapLayerMouseEvent) => {
    if (!isPickingLocation) return;

    const { lng, lat } = event.lngLat;

    setSelectedLocation([lng, lat]);

    setIsPickingLocation(false);
    setStep(1);
    setIsOpen(true);
  };

  // Toleransi floating point untuk perbandingan snap
  const currentSnap = Number(mobileSnap) || 0;
  // Snap Full: 0.9
  const isSnapFull = !isDesktop && recommendations.length > 0 && currentSnap >= 0.8;
  // Snap Mid: 0.6
  const isSnapMid = !isDesktop && recommendations.length > 0 && currentSnap > 0.4 && currentSnap < 0.8;
  // Snap Low: 0.25
  const isSnapLow = !isDesktop && recommendations.length > 0 && currentSnap <= 0.4;

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
          onDragStart={handleMapInteraction}
          onZoomStart={handleMapInteraction}
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

        {/* Hasil Rekomendasi (Z-INDEX 50 via Portal di drawer.tsx) */}
        <RecommendationResult />

        {/* PANEL ATAS */}
        {/* Tombol Telusuri Top Center */}
        <div
          className={cn(
            "absolute top-20 left-1/2 z-60 flex -translate-x-1/2 transition-all duration-300 lg:top-6",
            (showSearchAreaBtn || isSearching) && recommendations.length === 0
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-10 opacity-0",
          )}
        >
          <SearchThisAreaButton />
        </div>

        {/* Input pencarian dengan z-[100] untuk memastikan di atas segalanya */}
        <div className="absolute top-5 left-4 z-[100] hidden w-full max-w-sm sm:block sm:w-80">
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

        {/* PANEL ATAS MOBILE - z-[100] untuk menjamin interaksi */}
        <div className="absolute top-0 left-1/2 z-[100] flex w-full -translate-x-1/2 items-center justify-between gap-2 px-3 pt-4 sm:hidden">
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
        {/* Tombol Rekomendasi Wisata - SEMBUNYIKAN jika ada hasil (Baik Mobile maupun Desktop) */}
        <div
          className={cn(
            "absolute bottom-10 left-4 z-10 flex flex-col items-end gap-5 transition-all duration-300",
            recommendations.length > 0 ? "pointer-events-none opacity-0" : "opacity-100"
          )}
        >
          <PreferensiDialog />
        </div>

        {/* MAP CONTROL - Z-INDEX 10 (Berada di bawah drawer z-50) */}
        <div
          className={cn(
            "absolute right-4 z-10 flex flex-col items-end gap-5 transition-all duration-300 sm:bottom-40",
            isSnapFull ? "pointer-events-none opacity-0" : "opacity-100",
            recommendations.length > 0 && !isDesktop 
              ? isSnapMid 
                  ? "bottom-[61vh]" 
                  : isSnapLow
                    ? "bottom-[26vh]" 
                    : "bottom-32"
              : "bottom-32"
          )}
        >
          <MapControlPanel />
        </div>

        {/* TOGGLE BASEMAPS - Z-INDEX 10 (Berada di bawah drawer z-50) */}
        <div
          className={cn(
            "absolute right-4 z-10 flex flex-col items-end gap-5 transition-all duration-300",
            isSnapFull ? "pointer-events-none opacity-0" : "opacity-100",
            recommendations.length > 0 && !isDesktop 
              ? isSnapMid 
                  ? "bottom-[51vh]" 
                  : isSnapLow
                    ? "bottom-[16vh]" 
                    : "bottom-10"
              : "bottom-10"
          )}
        >
          <BasemapsToggle />
        </div>
      </MapProvider>
    </div>
  );
}
