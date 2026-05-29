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
        "group rounded-xl border-2 border-black p-6 transition-all duration-150",
        bgColors[variant],
        asActionCard
          ? "shadow-[1px_2px_0px_rgba(0,0,0,1)]"
          : "shadow-[2px_2px_0px_rgba(0,0,0,1)]",
        className,
      )}
    >
      {(title || icon) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h3 className="text-xl font-black tracking-tight text-black">
              {title}
            </h3>
          )}
          {icon && (
            <div
              className={cn(
                "rounded-lg border-2 border-black p-2.5 shadow-[1px_1px_0px_rgba(0,0,0,1)]",
                variant === "primary"
                  ? "bg-white text-black"
                  : "bg-primary text-black",
              )}
            >
              {icon}
            </div>
          )}
        </div>
      )}
      {description && (
        <p
          className={cn(
            "mb-6 text-sm leading-relaxed font-bold",
            variant === "primary" ? "text-black/80" : "text-slate-600",
          )}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
