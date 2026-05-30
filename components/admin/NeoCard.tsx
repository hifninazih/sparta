import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NeoCardProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: "white" | "primary" | "secondary";
  asActionCard?: boolean;
}

export function NeoCard({
  title,
  description,
  icon,
  children,
  className,
  variant = "white",
  asActionCard = false,
}: NeoCardProps) {
  const bgColors = {
    white: "bg-white",
    primary: "bg-[#DCFFBC]",
    secondary: "bg-slate-50",
  };

  return (
    <div
      className={cn(
        "group rounded-2xl border-2 border-black p-6 transition-all",
        bgColors[variant],
        asActionCard 
          ? "shadow-[2px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_8px_0px_rgba(0,0,0,1)]" 
          : "shadow-[4px_4px_0px_rgba(0,0,0,1)]",
        className
      )}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-xl font-black text-black">{title}</h3>}
          {icon && (
            <div className={cn(
              "p-3 rounded-xl border-2 border-black",
              variant === "primary" ? "bg-white text-black" : "bg-blue-50 text-blue-600"
            )}>
              {icon}
            </div>
          )}
        </div>
      )}
      {description && (
        <p className={cn(
          "text-sm font-bold mb-6 leading-relaxed",
          variant === "primary" ? "text-black/60" : "text-slate-500"
        )}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
