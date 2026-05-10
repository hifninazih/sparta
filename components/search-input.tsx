import * as React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react"; // Gunakan ikon Search dari Lucide

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Tambahkan prop kustom di sini jika perlu, misalnya onSearch
  onSearch?: (value: string) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, onKeyDown, ...props }, ref) => {
    // Fungsi untuk menangani pencarian saat tombol "Enter" ditekan
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        onSearch(e.currentTarget.value);
      }
      // Panggil fungsi onKeyDown asli jika ada
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    return (
      <div
        className={cn(
          // Wadah luar: Bentuk Kapsul (rounded-full), latar putih, shadow melayang
          "group relative flex h-12 w-full items-center overflow-hidden rounded-full border border-r-2 border-b-3 border-gray-400 bg-white px-4 shadow-md transition-all duration-200",
          // Efek interaktif saat container di-hover atau input sedang fokus
          "hover:bg-primary hover:border-black focus-within:bg-primary focus-within:shadow-lg focus-within:border-black",
          className,
        )}
      >
        <input
          type="text"
          ref={ref}
          onKeyDown={handleKeyDown}
          // Hilangkan outline bawaan browser agar tidak mengganggu styling custom
          className="peer h-full w-full font-medium bg-transparent pr-8 text-sm text-black placeholder:text-gray-500 placeholder:font-medium  outline-none"
          placeholder="Cari tempat wisata..."
          {...props}
        />

        {/* Ikon Pencarian di sisi kanan */}
        <div className="absolute right-4 text-gray-400 transition-colors duration-200 group-focus-within:text-black">
          <Search className="size-5" strokeWidth={2} />
        </div>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
