"use client";

import React from "react";
import MapLibreMap, { Marker } from "@vis.gl/react-maplibre";
import { streetStyle } from "@/lib/basemaps";
import "maplibre-gl/dist/maplibre-gl.css";

export default function LandingMapMockup() {
  return (
    <div className="relative h-full flex-1 overflow-hidden bg-slate-100">
      <MapLibreMap
        id="landing-map"
        initialViewState={{
          longitude: 110.412,
          latitude: -7.811,
          zoom: 8.4,
          pitch: 0,
          bearing: 0,
        }}
        interactive={false}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
        mapStyle={streetStyle}
      >
        {/* Prambanan */}
        <Marker longitude={110.4938} latitude={-7.752} anchor="bottom">
          <div className="rounded-full border border-black bg-red-500 px-2 py-0.5 text-[8px] font-black whitespace-nowrap text-white shadow-[1px_1px_0px_rgba(0,0,0,1)] select-none">
            🏛️ Prambanan
          </div>
        </Marker>

        {/* Malioboro */}
        <Marker longitude={110.3658} latitude={-7.7926} anchor="bottom">
          <div className="rounded-full border border-black bg-blue-500 px-2 py-0.5 text-[8px] font-black whitespace-nowrap text-white shadow-[1px_1px_0px_rgba(0,0,0,1)] select-none">
            🛍️ Malioboro
          </div>
        </Marker>

        {/* Kaliurang */}
        <Marker longitude={110.4243} latitude={-7.596} anchor="bottom">
          <div className="rounded-full border border-black bg-[#DCFFBC] px-2 py-0.5 text-[8px] font-black whitespace-nowrap text-black shadow-[1px_1px_0px_rgba(0,0,0,1)] select-none">
            🌲 Kaliurang
          </div>
        </Marker>

        {/* Parangtritis */}
        <Marker longitude={110.3297} latitude={-8.0253} anchor="bottom">
          <div className="rounded-full border border-black bg-[#6FD1D7] px-2 py-0.5 text-[8px] font-black whitespace-nowrap text-black shadow-[1px_1px_0px_rgba(0,0,0,1)] select-none">
            🏖️ Pantai Parangtritis
          </div>
        </Marker>
      </MapLibreMap>
    </div>
  );
}
