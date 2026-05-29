import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/core/input";
import { Button } from "@/components/core/button";
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
      "p-4 border-2 border-black rounded-xl bg-white flex flex-col sm:flex-row gap-4 justify-between items-center shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-8",
      className
    )}>
      <Input 
        containerClassName="sm:w-96"
        placeholder={placeholder}
        startIcon={<Search className="h-4 w-4" />}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <Button 
        variant="outline" 
        size="rect" 
        onClick={onRefresh} 
        disabled={isLoading}
        title="Refresh Data"
        className="px-4"
      >
        <RefreshCw className={cn("h-4 w-4 sm:mr-2", isLoading && "animate-spin")} />
        <span className="hidden sm:inline">Refresh</span>
      </Button>
    </div>
  );
}
