"use client";

import { useEffect, useRef, useState } from "react";
import { SearchInput } from "./search-input";
import { useAutosuggestStore } from "@/store/useAutosuggestStore";
import { useSearchStore } from "@/store/useSearchStore";
import { UnifiedSearchResult } from "@/app/api/search/route";
import { useMap } from "@vis.gl/react-maplibre";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import { FilterChips } from "@/components/shared/filter-chips";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const { selectedCategories, setSelectedCategories } = useSearchStore();
  const { recommendations, mobileSnap } = useRecommendationStore();
  const { "sparta-map": spartaMap } = useMap();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced fetch saat query berubah
  useEffect(() => {
    if (query.trim() !== "") {
      setIsDebouncing(true);
    }

    const delayDebounceFn = setTimeout(() => {
      setIsDebouncing(false);
      fetchSuggestions(query);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Tutup dropdown + filter saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    clearResults();
    setIsDropdownOpen(false);
  };

  const handleLocationSelect = (item: UnifiedSearchResult) => {
    setSelectedPlace(item);

    const hasRecs = recommendations.length > 0;

    spartaMap?.getMap().flyTo({
      center: [item.lng, item.lat],
      zoom: 15,
      duration: 1200,
      essential: true,
      padding: isDesktop
        ? { left: hasRecs ? 384 : 0, top: 0, bottom: 0, right: 0 }
        : {
            bottom: hasRecs ? window.innerHeight * (Number(mobileSnap) || 0.6) : 0,
            top: 80,
            left: 0,
            right: 0,
          },
    });

    setIsDropdownOpen(false);
    setQuery(item.name);
  };

  const isLoading = isSearching || isDebouncing;

  // Jumlah filter aktif (selain "Semua")
  const activeFilterCount = selectedCategories.length;

  // Tombol filter — dimasukkan ke rightSlot SearchInput
  const FilterButton = (
    <button
      type="button"
      onClick={() => {
        setIsFilterOpen((prev) => !prev);
        setIsDropdownOpen(false);
      }}
      title="Filter kategori"
      className={cn(
        "relative flex items-center justify-center rounded-full p-1.5 transition-all outline-none",
        isFilterOpen
          ? "bg-black text-[#DCFFBC]"
          : "text-gray-500 hover:bg-gray-100 hover:text-black",
      )}
    >
      <SlidersHorizontal className="size-4" strokeWidth={2.5} />
      {/* Badge jumlah filter aktif */}
      {activeFilterCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black text-[8px] font-black text-[#DCFFBC]">
          {activeFilterCount}
        </span>
      )}
    </button>
  );

  return (
    <div ref={containerRef} className="relative w-full sm:w-auto">
      <SearchInput
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsDropdownOpen(true);
          setIsFilterOpen(false);
        }}
        onClear={handleClear}
        rightSlot={FilterButton}
      />

      {/* =====================
          PANEL FILTER KATEGORI
          Muncul tepat di bawah search bar saat tombol filter diklik
      ===================== */}
      {isFilterOpen && (
        <div
          className={cn(
            "absolute top-14 left-0 z-50 w-full min-w-[280px] rounded-xl border-2 border-black bg-white p-3",
            "shadow-[4px_4px_0px_rgba(0,0,0,1)]",
            "animate-in fade-in slide-in-from-top-1 duration-150",
          )}
        >
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            Filter Kategori
          </p>
          <FilterChips
            value={selectedCategories}
            onChange={setSelectedCategories}
          />
        </div>
      )}

      {/* =====================
          DROPDOWN AUTOCOMPLETE
      ===================== */}
      {isDropdownOpen && query.trim() !== "" && (
        <div className="absolute top-14 left-0 z-50 w-full overflow-hidden rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          {/* Skeleton loader */}
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

          {/* Tidak ada hasil */}
          {!isLoading && results.length === 0 && (
            <div className="p-3 text-center text-sm font-bold text-gray-500">
              Tidak ada hasil
            </div>
          )}

          {/* List hasil */}
          {!isLoading && results.length > 0 && (
            <ul className="flex max-h-60 flex-col overflow-y-auto">
              {results.map((item) => (
                <li
                  key={item.gid}
                  className="flex cursor-pointer flex-col border-b border-gray-200 p-3 transition-colors last:border-0 hover:bg-[#DCFFBC]"
                  onClick={() => handleLocationSelect(item)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{item.name}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                        item.type === "osm" ? "bg-blue-600 text-white" : "bg-black text-white"
                      }`}
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
