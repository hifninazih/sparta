// preferensi-dialog.tsx
"use client";

import { Button } from "@/components/core/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/core/dialog";
import { BobotSlider } from "@/components/shared/bobot-slider";
import { FilterChips } from "@/components/shared/filter-chips";
import {
  ArrowRight,
  ArrowLeft,
  MapPinPlus,
  LocateFixed,
  Search,
  Trash2,
  Loader2,
  MapPinCheck,
  MapPinSearch,
} from "lucide-react";
import { useWizardStore } from "@/store/useWizardStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import { useMapStore } from "@/store/useMapStore";
import { useState } from "react";
import { toast } from "sonner";
import { WisataCategory } from "@/lib/wisata-categories";

// --- KONFIGURASI LANGKAH WIZARD ---
// Step 1: Lokasi | Step 2: Kategori | Step 3-6: Slider bobot
const WIZARD_STEPS = [
  {
    id: 1,
    title: "Dari mana Anda akan memulai perjalanan?",
    type: "location" as const,
  },
  {
    id: 2,
    title: "Kategori wisata apa yang Anda minati?",
    type: "category" as const,
  },
  {
    id: 3,
    title: "Seberapa jauh Anda rela bepergian?",
    type: "slider" as const,
    key: "jarak" as const,
    leftLabel: "Jauh gak masalah",
    rightLabel: "Harus dekat",
  },
  {
    id: 4,
    title: "Bagaimana dengan budget tiket masuk?",
    type: "slider" as const,
    key: "harga" as const,
    leftLabel: "Harga tiket bebas",
    rightLabel: "Utamakan yang murah",
  },
  {
    id: 5,
    title: "Seberapa berpengaruh jumlah ulasan (reviews) bagi Anda?",
    type: "slider" as const,
    key: "reviews" as const,
    leftLabel: "Tidak masalah",
    rightLabel: "Utamakan yang populer",
  },
  {
    id: 6,
    title: "Apakah rating wisata penting bagi Anda?",
    type: "slider" as const,
    key: "rating" as const,
    leftLabel: "Tidak penting",
    rightLabel: "Sangat penting",
  },
];

