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
import { cn } from "@/lib/utils";
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
import { useSearchStore } from "@/store/useSearchStore";
import { useTourStore } from "@/store/useTourStore";
import { useState } from "react";
import { toast } from "sonner";
import { WisataCategory } from "@/lib/wisata-categories";

// --- KONFIGURASI LANGKAH WIZARD ---
// Step 1: Lokasi | Step 2: Kategori | Step 3-6: Slider bobot
const WIZARD_STEPS = [
  {
    id: 1,
    title: "Tentukan lokasi awal keberangkatan Anda",
    type: "location" as const,
  },
  {
    id: 2,
    title: "Kategori wisata apa yang ingin Anda kunjungi?",
    type: "category" as const,
  },
  {
    id: 3,
    title: "Seberapa penting faktor jarak dalam memilih destinasi wisata?",
    type: "slider" as const,
    key: "jarak" as const,
    leftLabel: "Jarak tidak masalah",
    rightLabel: "Utamakan lokasi terdekat",
  },
  {
    id: 4,
    title: "Seberapa penting faktor harga tiket masuk bagi Anda?",
    type: "slider" as const,
    key: "harga" as const,
    leftLabel: "Harga tidak masalah",
    rightLabel: "Utamakan yang terjangkau",
  },
  {
    id: 5,
    title: "Seberapa penting faktor kepopuleran tempat wisata?",
    type: "slider" as const,
    key: "reviews" as const,
    leftLabel: "Tidak harus populer",
    rightLabel: "Utamakan yang terpopuler",
  },
  {
    id: 6,
    title: "Seberapa penting penilaian (rating) pengunjung sebelumnya?",
    type: "slider" as const,
    key: "rating" as const,
    leftLabel: "Penilaian tidak masalah",
    rightLabel: "Utamakan penilaian terbaik",
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
  } = useWizardStore();
  const { selectedCategories, setSelectedCategories } = useSearchStore();
  const {
    setUserLocation,
    selectedLocation,
    setSelectedLocation,
    selectedAddress,
    setSelectedAddress,
  } = useMapStore();
  const { setRecommendations, setIsLoading } = useRecommendationStore();
  const { run, stepIndex, nextStep: tourNextStep } = useTourStore();

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
    setSelectedAddress("Mencari alamat lokasi saat ini...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude, latitude]);
        setSelectedLocation([longitude, latitude]);
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setSelectedAddress(data.display_name || "Alamat tidak ditemukan");
        } catch (e) {
          setSelectedAddress("Gagal mengambil alamat");
        }

        setIsLoadingGPS(false);
      },
      (error) => {
        console.warn("Gagal mendapatkan lokasi:", error.message || error.code);
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
    if (run) {
      toast.info("Panduan sedang berjalan", {
        description: "Mohon gunakan 'Lokasi Saya' agar simulasi panduan berjalan dengan mulus.",
      });
      return;
    }
    setIsOpen(false);
    setIsPickingLocation(true);
  };

  const handleClearLocation = () => {
    setSelectedLocation(null);
    setSelectedAddress(null);
  };

  // --- FUNGSI 3: KALKULASI SAW ---
  const handleKalkulasi = async () => {
    if (!selectedLocation) return;

    setIsOpen(false);
    setIsLoading(true);

    if (run && useTourStore.getState().stepIndex === 6) {
      tourNextStep();
    }

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
        if (run && useTourStore.getState().stepIndex === 7) {
          setTimeout(() => {
            tourNextStep();
          }, 600);
        }
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
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      const currentStep = useTourStore.getState().stepIndex;
      if (open && run && currentStep === 5) {
        tourNextStep();
      } else if (!open && run && currentStep === 6) {
        useTourStore.getState().setStepIndex(5);
      }
    }}>
      <DialogTrigger asChild>
        <Button variant={"gradient"} size={"lg"} startIcon={<MapPinSearch />}>
          Rekomendasi Wisata
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden border-2 border-black p-0 sm:max-w-md">
        <DialogHeader className="p-6 pr-8 pb-2">
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
                <div className="flex w-full items-center justify-between rounded-md border-2 border-black bg-[#DCFFBC] p-3 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-3 pr-2">
                    <div className="rounded-full border border-black bg-white p-1.5">
                      <MapPinCheck
                        className="size-5 shrink-0 text-black"
                        fill="#fff"
                      />
                    </div>
                    <div className="flex flex-col font-sans text-xs leading-snug font-bold text-black sm:text-sm">
                      <span>
                        {selectedAddress || "Memuat alamat..."}
                      </span>
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
                    endIcon={
                      isLoadingGPS ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <LocateFixed />
                      )
                    }
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
            <div className="relative flex w-full flex-col items-center">
              <FilterChips
                value={selectedCategories}
                onChange={setSelectedCategories}
                className="justify-center"
              />
              <button
                onClick={() => setSelectedCategories([])}
                className={cn(
                  "absolute -bottom-8 text-[11px] font-black uppercase tracking-wider text-red-500 hover:underline transition-all",
                  selectedCategories.length > 0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                )}
              >
                ✖ Hapus Pilihan
              </button>
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
          <div
            className={`flex w-full ${isFirstStep ? "justify-end" : "justify-between"}`}
          >
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
