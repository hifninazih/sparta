"use client";

import React from "react";
// IMPORT BARU MENGGUNAKAN VIS.GL
import Map, { NavigationControl, Source, Layer } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

// Import Icons & Shadcn
import { Calculator, Compass, SlidersHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Import Zustand Store
import { useSpartaStore } from "@/store/useSpartaStore";

export default function SpartaWebGIS() {
  const bobot = useSpartaStore((state) => state.bobot);
  const setBobot = useSpartaStore((state) => state.setBobot);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-100">
      {/* 1. LAYER PETA MENGGUNAKAN @VIS.GL */}
      <Map
        initialViewState={{
          longitude: 110.3695,
          latitude: -7.7956, // Titik tengah DIY
          zoom: 10,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        <NavigationControl position="top-right" />

        {/* Memanggil Vector Tiles dari pg_tileserv */}
        {/* Memanggil GeoJSON dari API Next.js kita sendiri */}
        <Source id="wisata-source" type="geojson" data="/api/wisata">
          <Layer
            id="titik-wisata"
            type="circle"
            paint={{
              "circle-radius": 6,
              "circle-color": "#0ea5e9", // Warna biru Sky Tailwind
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
            }}
          />
        </Source>
      </Map>

      {/* 2. FLOATING PANEL SPARTA */}
      <div className="absolute left-4 top-4 z-10 w-full max-w-sm">
        <Card className="shadow-lg backdrop-blur-sm bg-white/95 border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-extrabold text-slate-800 tracking-tight">
                  SPARTA
                </CardTitle>
                <CardDescription className="text-xs font-medium">
                  Sistem Pemetaan & Rekomendasi Wisata
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator />

          <CardContent className="pt-4 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center text-slate-700">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Preferensi Kriteria (Bobot)
              </h3>
              <Badge variant="secondary" className="text-[10px]">
                Metode SAW
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-slate-600">
                  Rating Tempat (Benefit)
                </Label>
                <span className="text-xs font-bold text-blue-600">
                  {bobot.rating}%
                </span>
              </div>
              <Slider
                value={[bobot.rating]}
                max={100}
                step={5}
                onValueChange={(val: number[]) => setBobot("rating", val[0])}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-slate-600">
                  Kelengkapan Fasilitas (Benefit)
                </Label>
                <span className="text-xs font-bold text-blue-600">
                  {bobot.fasilitas}%
                </span>
              </div>
              <Slider
                value={[bobot.fasilitas]}
                max={100}
                step={5}
                onValueChange={(val: number[]) => setBobot("fasilitas", val[0])}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-slate-600">
                  Harga Tiket Masuk (Cost)
                </Label>
                <span className="text-xs font-bold text-blue-600">
                  {bobot.harga}%
                </span>
              </div>
              <Slider
                value={[bobot.harga]}
                max={100}
                step={5}
                onValueChange={(val: number[]) => setBobot("harga", val[0])}
              />
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              <Calculator className="w-4 h-4 mr-2" />
              Kalkulasi Rekomendasi
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
