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
    <div
      className={cn(
        "mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center sm:gap-6",
        className,
      )}
    >
      <div className="space-y-1.5">
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-black sm:text-4xl">
          {icon && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
              {icon}
            </span>
          )}
          {title}
        </h1>
        {description && (
          <p className="ml-1 max-w-2xl text-base leading-relaxed font-bold text-slate-600">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="mt-3 flex w-full shrink-0 flex-wrap gap-3 sm:mt-0 sm:w-auto">
          {children}
        </div>
      )}
    </div>
  );
}