export function PreferensiDialog() {
  const {
    isOpen,
    setIsOpen,
    step,
    jarak,
    harga,
    reviews,
    rating,
    nextStep,
    prevStep,
    setStep,
    setPreference,
    setIsPickingLocation,
    selectedCategories,
    setSelectedCategories,
  } = useWizardStore();
  const { setUserLocation, selectedLocation, setSelectedLocation } =
    useMapStore();
  const { setRecommendations, setIsLoading } = useRecommendationStore();

  const [isLoadingGPS, setIsLoadingGPS] = useState(false);

  const currentStepData = WIZARD_STEPS[step - 1];
  const isFirstStep = step === 1;
  const isLastStep = step === WIZARD_STEPS.length;

  // --- FUNGSI 1: LOKASI SAYA (Titik Awal = GPS) ---
  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Lokasi tidak tersedia", {
        description: "Browser Anda tidak mendukung fitur lokasi.",
      });
      return;
    }

    setIsLoadingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude, latitude]);
        setSelectedLocation([longitude, latitude]);
        setIsLoadingGPS(false);
      },
      (error) => {
        console.error("Gagal:", error);
        toast.error("Gagal mengakses lokasi", {
          description: "Pastikan izin lokasi sudah diberikan di browser Anda.",
        });
        setIsLoadingGPS(false);
      },
      { enableHighAccuracy: true },
    );
  };

  // --- FUNGSI 2: PILIH LOKASI MANUAL ---
  const handlePickLocation = () => {
    setIsOpen(false);
    setIsPickingLocation(true);
  };

  const handleClearLocation = () => {
    setSelectedLocation(null);
  };

  // --- FUNGSI 3: KALKULASI SAW ---
  const handleKalkulasi = async () => {
    if (!selectedLocation) return;

    setIsOpen(false);
    setIsLoading(true);

    try {
      // Kirim kategori terpilih ke API.
      // Array kosong artinya "Semua" — API tidak akan memfilter.
      const categoriesToSend: WisataCategory[] = selectedCategories;

      const response = await fetch("/api/saw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lng: selectedLocation[0],
          lat: selectedLocation[1],
          w_jarak: jarak,
          w_harga: harga,
          w_reviews: reviews,
          w_rating: rating,
          categories: categoriesToSend,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setRecommendations(result.data);
      }

      setStep(1);
    } catch (error) {
      console.error("Gagal mengambil rekomendasi", error);
      toast.error("Gagal menghitung rekomendasi", {
        description: "Terjadi kesalahan pada server. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: ambil nilai slider berdasarkan key
  const getSliderValue = (key: "jarak" | "harga" | "reviews" | "rating") => {
    const map = { jarak, harga, reviews, rating };
    return map[key];
  };

  // Label ringkasan kategori untuk step indicator
  const categoryLabel =
    selectedCategories.length === 0
      ? "Semua kategori"
      : selectedCategories.length === 1
        ? selectedCategories[0]
        : `${selectedCategories.length} kategori`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"gradient"} size={"lg"} startIcon={<MapPinSearch />}>
          Rekomendasi Wisata
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden border-2 border-black p-0 sm:max-w-md">
        <DialogHeader className="p-6 pb-2 pr-8">
          <DialogTitle className="text-center text-lg leading-tight font-bold">
            {currentStepData.title}
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>

        {/* --- AREA KONTEN DINAMIS --- */}
        <div className="flex min-h-44 flex-col items-center justify-center p-6 pt-4">

          {/* =========================================
              LANGKAH 1: LOKASI
          ========================================= */}
          {currentStepData.type === "location" && (
            <div className="flex w-full flex-col items-center justify-center">
              {selectedLocation ? (
                <div className="flex w-full max-w-70 items-center justify-between rounded-md border-2 border-black bg-[#DCFFBC] p-3 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="rounded-full border border-black bg-white p-1.5">
                      <MapPinCheck className="size-5 shrink-0 text-black" fill="#fff" />
                    </div>
                    <div className="flex flex-col font-mono text-[11px] leading-tight font-bold text-black sm:text-xs">
                      <span>Lat: {selectedLocation[1].toFixed(5)}</span>
                      <span>Lng: {selectedLocation[0].toFixed(5)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleClearLocation}
                    className="flex shrink-0 items-center justify-center rounded-md border-2 border-black bg-white p-2 transition-all hover:cursor-pointer hover:bg-red-400 hover:text-white active:translate-y-0.5 active:scale-95"
                    title="Hapus lokasi"
                  >
                    <Trash2 className="size-4" strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <div className="flex w-fit justify-center gap-4">
                  <Button
                    variant="primary"
                    size="rect"
                    className="text-sm font-bold"
                    endIcon={<MapPinPlus />}
                    onClick={handlePickLocation}
                  >
                    Pilih di Peta
                  </Button>
                  <Button
                    variant="outline"
                    size="rect"
                    className="text-sm font-bold"
                    endIcon={isLoadingGPS ? <Loader2 className="animate-spin" /> : <LocateFixed />}
                    onClick={handleMyLocation}
                    disabled={isLoadingGPS}
                  >
                    {isLoadingGPS ? "Mencari..." : "Lokasi Saya"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* =========================================
              LANGKAH 2: KATEGORI (Multi-select)
          ========================================= */}
          {currentStepData.type === "category" && (
            <div className="flex w-full flex-col items-center gap-4">
              <FilterChips
                value={selectedCategories}
                onChange={setSelectedCategories}
                className="justify-center"
              />
            </div>
          )}

          {/* =========================================
              LANGKAH 3-6: SLIDER BOBOT
          ========================================= */}
          {currentStepData.type === "slider" && (
            <div className="w-full max-w-sm">
              <BobotSlider
                leftLabel={currentStepData.leftLabel}
                rightLabel={currentStepData.rightLabel}
                value={getSliderValue(currentStepData.key)}
                onChange={(val) => setPreference(currentStepData.key, val)}
              />
            </div>
          )}
        </div>

        {/* --- STEP INDICATOR --- */}
        <div className="flex items-center justify-center gap-1.5 pb-2">
          {WIZARD_STEPS.map((s) => (
            <div
              key={s.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s.id === step
                  ? "w-6 bg-black"
                  : s.id < step
                    ? "w-3 bg-black/40"
                    : "w-3 bg-black/15"
              }`}
            />
          ))}
        </div>

        {/* --- FOOTER NAVIGASI --- */}
        <DialogFooter className="flex-row items-center border-t-2 border-black bg-slate-100 p-4 sm:justify-between">
          <div className={`flex w-full ${isFirstStep ? "justify-end" : "justify-between"}`}>
            {!isFirstStep && (
              <Button
                variant="outline"
                size={"rect"}
                className="font-bold"
                startIcon={<ArrowLeft />}
                onClick={prevStep}
              >
                Sebelumnya
              </Button>
            )}

            <Button
              variant="gradient"
              size={"rect"}
              className="font-bold"
              endIcon={isLastStep ? <Search /> : <ArrowRight />}
              onClick={isLastStep ? handleKalkulasi : nextStep}
              disabled={isFirstStep && !selectedLocation}
            >
              {isLastStep ? "Cari Wisata" : "Selanjutnya"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
