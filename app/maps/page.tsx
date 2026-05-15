// maps/page.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import Map, {
  MapLayerMouseEvent,
  MapRef,
  Marker,
} from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import {
  Button,
  ZoomButton,
  MapStyleToggle,
  CompassButton,
} from "@/components/button";
import { useMapStore } from "@/store/useMapStore";
import {
  Loader2,
  Locate,
  LocateFixed,
  MapPin,
  MapPinSearch,
  RotateCw,
  CircleQuestionMark,
} from "lucide-react";
import { PreferensiDialog } from "@/components/preferensi-dialog";
import { RecommendationSidebar } from "@/components/recommendation-sidebar";
import { GlobalSearch } from "@/components/global-search";

import { UnifiedSearchResult } from "@/app/api/search/route";

import { useWizardStore } from "@/store/useWizardStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/useSearchStore";

export default function Maps() {
  const [showSearchAreaBtn, setShowSearchAreaBtn] = useState(false);
  const [selectedPlace, setSelectedPlace] =
    useState<UnifiedSearchResult | null>(null);

  const {
    viewState,
    setViewState,
    maxZoom,
    minZoom,
    userLocation,
    setUserLocation,
    selectedLocation,
    setSelectedLocation,
    isSatellite,
    toggleMapStyle,
  } = useMapStore();
  const { isPickingLocation, setIsPickingLocation, setIsOpen, setStep } =
    useWizardStore();
  const { recommendations, activeWisataId } = useRecommendationStore();
  const { executeSearch, results, isSearching } = useSearchStore();

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

  const handleMapClick = (event: MapLayerMouseEvent) => {
    if (!isPickingLocation) return;

    const { lng, lat } = event.lngLat;

    setSelectedLocation([lng, lat]);

    setIsPickingLocation(false);
    setStep(1);
    setIsOpen(true);
  };

  // Fungsi yang dipanggil ketika tombol diklik
  const handleSearchThisArea = async () => {
    if (!mapRef.current) return;

    // Ambil batas BBOX dari peta
    const bounds = mapRef.current.getMap().getBounds();
    const bbox = {
      minLng: bounds.getWest(),
      minLat: bounds.getSouth(),
      maxLng: bounds.getEast(),
      maxLat: bounds.getNorth(),
    };

    // 1. Jalankan pencarian dan tunggu (akan memicu isSearching = true di Zustand)
    await executeSearch("", "", bbox);

    // 2. SETELAH SELESAI mencari, baru sembunyikan state tombol
    setShowSearchAreaBtn(false);
  };

  // Fungsi untuk mengarahkan peta (Terbang / FlyTo)
  const handleLocationSelect = (item: UnifiedSearchResult) => {
    // 1. Simpan data untuk memunculkan Marker di peta
    setSelectedPlace(item);

    // 2. Gunakan mapRef untuk memicu animasi flyTo secara imperatif
    mapRef.current?.getMap().flyTo({
      center: [item.lng, item.lat],
      zoom: 15,
      duration: 1200, // 1.2 detik
      essential: true, // Memaksa animasi tetap jalan meski mode hemat baterai/performa diaktifkan di browser
    });
  };

  // Fungsi untuk menghapus pin saat X ditekan
  const handleClearLocation = () => {
    setSelectedPlace(null);
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-slate-100">
      {/* =========================================
          TOMBOL "TELUSURI DI AREA INI" (Top Center)
      ========================================= */}
      <div
        className={cn(
          "absolute top-20 left-1/2 z-10 flex -translate-x-1/2 transition-all duration-300 lg:top-6",
          (showSearchAreaBtn || isSearching) && recommendations.length === 0
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-10 opacity-0",
        )}
      >
        <button
          onClick={handleSearchThisArea}
          disabled={isSearching}
          className={cn(
            // Base style
            "group flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-black outline-none",
            "border-2 border-black transition-all duration-150 hover:cursor-pointer hover:bg-[#DCFFBC]",

            // Fisika Soft Neo-Brutalism
            "shadow-[1px_2px_0px_rgba(0,0,0,1)]",
            "hover:-translate-x-px hover:-translate-y-0.5 hover:shadow-[2px_4px_0px_rgba(0,0,0,1)]",
            "active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_rgba(0,0,0,1)]",

            // Disabled style
            "disabled:pointer-events-none disabled:bg-gray-100 disabled:opacity-70",
          )}
        >
          {isSearching ? (
            <Loader2 className="size-4 animate-spin" strokeWidth={2.5} />
          ) : (
            <RotateCw
              className="size-4 transition-transform group-active:rotate-180 group-active:duration-500"
              strokeWidth={2.5}
            />
          )}

          {isSearching ? "Mencari area..." : "Telusuri area ini"}
        </button>
      </div>
      <Map
        ref={mapRef}
        initialViewState={viewState}
        maxZoom={maxZoom}
        minZoom={minZoom}
        onMove={(e) => setViewState(e.viewState)}
        onClick={handleMapClick}
        onDragStart={() => setShowSearchAreaBtn(true)}
        onZoomStart={() => setShowSearchAreaBtn(true)}
        style={{ width: "100%", height: "100%" }}
        mapStyle={currentMapStyle}
        cursor={isPickingLocation ? "crosshair" : "grab"}
      >
        {/* MARKER 1: LOKASI GPS ASLI (Biru Berdenyut) */}
        {userLocation && (
          <Marker
            longitude={userLocation[0]}
            latitude={userLocation[1]}
            rotationAlignment="map"
          >
            <div className="pointer-events-none relative flex items-center justify-center">
              <div className="absolute h-8 w-8 animate-ping rounded-full bg-blue-600 opacity-75"></div>
              <div className="relative h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-md"></div>
            </div>
          </Marker>
        )}

        {/* MARKER 2: TITIK AWAL PERJALANAN (Pin Merah) */}
        {selectedLocation && (
          <Marker
            longitude={selectedLocation[0]}
            latitude={selectedLocation[1]}
            anchor="bottom"
          >
            <div className="cursor-pointer text-red-600 drop-shadow-md transition-transform hover:scale-110">
              <MapPin className="size-10 fill-red-100" strokeWidth={2} />
            </div>
          </Marker>
        )}

        {/* =========================================
            MARKER 3: REKOMENDASI WISATA (SAW)
        ========================================= */}
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

        {/* =========================================
            MARKER 4: HASIL PENCARIAN AREA
        ========================================= */}
        {recommendations.length === 0 &&
          results
            // --- LOGIKA ANTI-DUPLIKAT (Hapus titik hijau jika sudah ada titik oranye) ---
            .filter((wisata) => {
              if (!selectedPlace) return true; // Jika tidak ada titik oranye, tampilkan semua
              return selectedPlace.id !== `local-${wisata.id}`;
            })
            // ----------------------------------------------------------------------------
            .map((wisata) => {
              const isZoomedIn = viewState.zoom >= 13;

              return (
                <Marker
                  key={`search-${wisata.id}`}
                  longitude={wisata.lng}
                  latitude={wisata.lat}
                  anchor="bottom"
                >
                  <div className="relative z-10 flex flex-col items-center">
                    {isZoomedIn ? (
                      /* --- TAMPILAN ZOOM DEKAT --- */
                      <div className="flex items-center rounded-full border-2 border-black bg-white px-2.5 py-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        <span className="max-w-30 truncate text-[12px] font-bold text-black">
                          {wisata.name}
                        </span>
                      </div>
                    ) : (
                      /* --- TAMPILAN ZOOM JAUH --- */
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-black bg-[#DCFFBC] shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        <div className="h-1 w-1 rounded-full bg-black"></div>
                      </div>
                    )}

                    {/* Batang Pin Tipis */}
                    <div className="h-1.5 w-0.5 bg-black"></div>
                  </div>
                </Marker>
              );
            })}

        {/* MARKER 5: Hasil search query */}
        {selectedPlace && (
          <Marker
            longitude={selectedPlace.lng}
            latitude={selectedPlace.lat}
            anchor="bottom"
          >
            <div className="group animate-in fade-in slide-in-from-top-4 relative z-50 flex cursor-pointer flex-col items-center duration-300">
              {/* Tooltip Nama yang Menempel (Selalu Muncul) */}
              <div className="pointer-events-none absolute -top-12 z-50 rounded-lg border-2 border-black bg-white px-3 py-1.5 text-xs font-black whitespace-nowrap shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all">
                {selectedPlace.name}
                {/* Tandai jika ini dari OSM */}
                {selectedPlace.type === "osm" && (
                  <span className="ml-2 text-[12px] font-bold text-gray-500">
                    (OSM)
                  </span>
                )}
              </div>

              {/* Pin Shape Soft Neo-brutalism */}
              {/* Menggunakan warna Oranye (#FF8038) agar mencolok dibandingkan marker lain */}
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 border-black",
                  "shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all",
                  "hover:-translate-y-0.5 hover:shadow-[3px_4px_0px_rgba(0,0,0,1)]",
                  "bg-[#FF8038]",
                )}
              >
                <MapPinSearch className="size-5 text-black" strokeWidth={3} />
              </div>

              {/* Batang Pin */}
              <div className="h-4 w-0.5 bg-black"></div>
              {/* Titik Jangkar di Tanah */}
              <div className="h-2 w-2 rounded-full bg-black"></div>
            </div>
          </Marker>
        )}
      </Map>

      {/* Sidebar Rekomendasi */}
      <RecommendationSidebar />

      {/* =========================================
          PANEL ATAS
      ========================================= */}

      {/* Input pencarian dengan fungsi baru */}
      <div className="absolute top-5 left-4 z-10 hidden w-full max-w-sm sm:block sm:w-80">
        <GlobalSearch
          onSelectLocation={handleLocationSelect}
          onClearLocation={handleClearLocation} // Hubungkan fungsi clear
        />
      </div>

      {/* Tombol Panduan */}
      <div className="absolute top-5 right-4 z-10 hidden flex-col items-end gap-5 sm:flex">
        <Button
          variant={"primary"}
          size={"lg"}
          startIcon={<CircleQuestionMark />}
        >
          <p>Panduan</p>
        </Button>
      </div>

      <div className="absolute top-40 right-4 z-10 flex flex-col items-end gap-5">
        {(viewState.bearing !== 0 || viewState.pitch !== 0) && (
          <CompassButton
            onReset={handleResetCompass}
            bearing={viewState.bearing}
            pitch={viewState.pitch}
          />
        )}
      </div>

      {/* =========================================
          PANEL ATAS MOBILE
      ========================================= */}
      <div className="absolute top-0 left-1/2 z-10 flex w-full -translate-x-1/2 items-center justify-between gap-2 px-3 pt-4 sm:hidden">
        <GlobalSearch
          onSelectLocation={handleLocationSelect}
          onClearLocation={handleClearLocation}
        />

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
