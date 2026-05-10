import * as React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, onKeyDown, ...props }, ref) => {
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
          // 1. BENTUK DASAR & ANIMASI (Deklarasikan transisi 1x saja)
          "group relative flex h-12 w-full items-center overflow-hidden rounded-full bg-white px-4 shadow-md transition-all duration-300 ease-out sm:w-64",

          // 2. BORDER NEO-BRUTALISM (Menggunakan arbitrary values agar valid)
          "border border-r-2 border-b-3 border-gray-400",

          // 3. EFEK INTERAKTIF (Hover & Focus)
          "hover:bg-primary focus-within:bg-primary focus-within:border-black hover:border-black sm:focus-within:w-80",

          className,
        )}
      >
        <input
          type="text"
          ref={ref}
          onKeyDown={handleKeyDown}
          className="peer h-full w-full bg-transparent pl-8 text-sm font-semibold text-black outline-none placeholder:font-medium placeholder:text-gray-500"
          placeholder="Cari tempat wisata..."
          {...props}
        />

        <div className="absolute left-4 text-gray-400 transition-colors duration-200 group-focus-within:text-black group-hover:text-black">
          <Search className="size-5" strokeWidth={2} />
        </div>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
