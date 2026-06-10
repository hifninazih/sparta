// components/shared/filter-chips.tsx
"use client";

import { cn } from "@/lib/utils";
import { WISATA_CATEGORIES, WisataCategory } from "@/lib/wisata-categories";

interface FilterChipsProps {
  /** Daftar kategori yang sedang aktif. Array kosong = "Semua" aktif. */
  value: WisataCategory[];
  onChange: (categories: WisataCategory[]) => void;
  className?: string;
}

export function FilterChips({ value, onChange, className }: FilterChipsProps) {
  const handleClick = (cat: WisataCategory) => {
    const isCurrentlySelected = value.includes(cat);

    if (isCurrentlySelected) {
      // Deselect
      onChange(value.filter((c) => c !== cat));
    } else {
      // Select — tambahkan ke array
      onChange([...value, cat]);
    }
  };

  const isActive = (cat: WisataCategory) => value.includes(cat);

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {WISATA_CATEGORIES.map((cat) => {
        const active = isActive(cat);
        return (
          <button
            key={cat}
            type="button"
            onClick={() => handleClick(cat)}
            className={cn(
              // Base: lebih besar dan bold
              "rounded-full border-2 border-black px-4 py-1.5 text-xs font-black tracking-wide transition-all duration-150 outline-none",
              // Shadow neo-brutalism (lebih tebal)
              "shadow-[2px_3px_0px_rgba(0,0,0,1)]",
              "hover:-translate-x-px hover:-translate-y-0.5 hover:cursor-pointer hover:shadow-[3px_5px_0px_rgba(0,0,0,1)]",
              "active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_rgba(0,0,0,1)]",
              // State aktif vs tidak aktif
              active
                ? "bg-primary text-primary-foreground"
                : "bg-white text-black hover:bg-primary/30",
            )}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
