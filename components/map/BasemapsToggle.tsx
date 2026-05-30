import { MapStyleToggle } from "@/components/core/button";
import { useMapStore } from "@/store/useMapStore";

export default function BasemapsToggle() {
  const { isSatellite, toggleMapStyle } = useMapStore();
  return (
    <>
      <MapStyleToggle isSatellite={isSatellite} onToggle={toggleMapStyle} />
    </>
  );
}
