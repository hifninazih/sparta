"use client";

import { useState } from "react";
import Map, { Marker } from "@vis.gl/react-maplibre";
import { MapPin } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapPickerProps {
  lng: number;
  lat: number;
  onChange: (lng: number, lat: number) => void;
}

export function MapPicker({ lng, lat, onChange }: MapPickerProps) {
  return (
    <div className="h-64 w-full rounded-lg border-2 border-slate-200 overflow-hidden relative">
      <Map
        initialViewState={{
          longitude: lng || 110.3695,
          latitude: lat || -7.7956,
          zoom: 12,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        onClick={(e) => onChange(e.lngLat.lng, e.lngLat.lat)}
        id="picker-map"
      >
        <Marker longitude={lng} latitude={lat} anchor="bottom">
          <MapPin className="h-8 w-8 text-red-600 fill-red-100" />
        </Marker>
      </Map>
      <div className="absolute bottom-2 left-2 bg-white/90 p-1.5 rounded text-[10px] font-mono shadow-sm border border-slate-200">
        Klik peta untuk memindahkan titik
      </div>
    </div>
  );
}
