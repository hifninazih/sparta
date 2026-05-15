// components/search-input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react"; // Import X

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  onClear?: () => void; // Tambahan prop onClear
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, onClear, onKeyDown, value, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        onSearch(e.currentTarget.value);
      }
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    return (
      <div
        className={cn(
          "group relative flex h-12 w-full items-center overflow-hidden bg-white px-4 transition-all duration-300 ease-out",
          "rounded-full border-2 border-black shadow-[2px_3px_0px_rgba(0,0,0,1)]",
          "focus-within:translate-x-px focus-within:translate-y-px focus-within:bg-[#DCFFBC]/80 focus-within:shadow-[1px_2px_0px_rgba(0,0,0,1)]",
          className,
        )}
      >
        <div className="absolute left-4 text-black transition-colors duration-200">
          <Search className="size-5" strokeWidth={2.5} />
        </div>

        <input
          type="text"
          ref={ref}
          value={value}
          onKeyDown={handleKeyDown}
          // Tambahkan pr-10 agar teks tidak menabrak tombol X
          className="peer h-full w-full bg-transparent pr-10 pl-8 text-sm font-bold text-black outline-none placeholder:font-semibold placeholder:text-gray-500"
          placeholder="Cari tempat atau wisata..."
          {...props}
        />

        {/* Tombol Clear (Hanya muncul jika value ada isinya) */}
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-4 rounded-full p-1 text-gray-400 transition-all outline-none hover:bg-gray-100 hover:text-red-500 active:scale-90"
          >
            <X className="size-4" strokeWidth={3} />
          </button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
