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
} from "lucide-react";
import { useWizardStore } from "@/store/useWizardStore";
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
] as const;

export function PreferensiDialog({ children }: { children: React.ReactNode }) {
  const {
    isOpen,
    setIsOpen,
    step,
    jarak,
    harga,
    fasilitas,
    nextStep,
    prevStep,
    setPreference,
    setIsPickingLocation,
  } = useWizardStore();
  const { setUserLocation, setSelectedLocation } = useMapStore();

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

  const handleKalkulasi = () => {
    console.log("Mulai Kalkulasi SAW dengan data:", {
      jarak,
      harga,
      fasilitas,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden border-2 border-black p-0 sm:max-w-md">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-center text-lg leading-tight font-bold">
            {currentStepData.title}
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>

        {/* --- AREA KONTEN DINAMIS --- */}
        <div className="flex min-h-40 flex-col items-center justify-center p-6 pt-4">
          {currentStepData.type === "location" && (
            <div className="flex w-fit justify-center gap-4">
              <Button
                variant="primary"
                size="rect"
                endIcon={<MapPinPlus />}
                onClick={handlePickLocation}
              >
                Pilih Lokasi
              </Button>
              <Button
                variant="primary"
                size="rect"
                endIcon={<LocateFixed />}
                onClick={handleMyLocation}
                disabled={isLoadingGPS}
              >
                Lokasi Saya
              </Button>
            </div>
          )}

          {currentStepData.type === "slider" && (
            <BobotSlider
              leftLabel={currentStepData.leftLabel}
              rightLabel={currentStepData.rightLabel}
              value={
                currentStepData.key === "jarak"
                  ? jarak
                  : currentStepData.key === "harga"
                    ? harga
                    : fasilitas
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
            >
              {isLastStep ? "Cari Wisata" : "Selanjutnya"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
