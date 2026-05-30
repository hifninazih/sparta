import { cn } from "@/lib/utils";
import { Loader2, RotateCw } from "lucide-react";
import { useMap } from "@vis.gl/react-maplibre";
import { useSearchStore } from "@/store/useSearchStore";

export default function SearchThisAreaButton() {
  const { "sparta-map": spartaMap } = useMap();
  const {
    showSearchAreaBtn,
    executeSearch,
    setShowSearchAreaBtn,
    isSearching,
  } = useSearchStore();

  // Fungsi yang dipanggil ketika tombol diklik
  const handleSearchThisArea = async () => {
    if (!spartaMap) return;

    // Ambil batas BBOX dari peta
    const bounds = spartaMap.getMap().getBounds();
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
  return (
    <button
      onClick={handleSearchThisArea}
      disabled={isSearching}
      className={cn(
        // Base style
        "group flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black outline-none",
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
        <Loader2 className="size-3 animate-spin" strokeWidth={2.5} />
      ) : (
        <RotateCw
          className="size-3 transition-transform group-active:rotate-180 group-active:duration-500"
          strokeWidth={2.5}
        />
      )}

      {isSearching ? "Mencari tempat wisata..." : "Telusuri area ini"}
    </button>
  );
}
