"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/core/popover";
import { Star, MapPin, Navigation, Phone, ExternalLink, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { WisataSearchResult } from "@/store/useSearchStore";
import { Button } from "@/components/core/button";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useCategoryStore } from "@/store/useCategoryStore";
import { Z } from "@/lib/z-index";

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
  const popoverRef = useRef<HTMLDivElement>(null);
  // Dummy image (placeholder) since real images are not available yet
  const dummyImage = `https://picsum.photos/seed/${wisata.gid}/400/200`;

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

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent
        side="top"
        sideOffset={12}
        className="sparta-popup w-[320px] overflow-hidden rounded-xl border-2 border-black bg-white p-0 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
        style={{ zIndex: Z.mapPopup }}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onFocusOutside={(e) => {
          // Cegah popover tertutup saat Joyride mengambil alih fokus
          e.preventDefault();
        }}
        onInteractOutside={(e) => {
          // Jangan tutup popover jika user berinteraksi dengan elemen Joyride (tooltip)
          const target = e.target as HTMLElement;
          if (target.closest(".react-joyride, .sparta-tour-tooltip")) {
            e.preventDefault();
          }
        }}
      >
        <div className="flex w-full flex-col">
          {/* Header Image */}
          <div className="relative h-32 w-full border-b-2 border-black bg-slate-200">
            <Image
              src={dummyImage}
              alt={wisata.name}
              fill
              className="object-cover"
              unoptimized
            />
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
            >
              <X className="h-4 w-4" />
            </button>

            {(() => {
              const catName = wisata.category || "Umum";
              const iconName = getCategoryIcon(catName);
              const Icon = (LucideIcons as any)[iconName] || LucideIcons.MapPin;
              
              return (
                <div
                  className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md border-2 border-black px-2 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  style={{
                    backgroundColor: getCategoryColor(catName),
                  }}
                >
                  <Icon className="h-3 w-3 shrink-0" />
                  {catName}
                </div>
              );
            })()}
          </div>

          {/* Content */}
          <div className="flex flex-col space-y-3 p-4">
            <div>
              <h3 className="text-lg leading-tight font-black text-black">
                {wisata.name}
              </h3>

              <div className="mt-1 flex items-center gap-3 text-sm font-bold text-slate-700">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                  {wisata.rating
                    ? parseFloat(wisata.rating as any).toFixed(1)
                    : "0"}
                  <span className="ml-0.5 text-xs text-slate-500">
                    ({wisata.reviews || 0})
                  </span>
                </span>
                <span className="font-black text-green-600">
                  {wisata.price === 0
                    ? "GRATIS"
                    : wisata.price
                      ? `Rp ${wisata.price.toLocaleString("id-ID")}`
                      : ""}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm font-bold text-slate-600">
              {(wisata.desa ||
                wisata.kecamatan ||
                wisata.kabupaten ||
                wisata.address) && (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <span className="line-clamp-2 leading-tight capitalize">
                    {[
                      wisata.desa ? `${wisata.desa}` : null,
                      wisata.kecamatan ? `${wisata.kecamatan}` : null,
                      wisata.kabupaten,
                    ]
                      .filter(Boolean)
                      .join(", ") || wisata.address}
                  </span>
                </div>
              )}

              {wisata.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-green-600" />
                  <span>{wisata.phone}</span>
                </div>
              )}

              {wisata.link && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 shrink-0 text-purple-600" />
                  <a
                    href={wisata.link}
                    target="_blank"
                    rel="noreferrer"
                    className="line-clamp-1 text-purple-600 hover:underline"
                  >
                    Website Resmi
                  </a>
                </div>
              )}
            </div>

            <Button
              className="mt-2 w-full"
              size="rect"
              onClick={handleDirections}
              startIcon={<Navigation className="h-4 w-4" />}
            >
              Arahkan Rute
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
