"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/core/dialog";
import {
  Star,
  MapPin,
  Navigation,
  ExternalLink,
  Info,
  Sparkles,
  Quote,
  Globe,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import * as LucideIcons from "lucide-react";
import { WisataSearchResult } from "@/store/useSearchStore";
import { Button } from "@/components/core/button";
import { useCategoryStore } from "@/store/useCategoryStore";

interface WisataDetailModalProps {
  wisata: WisataSearchResult | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WisataDetailModal({
  wisata,
  isOpen,
  onOpenChange,
}: WisataDetailModalProps) {
  const { getCategoryColor, getCategoryIcon } = useCategoryStore();

  if (!wisata) return null;

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg gap-0 overflow-y-auto rounded-xl border-2 border-black p-0 sm:max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{wisata.name}</DialogTitle>
          <DialogDescription>Detail Wisata</DialogDescription>
        </DialogHeader>
        {/* Header (Visual) */}
        <div className="relative flex items-start justify-between border-b-2 border-black bg-slate-100 p-6 pb-4">
          <div className="flex flex-col gap-3 pr-8">
            <div
              className="flex w-fit items-center gap-1.5 rounded-md border-2 border-black px-2 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: getCategoryColor(catName) }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {catName}
            </div>
            <div>
              <h2 className="mb-1 text-2xl leading-tight font-black text-black">
                {wisata.name}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-bold text-slate-700">
                <span className="flex items-center gap-1 rounded-md border-2 border-amber-200 bg-amber-50 px-2 py-1 text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  {wisata.rating
                    ? parseFloat(wisata.rating as any).toFixed(1)
                    : "0"}
                  <span className="ml-0.5 text-xs font-semibold text-slate-500">
                    ({wisata.reviews || 0} ulasan)
                  </span>
                </span>
                {wisata.price !== undefined && wisata.price !== null && (
                  <span className="rounded-md border-2 border-green-200 bg-green-50 px-2 py-1 text-sm font-black text-green-700">
                    {wisata.price === 0
                      ? "GRATIS"
                      : `Rp ${wisata.price.toLocaleString("id-ID")}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-col space-y-6 bg-white p-6">
          {/* Section: Lokasi & Kontak */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-3 text-sm font-bold text-slate-700">
              <h4 className="mb-1 border-b-2 border-slate-100 pb-1 text-xs tracking-wider text-slate-400 uppercase">
                Lokasi
              </h4>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <span className="leading-snug capitalize">
                  {[
                    wisata.desa ? `${wisata.desa}` : null,
                    wisata.kecamatan ? `${wisata.kecamatan}` : null,
                    wisata.kabupaten,
                  ]
                    .filter(Boolean)
                    .join(", ") ||
                    wisata.address ||
                    "Tidak ada informasi alamat"}
                </span>
              </div>
              <Button
                className="mt-1 w-fit text-xs font-bold"
                size="rect"
                variant="outline"
                onClick={handleDirections}
                startIcon={<Navigation className="h-4 w-4" />}
              >
                Buka di Google Maps
              </Button>
            </div>

            {(wisata.link || wisata.username_instagram) && (
              <div className="flex flex-col gap-3 text-sm font-bold text-slate-700">
                <h4 className="mb-1 border-b-2 border-slate-100 pb-1 text-xs tracking-wider text-slate-400 uppercase">
                  Kontak & Media
                </h4>

                {wisata.link && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 shrink-0 text-purple-600" />
                    <a
                      href={wisata.link}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-purple-600 hover:underline"
                    >
                      {wisata.link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                    </a>
                  </div>
                )}

                {wisata.username_instagram && (
                  <div className="flex items-center gap-2">
                    <FaInstagram className="h-4 w-4 shrink-0 text-pink-600" />
                    <a
                      href={`https://instagram.com/${wisata.username_instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-pink-600 hover:underline"
                    >
                      {wisata.username_instagram.startsWith("@")
                        ? wisata.username_instagram
                        : `${wisata.username_instagram}`}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section: Daya Tarik */}
          {(wisata.daya_tarik_utama ||
            wisata.daya_tarik_pendukung ||
            wisata.sub_kategori) && (
            <div className="flex flex-col gap-4 rounded-lg border-2 border-black bg-yellow-50 p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              {wisata.sub_kategori && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase">
                    <Info className="h-4 w-4 text-blue-500" />
                    Sub Kategori
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    {wisata.sub_kategori}
                  </p>
                </div>
              )}

              {wisata.daya_tarik_utama && (
                <div className="mt-2 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Daya Tarik Utama
                  </div>
                  <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap text-slate-700">
                    {wisata.daya_tarik_utama}
                  </p>
                </div>
              )}

              {wisata.daya_tarik_pendukung && (
                <div className="mt-2 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase">
                    <Quote className="h-4 w-4 text-emerald-500" />
                    Daya Tarik Pendukung
                  </div>
                  <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap text-slate-700">
                    {wisata.daya_tarik_pendukung}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
