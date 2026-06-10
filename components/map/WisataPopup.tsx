"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/core/popover";
import { Star, MapPin, Navigation, Phone, ExternalLink, X } from "lucide-react";
import { WisataSearchResult } from "@/store/useSearchStore";
import { Button } from "@/components/core/button";
import Image from "next/image";
import { getCategoryColor } from "@/lib/wisata-categories";

interface WisataMarkerPopoverProps {
  wisata: WisataSearchResult;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function WisataMarkerPopover({ wisata, isOpen, onOpenChange, children }: WisataMarkerPopoverProps) {
  // Dummy image (placeholder) since real images are not available yet
  const dummyImage = `https://picsum.photos/seed/${wisata.gid}/400/200`;

  const handleDirections = () => {
    if (wisata.maps_link) {
      window.open(wisata.maps_link, "_blank");
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${wisata.lat},${wisata.lng}`, "_blank");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      
      <PopoverContent 
        side="top" 
        sideOffset={12} 
        className="w-[320px] p-0 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden z-[100] bg-white"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
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
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div 
              className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md border-2 border-black px-2 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: getCategoryColor(wisata.category || "Umum") }}
            >
              {wisata.category || "Lokasi Umum"}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col p-4 space-y-3">
            <div>
              <h3 className="text-lg leading-tight font-black text-black">{wisata.name}</h3>
              <div className="mt-1 flex items-center gap-3 text-sm font-bold text-slate-700">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                  {wisata.rating ? parseFloat(wisata.rating as any).toFixed(1) : "0"} 
                  <span className="text-slate-500 text-xs ml-0.5">({wisata.reviews || 0})</span>
                </span>
                <span className="text-green-600 font-black">
                  {wisata.price === 0 
                    ? "GRATIS" 
                    : wisata.price 
                      ? `Rp ${wisata.price.toLocaleString('id-ID')}` 
                      : ""}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm font-bold text-slate-600">
              {wisata.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-blue-600" />
                  <span className="line-clamp-2 leading-tight">{wisata.address}</span>
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
                  <a href={wisata.link} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline line-clamp-1">
                    Website Resmi
                  </a>
                </div>
              )}
            </div>

            <Button 
              className="w-full mt-2" 
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
