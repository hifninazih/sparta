// preferensi-dialog.tsx
"use client"; // Pastikan ini ada karena kita menggunakan Zustand dan interaksi UI

import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { BobotSlider } from "@/components/bobot-slider"; // Pastikan path ini sesuai dengan shadcn milikmu
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

// --- KONFIGURASI LANGKAH WIZARD ---
const WIZARD_STEPS = [
  {
    id: 1,
    title: "Dari mana Anda akan memulai perjalanan?",
    type: "location",
  },
  {
    id: 2,
    title: "Seberapa jauh Anda rela bepergian?",
    type: "slider",
    key: "jarak",
    leftLabel: "Jauh gak masalah",
    rightLabel: "Harus dekat",
  },
  {
    id: 3,
    title: "Bagaimana dengan budget tiket masuk?",
    type: "slider",
    key: "harga",
    leftLabel: "Harga tiket bebas",
    rightLabel: "Utamakan yang murah",
  },
  {
    id: 4,
    title: "Seberapa penting kelengkapan fasilitas bagi Anda?",
    type: "slider",
    key: "fasilitas",
    leftLabel: "Biasa saja cukup",
    rightLabel: "Wajib lengkap",
  },
  {
    id: 5,
    title: "Apakah rating wisata penting bagi Anda?",
    type: "slider",
    key: "rating",
    leftLabel: "Tidak penting",
    rightLabel: "Sangat penting",
  },
] as const;

export function PreferensiDialog() {
  const {
    isOpen,
    setIsOpen,
    step,
    jarak,
    harga,
    fasilitas,
    rating,
    nextStep,
    prevStep,
    setStep,
    setPreference,
    setIsPickingLocation,
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
      alert("Browser Anda tidak mendukung fitur lokasi.");
      return;
    }

    setIsLoadingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;

        // Simpan sebagai posisi GPS pengguna di peta
        setUserLocation([longitude, latitude]);

        // Simpan JUGA sebagai titik awal perjalanan untuk algoritma
        setSelectedLocation([longitude, latitude]);

        setIsLoadingGPS(false);
        // nextStep(); // Lanjut ke step 2
      },
      (error) => {
        console.error("Gagal:", error);
        alert("Gagal mengakses lokasi.");
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
  const handleKalkulasi = async () => {
    if (!selectedLocation) return;

    setIsOpen(false); // Tutup dialog wizard
    setIsLoading(true); // Mulai loading di UI (misal: muncul spinner di peta)

    try {
      const response = await fetch("/api/saw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lng: selectedLocation[0],
          lat: selectedLocation[1],
          w_jarak: jarak,
          w_harga: harga,
          w_fasilitas: fasilitas,
          w_rating: rating,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setRecommendations(result.data); // Simpan hasil top 20 ke Zustand
      }

      setStep(1);
    } catch (error) {
      console.error("Gagal mengambil rekomendasi", error);
      alert("Terjadi kesalahan saat menghitung rekomendasi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"gradient"} size={"lg"} startIcon={<MapPinSearch />}>
          Rekomendasi Wisata
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden border-2 border-black p-0 sm:max-w-md">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-center text-lg leading-tight font-bold">
            {currentStepData.title}
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>

        {/* --- AREA KONTEN DINAMIS --- */}
        <div className="flex min-h-40 flex-col items-center justify-center p-6 pt-4">
          {/* =========================================
              LOGIKA RENDER LANGKAH 1 (LOKASI)
          ========================================= */}
          {currentStepData.type === "location" && (
            <div className="flex w-full flex-col items-center justify-center">
              {/* Jika Lokasi Sudah Terpilih */}
              {selectedLocation ? (
                <div className="flex w-full max-w-70 items-center justify-between rounded-md border-2 border-black bg-[#DCFFBC] p-3 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="rounded-full border border-black bg-white p-1.5">
                      <MapPinCheck
                        className="size-5 shrink-0 text-black"
                        fill="#fff"
                      />
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
                /* Jika Lokasi Belum Terpilih (Tombol Awal) */
                <div className="flex w-fit justify-center gap-4">
                  <Button
                    variant="primary"
                    size="rect"
                    className="text-sm"
                    endIcon={<MapPinPlus />}
                    onClick={handlePickLocation}
                  >
                    Pilih di Peta
                  </Button>
                  <Button
                    variant="primary"
                    size="rect"
                    className="text-sm"
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
              LOGIKA RENDER LANGKAH 2-4 (SLIDER)
          ========================================= */}
          {currentStepData.type === "slider" && (
            <BobotSlider
              leftLabel={currentStepData.leftLabel}
              rightLabel={currentStepData.rightLabel}
              value={
                currentStepData.key === "jarak"
                  ? jarak
                  : currentStepData.key === "harga"
                    ? harga
                    : currentStepData.key === "fasilitas"
                      ? fasilitas
                      : rating
              }
              onChange={(val) => setPreference(currentStepData.key as any, val)}
            />
          )}
        </div>

        {/* --- AREA FOOTER (Navigasi) --- */}
        <DialogFooter className="flex-row items-center border-t-2 border-black bg-slate-100 p-4 sm:justify-between">
          <div
            className={`flex w-full ${isFirstStep ? "justify-end" : "justify-between"}`}
          >
            {!isFirstStep && (
              <Button
                variant="outline"
                size={"rect"}
                startIcon={<ArrowLeft />}
                onClick={prevStep}
              >
                Sebelumnya
              </Button>
            )}

            <Button
              variant="gradient"
              size={"rect"}
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
