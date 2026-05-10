"use client";

import React from "react";
import Map, {
  NavigationControl,
  Source,
  Layer,
  Marker,
  Popup,
} from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import {
  Calculator,
  Compass,
  SlidersHorizontal,
  MapPin,
  LocateFixed,
  Loader2,
  Trophy,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/slider";
import { Badge } from "@/components/ui/badge";
import { useSpartaStore } from "@/store/useSpartaStore";

export default function SpartaWebGIS() {
  const {
    bobot,
    setBobot,
    userLocation,
    setUserLocation,
    isLoading,
    setIsLoading,
    geojsonData,
    setGeojsonData,
    selectedWisata,
    setSelectedWisata,
  } = useSpartaStore();

  // FITUR 1: Dapatkan lokasi via GPS Browser
  const handleGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation(pos.coords.longitude, pos.coords.latitude);
      });
    } else {
      alert("GPS tidak didukung di browser ini.");
    }
  };

  // FITUR 2: Fungsi Eksekusi Algoritma
  const handleKalkulasi = async () => {
    if (!userLocation) {
      alert("Silakan klik di peta untuk menentukan lokasi awal Anda!");
      return;
    }

    setIsLoading(true);
    setGeojsonData(null); // Reset hasil lama
    setSelectedWisata(null);

    try {
      const res = await fetch("/api/wisata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bobot, userLocation }),
      });

      const data = await res.json();
      setGeojsonData(data);
    } catch (error) {
      console.error(error);
      alert("Gagal menghitung kalkulasi. Cek terminal server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-100">
      <Map
        initialViewState={{ longitude: 110.3695, latitude: -7.7956, zoom: 10 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        interactiveLayerIds={geojsonData ? ["titik-hasil"] : []}
        onMouseEnter={() => (document.body.style.cursor = "pointer")}
        onMouseLeave={() => (document.body.style.cursor = "default")}
        onClick={(e) => {
          // Jika yang diklik adalah titik wisata (layer 'titik-hasil')
          if (e.features && e.features.length > 0) {
            setSelectedWisata(e.features[0]);
          } else {
            // Jika yang diklik adalah peta kosong, taruh pin lokasi
            setUserLocation(e.lngLat.lng, e.lngLat.lat);
            setSelectedWisata(null); // Tutup popup jika ada yang terbuka
          }
        }}
      >
        <NavigationControl position="bottom-right" />

        {/* Marker Lokasi Pengguna */}
        {userLocation && (
          <Marker
            longitude={userLocation[0]}
            latitude={userLocation[1]}
            anchor="bottom"
          >
            <MapPin className="h-8 w-8 animate-bounce fill-red-100 text-red-600" />
          </Marker>
        )}

        {/* FITUR 4: Visualisasi Dinamis Hasil SAW */}
        {geojsonData && (
          <Source id="hasil-saw" type="geojson" data={geojsonData}>
            <Layer
              id="titik-hasil"
              type="circle"
              paint={{
                // Ukuran dinamis: Rank 1-3 lebih besar
                "circle-radius": ["step", ["get", "rank"], 12, 4, 8, 10, 5],
                // Warna dinamis: Rank 1(Emas), 2(Perak), 3(Perunggu), sisanya Biru
                "circle-color": [
                  "match",
                  ["get", "rank"],
                  1,
                  "#fbbf24", // Emas
                  2,
                  "#94a3b8", // Perak
                  3,
                  "#cd7f32", // Perunggu
                  "#3b82f6", // Biru (Sisanya)
                ],
                "circle-stroke-width": 2,
                "circle-stroke-color": "#ffffff",
              }}
            />
          </Source>
        )}

        {/* Popup Dinamis */}
        {selectedWisata && (
          <Popup
            longitude={selectedWisata.geometry.coordinates[0]}
            latitude={selectedWisata.geometry.coordinates[1]}
            anchor="bottom"
            onClose={() => setSelectedWisata(null)}
            closeOnClick={false}
            offset={15} // Geser sedikit ke atas agar tidak menutupi titik
          >
            <div className="space-y-1 p-2">
              <h4 className="text-sm font-bold">
                {selectedWisata.properties.nama}
              </h4>
              <p className="text-xs text-slate-600">
                Skor SAW:{" "}
                <span className="font-bold text-blue-600">
                  {selectedWisata.properties.skor_saw}
                </span>
              </p>
              <p className="text-xs text-slate-600">
                Jarak:{" "}
                {(selectedWisata.properties.jarak_nyata_meter / 1000).toFixed(
                  1,
                )}{" "}
                km
              </p>
              <p className="text-xs text-slate-600">
                Rating: ⭐ {selectedWisata.properties.rating}
              </p>
            </div>
          </Popup>
        )}
      </Map>

      {/* PANEL KIRI: Kontrol Bobot */}
      <div className="absolute top-4 left-4 z-10 w-full max-w-sm">
        <Card className="border-slate-200 bg-white/95 shadow-lg backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-extrabold text-slate-800">
              <Compass className="h-6 w-6 text-blue-600" /> SPARTA
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5 pt-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGPS}
                className="w-full text-xs"
              >
                <LocateFixed className="mr-2 h-4 w-4" /> Pakai GPS Saya
              </Button>
            </div>

            {/* ... (Letakkan Slider Rating, Fasilitas, Harga di sini seperti kode sebelumnya) ... */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold">Rating (Benefit)</span>
                <span className="font-bold text-blue-600">{bobot.rating}%</span>
              </div>
              <Slider
                value={[bobot.rating]}
                max={100}
                step={5}
                onValueChange={(v) => setBobot("rating", v[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold">Fasilitas (Benefit)</span>
                <span className="font-bold text-blue-600">
                  {bobot.fasilitas}%
                </span>
              </div>
              <Slider
                value={[bobot.fasilitas]}
                max={100}
                step={5}
                onValueChange={(v) => setBobot("fasilitas", v[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold">Harga (Cost)</span>
                <span className="font-bold text-blue-600">{bobot.harga}%</span>
              </div>
              <Slider
                value={[bobot.harga]}
                max={100}
                step={5}
                onValueChange={(v) => setBobot("harga", v[0])}
              />
            </div>
            {/* Slider Baru: Jarak */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold">Jarak Rute (Cost)</span>
                <span className="font-bold text-blue-600">{bobot.jarak}%</span>
              </div>
              <Slider
                value={[bobot.jarak]}
                max={100}
                step={5}
                onValueChange={(v) => setBobot("jarak", v[0])}
              />
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-4">
            <Button
              onClick={handleKalkulasi}
              disabled={isLoading}
              className="w-full bg-blue-600 font-semibold text-white hover:bg-blue-700"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Calculator className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Menganalisis Rute..." : "Kalkulasi Rekomendasi"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* FITUR 3: PANEL KANAN (LEADERBOARD) - Muncul otomatis jika ada features */}
      {geojsonData && geojsonData.features && (
        <div className="absolute top-4 right-4 bottom-4 z-10 w-full max-w-xs">
          <Card className="flex h-full flex-col border-slate-200 bg-white/95 shadow-lg backdrop-blur-sm">
            <CardHeader className="border-b pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <Trophy className="h-4 w-4 text-yellow-500" /> Top Rekomendasi
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              {geojsonData.features
                ?.slice(0, 10)
                .map((item: any, idx: number) => (
                  <div
                    key={item.properties.id}
                    className="flex cursor-pointer items-start gap-3 border-b p-3 transition-colors hover:bg-slate-50"
                    onClick={() => setSelectedWisata(item)}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${idx === 0 ? "bg-yellow-500" : idx === 1 ? "bg-slate-400" : idx === 2 ? "bg-amber-700" : "bg-blue-500"}`}
                    >
                      {item.properties.rank}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm leading-tight font-bold text-slate-800">
                        {item.properties.nama}
                      </h4>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Skor: {item.properties.skor_saw}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold text-slate-700">
                        {(item.properties.jarak_nyata_meter / 1000).toFixed(1)}{" "}
                        km
                      </p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
