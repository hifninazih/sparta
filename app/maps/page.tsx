// maps/page.tsx
"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import Map, { MapProvider, MapLayerMouseEvent } from "@vis.gl/react-maplibre";
import { useRef, useCallback, useEffect, useState } from "react";

// Style dan icon
import { CircleQuestionMark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Z } from "@/lib/z-index";
import { satelliteStyle, streetStyle } from "@/lib/basemaps";

// UI Component
import { Button } from "@/components/core/button";
import { PreferensiDialog } from "@/components/shared/preferensi-dialog";
import { RecommendationResult } from "@/components/shared/recommendation-result";

// Komponen jadi
import BasemapsToggle from "@/components/map/BasemapsToggle";
import MapControlPanel from "@/components/map/MapControlPanel";
import GlobalSearch from "@/components/search/global-search";

// Marker komponen
import MarkerGPS from "@/components/map/markers/GPSMarker";
import InitialMarker from "@/components/map/markers/InitialMarker";
import RecommendationMarker from "@/components/map/markers/RecommendationMarker";
import SearchAreaResultMarker from "@/components/map/markers/SearchAreaResultMarker";
import SelectedSuggestionMarker from "@/components/map/markers/SelectedSuggestionMarker";

// Store
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMapStore } from "@/store/useMapStore";
import { useWizardStore } from "@/store/useWizardStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import { useSearchStore } from "@/store/useSearchStore";
import MapCompass from "@/components/map/MapCompass";

