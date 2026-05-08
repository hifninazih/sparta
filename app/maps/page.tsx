"use client";

import Map from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import { Button, ZoomButton } from "@/components/button";
import { Layers, LocateFixed, LogIn, MapPinSearch } from "lucide-react";

export default function Maps() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-100">
      <Map
        initialViewState={{ longitude: 110.3695, latitude: -7.7956, zoom: 10 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      ></Map>

      {/* PANEL Kiri Atas */}
      <div className="absolute gap-5 items-end flex-col flex left-4 top-5 z-10 ">
        <Button variant={"gradient"} size={"lg"} startIcon={<MapPinSearch />}>
          Rekomendasi Wisata
        </Button>
      </div>

      {/* PANEL Kanan Atas */}
      <div className="absolute gap-5 items-end flex-col flex right-4 top-5 z-10 ">
        <Button variant={"primary"} size={"lg"} startIcon={<LogIn />}>
          Login
        </Button>
      </div>

      {/* PANEL Kanan Bawah */}
      <div className="absolute gap-5 items-end flex-col flex right-4 bottom-10 z-10 ">
        <div className="flex gap-2 flex-col items-center">
          <Button
            variant={"primary"}
            size={"rect"}
            startIcon={<LocateFixed />}
          ></Button>
          <ZoomButton />
        </div>
        <Button variant={"primary"} size={"lg"} startIcon={<Layers />}>
          Peta Dasar
        </Button>
      </div>
    </div>
  );
}
