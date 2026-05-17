"use client";

import { useEffect, useRef, useState } from "react";
import { SearchInput } from "./search-input";
import { useAutosuggestStore } from "@/store/useAutosuggestStore";
import { UnifiedSearchResult } from "@/app/api/search/route";
import { useMap } from "@vis.gl/react-maplibre";

export default function GlobalSearch() {
  const {
    query,
    setQuery,
    fetchSuggestions,
    results,
    isSearching,
    clearResults,
    setSelectedPlace,
  } = useAutosuggestStore();

  const { "sparta-map": spartaMap } = useMap();

  const [isOpen, setIsOpen] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false); // <-- 1. Tambahkan state ini
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 2. Langsung tandai bahwa kita sedang "menahan" (debounce) saat user mengetik
    if (query.trim() !== "") {
      setIsDebouncing(true);
    }

    const delayDebounceFn = setTimeout(() => {
      setIsDebouncing(false); // Lepas penahan setelah 500ms
      fetchSuggestions(query); // Eksekusi API
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    clearResults();
    setIsOpen(false);
  };

  // Fungsi untuk mengarahkan peta (Terbang / FlyTo)
  const handleLocationSelect = (item: UnifiedSearchResult) => {
    setSelectedPlace(item);

    spartaMap?.getMap().flyTo({
      center: [item.lng, item.lat],
      zoom: 15,
      duration: 1200, // 1.2 detik
      essential: true, // Memaksa animasi tetap jalan meski mode hemat baterai/performa diaktifkan di browser
    });

    setIsOpen(false);
    setQuery(item.name);
  };

  // 3. Gabungkan status loading agar lebih rapi
  const isLoading = isSearching || isDebouncing;

  return (
    <div ref={containerRef} className="relative z-50 w-full sm:w-auto">
      <SearchInput
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onClear={handleClear}
      />

      {/* Dropdown Hasil Pencarian */}
      {isOpen && query.trim() !== "" && (
        <div className="absolute top-14 left-0 z-50 w-full overflow-hidden rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          {/* SKELETON LOADER (Merespons langsung sejak ngetik huruf pertama) */}
          {isLoading && (
            <div className="flex flex-col">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex flex-col border-b border-gray-200 p-3 last:border-0"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-300"></div>
                    <div className="h-4 w-12 animate-pulse rounded bg-gray-300"></div>
                  </div>
                  <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          )}

          {/* TIDAK ADA HASIL (Hanya muncul jika benar-benar selesai loading) */}
          {!isLoading && results.length === 0 && (
            <div className="p-3 text-center text-sm font-bold text-gray-500">
              Tidak ada hasil
            </div>
          )}

          {/* LIST HASIL PENCARIAN */}
          {!isLoading && results.length > 0 && (
            <ul className="flex max-h-60 flex-col overflow-y-auto">
              {results.map((item) => (
                <li
                  key={item.id}
                  className="flex cursor-pointer flex-col border-b border-gray-200 p-3 transition-colors last:border-0 hover:bg-[#DCFFBC]"
                  onClick={() => handleLocationSelect(item)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{item.name}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${item.type === "osm" ? "bg-blue-600 text-white" : "bg-black text-white"}`}
                    >
                      {item.type}
                    </span>
                  </div>
                  {item.address && (
                    <span className="line-clamp-1 text-xs text-gray-600">
                      {item.address}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
