"use client";

import { useEffect, useState } from "react";
import { Source, Layer } from "@vis.gl/react-maplibre";
import { useMapStore } from "@/store/useMapStore";

export default function ProvBoundaryLayer() {
  const [geoData, setGeoData] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { isSatellite } = useMapStore();

  useEffect(() => {
    // Ambil data geojson boundary dari API
    fetch("/api/maps/prov-boundary")
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
        // Delay slighty so the layer mounts with 0 opacity before transitioning
        setTimeout(() => setIsVisible(true), 100);
      })
      .catch((err) => console.error("Error fetching boundary:", err));
  }, []);

  if (!geoData) return null;

  return (
    <Source id="prov-boundary" type="geojson" data={geoData}>
      {/* Layer untuk Meredupkan area di LUAR DIY (Masking) */}
      <Layer
        id="prov-mask-fill"
        type="fill"
        filter={["==", "type", "mask"]}
        paint={{
          "fill-color": "#000000",
          "fill-opacity": isVisible ? (isSatellite ? 0.4 : 0.2) : 0, // Fade-in effect
          "fill-opacity-transition": { duration: 1500, delay: 0 },
        }}
      />

      {/* Layer untuk Garis Batas DIY (Stroke) */}
      <Layer
        id="prov-boundary-line"
        type="line"
        filter={["==", "type", "outline"]}
        paint={{
          "line-color": isSatellite ? "#ffffff" : "#000000",
          "line-width": 3,
          "line-opacity": isVisible ? 0.8 : 0, // Fade-in effect
          "line-opacity-transition": { duration: 1500, delay: 0 },
          "line-dasharray": [2, 2], // Garis putus-putus
        }}
      />
    </Source>
  );
}
