"use client";

import { useEffect, useState } from "react";

import {
  Joyride,
  EventData,
  STATUS,
  Step,
  TooltipRenderProps,
} from "react-joyride";
import { Button } from "@/components/core/button";
import { X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import { useTourStore } from "@/store/useTourStore";

interface MapsTourProps {}

function CustomTooltip({
  index,
  step,
  size,
  backProps,
  primaryProps,
  skipProps,
  tooltipProps,
}: TooltipRenderProps) {
  const isFirstStep = index === 0;
  const isLastStep = index === size - 1;

  return (
    <div
      {...tooltipProps}
      className="sparta-tour-tooltip flex w-full max-w-sm flex-col gap-0 overflow-hidden rounded-md border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]"
    >
      <div className="relative p-6 pr-8 pb-2">
        {step.title && (
          <h3 className="text-center text-lg leading-tight font-bold">
            {step.title}
          </h3>
        )}
        <button
          {...skipProps}
          className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="size-4" strokeWidth={3} />
          <span className="sr-only">Close</span>
        </button>
      </div>

      <div className="flex min-h-25 flex-col items-center justify-center p-6 pt-2 text-center text-sm font-medium">
        {step.content}
      </div>

      {/* --- STEP INDICATOR --- */}
      <div className="flex items-center justify-center gap-1.5 pb-4">
        {Array.from({ length: size }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? "w-6 bg-black"
                : i < index
                  ? "w-3 bg-black/40"
                  : "w-3 bg-black/15"
            }`}
          />
        ))}
      </div>

      {/* --- FOOTER NAVIGASI --- */}
      {!(step.buttons && step.buttons.length === 0) && (
        <div className="flex flex-row items-center border-t-2 border-black bg-slate-100 p-4 sm:justify-between">
          <div
            className={`flex w-full ${isFirstStep ? "justify-end" : "justify-between"}`}
          >
            {!isFirstStep && (
              <Button
                {...backProps}
                variant="outline"
                size={"rect"}
                className="font-bold"
              >
                Sebelumnya
              </Button>
            )}

            <Button
              {...primaryProps}
              variant="gradient"
              size={"rect"}
              className="font-bold"
            >
              {isLastStep ? "Selesai" : "Selanjutnya"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MapsTour({}: MapsTourProps) {
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { run, setRun, stepIndex, setStepIndex } = useTourStore();
  const { clearRecommendations } = useRecommendationStore();

  useEffect(() => {
    setMounted(true);
    const hasSeenTour = localStorage.getItem("sparta_maps_tour_seen");
    if (!hasSeenTour) {
      setRun(true);
    }
  }, [setRun]);

  useEffect(() => {
    if (run && stepIndex === 0) {
      clearRecommendations();
    }
  }, [run, stepIndex, clearRecommendations]);

  const steps: Step[] = [
    {
      target: "body",
      title: "Selamat Datang!",
      content: "Mari kita lihat fitur-fitur yang tersedia di sistem ini.",
      placement: "center",
    },
    {
      target: ".tour-map-controls",
      title: "Kontrol Peta",
      content:
        "Gunakan kontrol ini untuk memperbesar/memperkecil peta dan mencari lokasi Anda saat ini.",
      placement: "left",
    },
    {
      target: ".tour-basemaps-toggle",
      title: "Peta Dasar",
      content:
        "Anda bisa mengubah tampilan peta menjadi mode peta jalan atau satelit melalui tombol ini.",
      placement: "left",
    },
    {
      target: isDesktop ? ".tour-search-desktop" : ".tour-search-mobile",
      title: "Pencarian",
      content:
        "Gunakan kotak pencarian ini untuk mencari lokasi atau tempat wisata tertentu secara manual.",
      placement: "bottom",
    },
    {
      target: ".tour-preferensi-btn",
      title: "Rekomendasi Wisata",
      content:
        "Klik tombol ini untuk memulai pencarian rekomendasi wisata cerdas berdasarkan preferensi Anda.",
      placement: "top-start",
      buttons: [],
    },
    {
      target: "[role='dialog']",
      title: "Wizard Rekomendasi",
      content:
        "Isi form ini. Untuk melanjutkan tour dengan mulus, gunakan fitur GPS ('Lokasi Saya') lalu tekan 'Cari Wisata'.",
      placement: "right",
      buttons: [],
    },
    {
      target: ".tour-loading-spinner",
      title: "Mengkalkulasi...",
      content:
        "Sistem sedang menghitung rekomendasi terbaik menggunakan metode SAW berdasarkan preferensi Anda.",
      placement: "right",
      hideOverlay: true,
      buttons: [],
    },
    {
      target: ".tour-recommendation-container",
      title: "10 Top Rekomendasi",
      content:
        "Ini adalah daftar 10 rekomendasi wisata terbaik yang paling sesuai dengan preferensi Anda, diurutkan dari skor tertinggi.",
      placement: "right",
    },
    {
      target: ".tour-result-item",
      title: "Pilih Hasil",
      content:
        "Klik pada hasil nomor 1 ini untuk melihat lokasinya secara otomatis di peta.",
      placement: "right",
      buttons: [],
    },
    {
      target: ".sparta-popup",
      title: "Informasi Detail",
      content:
        "Popup ini berisi informasi detail wisata. Anda juga dapat menekan 'Rute ke Sini' untuk membuka navigasi.",
      placement: "right",
    },
    {
      target: isDesktop ? ".tour-panduan-desktop" : ".tour-panduan-mobile",
      title: "Panduan",
      content:
        "Kapan pun Anda butuh bantuan lagi, klik tombol Panduan ini. Tur selesai!",
      placement: "bottom" as const,
    },
  ];

  const handleJoyrideCallback = (data: EventData) => {
    const { status, type, index, action } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      setStepIndex(0);
      localStorage.setItem("sparta_maps_tour_seen", "true");
    } else if (type === "step:after") {
      setStepIndex(index + (action === "prev" ? -1 : 1));
    }
  };

  if (!mounted) return null;

  return (
    <Joyride
      stepIndex={stepIndex}
      onEvent={handleJoyrideCallback}
      continuous
      run={run}
      options={{
        skipScroll: true,
        overlayClickAction: false,
        skipBeacon: true,
        zIndex: 10000,
        primaryColor: "#000",
        backgroundColor: "#ffffff",
        textColor: "#111827",
        arrowColor: "#ffffff"
      }}
      steps={steps}
      tooltipComponent={CustomTooltip}
    />
  );
}
