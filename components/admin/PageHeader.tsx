import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8", className)}>
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-800 flex items-center gap-3">
          {icon && <span className="text-blue-600 shrink-0">{icon}</span>}
          {title}
        </h1>
        {description && (
          <p className="text-slate-500 font-medium leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap gap-3 w-full sm:w-auto shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
