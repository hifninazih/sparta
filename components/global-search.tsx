// global-search.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { SearchInput } from "./search-input";
import { useAutosuggestStore } from "@/store/useAutosuggestStore";
import { UnifiedSearchResult } from "@/app/api/search/route";

interface GlobalSearchProps {
  onSelectLocation: (item: UnifiedSearchResult) => void;
  onClearLocation: () => void; // Tambahan
}

export function GlobalSearch({
  onSelectLocation,
  onClearLocation,
}: GlobalSearchProps) {
  const {
    query,
    setQuery,
    fetchSuggestions,
    results,
    isSearching,
    clearResults,
  } = useAutosuggestStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions(query);
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

  // Fungsi saat tombol X ditekan
  const handleClear = () => {
    clearResults(); // Bersihkan state Zustand
    setIsOpen(false);
    onClearLocation(); // Hapus marker dari peta
  };

  return (
    <div ref={containerRef} className="relative z-50 w-full sm:w-auto">
      <SearchInput
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onClear={handleClear} // Hubungkan fungsi ke SearchInput
      />

      {/* Dropdown Hasil Pencarian */}
      {isOpen && query.trim() !== "" && (
        <div className="absolute top-14 left-0 z-50 w-full overflow-hidden rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          {isSearching && (
            <div className="p-3 text-center text-sm font-bold text-gray-500">
              Mencari...
            </div>
          )}

          {!isSearching && results.length === 0 && (
            <div className="p-3 text-center text-sm font-bold text-gray-500">
              Tidak ada hasil
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <ul className="flex max-h-60 flex-col overflow-y-auto">
              {results.map((item) => (
                <li
                  key={item.id}
                  className="flex cursor-pointer flex-col border-b border-gray-200 p-3 transition-colors last:border-0 hover:bg-[#DCFFBC]"
                  onClick={() => {
                    // Panggil fungsi ke peta
                    onSelectLocation(item);

                    // Tutup dropdown dan jadikan nama tempat sebagai value input
                    setIsOpen(false);
                    setQuery(item.name);
                  }}
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
