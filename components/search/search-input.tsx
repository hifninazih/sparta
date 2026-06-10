// components/search/search-input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  /** Slot untuk elemen tambahan di sisi kanan (misal: tombol filter) */
  rightSlot?: React.ReactNode;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, onClear, onKeyDown, value, rightSlot, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        onSearch(e.currentTarget.value);
      }
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    // Hitung padding kanan berdasarkan ada tidaknya rightSlot dan clear button
    const hasValue = Boolean(value);
    const hasRightSlot = Boolean(rightSlot);
    // rightSlot + clear = pr-20, hanya rightSlot = pr-12, hanya clear = pr-12, none = pr-4
    const inputPrClass =
      hasValue && hasRightSlot
        ? "pr-20"
        : hasValue || hasRightSlot
          ? "pr-12"
          : "pr-4";

    return (
      <div
        className={cn(
          "group relative flex h-12 w-full items-center overflow-hidden bg-white transition-all duration-300 ease-out",
          "rounded-full border-2 border-black shadow-[2px_3px_0px_rgba(0,0,0,1)]",
          "focus-within:translate-x-px focus-within:translate-y-px focus-within:bg-[#DCFFBC]/80 focus-within:shadow-[1px_2px_0px_rgba(0,0,0,1)]",
          className,
        )}
      >
        {/* Ikon Search kiri */}
        <div className="absolute left-4 z-10 text-black transition-colors duration-200">
          <Search className="size-5" strokeWidth={2.5} />
        </div>

        <input
          type="text"
          ref={ref}
          value={value}
          onKeyDown={handleKeyDown}
          className={cn(
            "peer h-full w-full bg-transparent pl-12 text-sm font-bold text-black outline-none placeholder:font-semibold placeholder:text-gray-500",
            inputPrClass,
          )}
          placeholder="Cari tempat atau wisata..."
          {...props}
        />

        {/* Slot kanan: bisa berisi rightSlot dan/atau tombol clear */}
        <div className="absolute right-2 z-10 flex items-center gap-0.5">
          {/* rightSlot (misal: tombol filter) */}
          {rightSlot}

          {/* Tombol Clear */}
          {hasValue && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-full p-1.5 text-gray-400 transition-all outline-none hover:bg-gray-100 hover:text-red-500 active:scale-90"
            >
              <X className="size-4" strokeWidth={3} />
            </button>
          )}
        </div>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
