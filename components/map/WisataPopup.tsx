"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/core/popover";
import { Star, Navigation, Info, ExternalLink, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { WisataSearchResult } from "@/store/useSearchStore";
import { Button } from "@/components/core/button";
import { useRef, useState } from "react";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useTourStore } from "@/store/useTourStore";
import { Z } from "@/lib/z-index";
import { WisataDetailModal } from "./WisataDetailModal";

interface WisataMarkerPopoverProps {
  wisata: WisataSearchResult;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function WisataMarkerPopover({
  wisata,
  isOpen,
  onOpenChange,
  children,
}: WisataMarkerPopoverProps) {
  const { getCategoryColor, getCategoryIcon } = useCategoryStore();
  const { run, stepIndex, nextStep: tourNextStep } = useTourStore();
  const popoverRef = useRef<HTMLDivElement>(null);

  // State untuk modal detail
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDirections = () => {
    if (wisata.maps_link) {
      window.open(wisata.maps_link, "_blank");
    } else {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${wisata.lat},${wisata.lng}`,
        "_blank",
      );
    }
  };

  const catName = wisata.category || "Umum";
  const iconName = getCategoryIcon(catName);
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.MapPin;

  return (
    <>
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>

        <PopoverContent
          side="top"
          sideOffset={12}
          className="sparta-popup w-[280px] overflow-hidden rounded-xl border-2 border-black bg-white p-0 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
          style={{ zIndex: Z.mapPopup }}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onFocusOutside={(e) => {
            e.preventDefault();
          }}
          onInteractOutside={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest(".react-joyride, .sparta-tour-tooltip")) {
              e.preventDefault();
            }
          }}
        >
          <div className="flex w-full flex-col">
            {/* Header Mini */}
            <div className="relative flex items-start justify-between border-b-2 border-black bg-slate-100 p-3 pb-2">
              <div className="flex flex-col gap-1.5 pr-6">
                <div
                  className="flex w-fit items-center gap-1 rounded-md border-2 border-black px-1.5 py-0.5 text-[10px] font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: getCategoryColor(catName) }}
                >
                  <Icon className="h-3 w-3 shrink-0" />
                  {catName}
                </div>
                <h3 className="line-clamp-2 text-base leading-tight font-black text-black">
                  {wisata.name}
                </h3>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Quick Info */}
            <div className="flex flex-col p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1 text-sm font-bold text-slate-700">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  {wisata.rating
                    ? parseFloat(wisata.rating as any).toFixed(1)
                    : "0"}
                  <span className="ml-0.5 text-[10px] font-semibold text-slate-500">
                    ({wisata.reviews || 0})
                  </span>
                </span>
                <span className="rounded border border-green-200 bg-green-50 px-1.5 py-0.5 text-xs font-black text-green-600">
                  {wisata.price === 0
                    ? "GRATIS"
                    : wisata.price
                      ? `Rp ${wisata.price.toLocaleString("id-ID")}`
                      : ""}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 border-t-2 border-black bg-slate-50 p-3">
              <Button
                className="h-8 flex-1 text-[11px] font-bold sparta-btn-detail"
                size="rect"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(true);
                  if (run && stepIndex === 11) {
                    setTimeout(() => tourNextStep(), 300);
                  }
                }}
                startIcon={<Info className="h-3.5 w-3.5" />}
              >
                Detail
              </Button>
              <Button
                className="h-8 flex-1 text-[11px] font-bold"
                size="rect"
                onClick={handleDirections}
                startIcon={<Navigation className="h-3.5 w-3.5" />}
              >
                Buka di Google Maps
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Modal Detail */}
      <WisataDetailModal
        wisata={wisata}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