export default function Maps() {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const {
    viewState,
    setViewState,
    maxZoom,
    minZoom,
    setSelectedLocation,
    isSatellite,
    activeWisata,
    setActiveWisata,
  } = useMapStore();
  const { isPickingLocation, setIsPickingLocation, setIsOpen, setStep } =
    useWizardStore();
  const { recommendations, mobileSnap, setMobileSnap } =
    useRecommendationStore();
  const { selectedCategories, executeSearch, isSearching } = useSearchStore();
  const [showLoading, setShowLoading] = useState(false);

  // Mencegah flickering loading indicator pada koneksi cepat (hanya tampil jika request > 250ms)
  useEffect(() => {
    if (isSearching) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [isSearching]);

  // --- DEBOUNCE SEMI-LIVE SEARCH (selalu aktif) ---
  const liveSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const liveRef = useRef({
    viewState,
    selectedCategories,
    executeSearch,
    recommendations,
  });
  liveRef.current = {
    viewState,
    selectedCategories,
    executeSearch,
    recommendations,
  };

  const triggerLiveSearch = useCallback(() => {
    if (liveSearchTimer.current) clearTimeout(liveSearchTimer.current);

    liveSearchTimer.current = setTimeout(async () => {
      const { viewState, selectedCategories, executeSearch, recommendations } =
        liveRef.current;

      // Jangan jalankan search area jika sedang ada rekomendasi (SAW) aktif
      if (recommendations.length > 0) return;

      const { longitude, latitude, zoom } = viewState;

      const degPerPixel = 360 / (256 * Math.pow(2, zoom));
      const halfW = degPerPixel * (window.innerWidth / 2) * 1.2;
      const halfH = degPerPixel * (window.innerHeight / 2) * 1.2;

      await executeSearch("", selectedCategories, {
        minLng: longitude - halfW,
        minLat: latitude - halfH,
        maxLng: longitude + halfW,
        maxLat: latitude + halfH,
      });
    }, 200);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Jalankan pencarian live saat mount pertama kali ATAU ketika kategori terpilih berubah
  useEffect(() => {
    if (recommendations.length > 0) return;
    triggerLiveSearch();
  }, [selectedCategories, recommendations.length, triggerLiveSearch]);

  const handleMapInteraction = () => {
    // Jika mobile dan drawer sedang terbuka (ada rekomendasi), turunkan ke snap TERENDAH (0.25)
    if (!isDesktop && recommendations.length > 0 && mobileSnap !== null) {
      setMobileSnap(0.25);
    }
  };

  const handleMapClick = (event: MapLayerMouseEvent) => {
    if (activeWisata) {
      setActiveWisata(null);
    }

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
  const isSnapFull =
    !isDesktop && recommendations.length > 0 && currentSnap >= 0.8;
  // Snap Mid: 0.6
  const isSnapMid =
    !isDesktop &&
    recommendations.length > 0 &&
    currentSnap > 0.4 &&
    currentSnap < 0.8;
  // Snap Low: 0.25
  const isSnapLow =
    !isDesktop && recommendations.length > 0 && currentSnap <= 0.4;

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-slate-100">
      <MapProvider>
        <Map
          id="sparta-map"
          initialViewState={viewState}
          maxZoom={maxZoom}
          minZoom={minZoom}
          onMove={(e) => {
            setViewState(e.viewState);
            triggerLiveSearch();
          }}
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

        {/* Loading Indicator (Pill) di Tengah Atas */}
        {showLoading && (
          <div
            style={{ zIndex: Z.searchAreaBtn }}
            className="animate-in fade-in slide-in-from-top-2 absolute top-24 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border-2 border-black bg-[#DCFFBC] px-3.5 py-1.5 text-xs font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] duration-200"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-black"></span>
            </span>
            <span className="text-[9px] font-black tracking-widest text-black uppercase">
              Menelusuri Area...
            </span>
          </div>
        )}

        {/* Hasil Rekomendasi (Z-INDEX: recommendationPanel = 20) */}
        <RecommendationResult />

        {/* =========================================
            PANEL ATAS — DESKTOP
        ========================================= */}
        {/* Input pencarian desktop */}
        <div
          style={{ zIndex: Z.searchInput }}
          className="absolute top-5 left-4 hidden w-full max-w-sm sm:block sm:w-80"
        >
          <GlobalSearch />
        </div>

        {/* Tombol Panduan desktop */}
        <div
          style={{ zIndex: Z.mapControls }}
          className="absolute top-5 right-4 hidden flex-col items-end gap-5 sm:flex"
        >
          <Button
            variant={"primary"}
            size={"rect"}
            startIcon={<CircleQuestionMark />}
          >
            <p>Panduan</p>
          </Button>
        </div>

        {/* Kompas — hanya muncul saat bearing/pitch bukan nol */}
        <div
          style={{ zIndex: Z.mapControls }}
          className="absolute top-40 right-4 flex flex-col items-end gap-5"
        >
          <MapCompass />
        </div>

        {/* =========================================
            PANEL ATAS — MOBILE
        ========================================= */}
        <div
          style={{ zIndex: Z.searchInput }}
          className="absolute top-0 left-1/2 flex w-full -translate-x-1/2 items-center justify-between gap-2 px-3 pt-4 sm:hidden"
        >
          <GlobalSearch />
          <Button
            variant={"primary"}
            size={"rect"}
            startIcon={<CircleQuestionMark />}
          />
        </div>

        {/* =========================================
            PANEL BAWAH
        ========================================= */}
        {/* Tombol Rekomendasi Wisata — sembunyikan jika ada hasil */}
        <div
          style={{ zIndex: Z.mapControls }}
          className={cn(
            "absolute bottom-10 left-4 flex flex-col items-end gap-5 transition-all duration-300",
            recommendations.length > 0
              ? "pointer-events-none opacity-0"
              : "opacity-100",
          )}
        >
          <PreferensiDialog />
        </div>

        {/* MAP CONTROL (zoom + locate) */}
        <div
          style={{ zIndex: Z.mapControls }}
          className={cn(
            "absolute right-4 flex flex-col items-end gap-5 transition-all duration-300 sm:bottom-40",
            isSnapFull ? "pointer-events-none opacity-0" : "opacity-100",
            recommendations.length > 0 && !isDesktop
              ? isSnapMid
                ? "bottom-[61vh]"
                : isSnapLow
                  ? "bottom-[26vh]"
                  : "bottom-32"
              : "bottom-32",
          )}
        >
          <MapControlPanel />
        </div>

        {/* TOGGLE BASEMAPS */}
        <div
          style={{ zIndex: Z.mapControls }}
          className={cn(
            "absolute right-4 flex flex-col items-end gap-5 transition-all duration-300",
            isSnapFull ? "pointer-events-none opacity-0" : "opacity-100",
            recommendations.length > 0 && !isDesktop
              ? isSnapMid
                ? "bottom-[51vh]"
                : isSnapLow
                  ? "bottom-[16vh]"
                  : "bottom-10"
              : "bottom-10",
          )}
        >
          <BasemapsToggle />
        </div>
      </MapProvider>
    </div>
  );
}
