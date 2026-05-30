import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

interface SearchSectionProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
  className?: string;
}

export function SearchSection({
  placeholder,
  value,
  onChange,
  onRefresh,
  isLoading = false,
  className,
}: SearchSectionProps) {
  return (
    <div className={cn(
      "p-4 border-2 border-black rounded-xl bg-[#f8fafc] flex flex-col sm:flex-row gap-4 justify-between items-center shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-8",
      className
    )}>
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder={placeholder}
          className="pl-10"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      <Button 
        variant="outline" 
        size="rect" 
        onClick={onRefresh} 
        disabled={isLoading}
        title="Refresh Data"
      >
        <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
      </Button>
    </div>
  );
}
