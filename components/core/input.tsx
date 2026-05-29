import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  containerClassName?: string;
}

function Input({ className, containerClassName, type, startIcon, endIcon, ...props }: InputProps) {
  return (
    <div 
      className={cn(
        "group/input relative flex w-full",
        containerClassName
      )}
    >
      {startIcon && (
        <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors group-focus-within/input:text-black">
          {startIcon}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          // Base classes
          "flex h-10 w-full min-w-0 rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-bold ring-offset-background transition-all outline-none",
          // Neo-Brutalism Shadow
          "shadow-[2px_2px_0px_rgba(0,0,0,1)] focus-visible:shadow-[1px_1px_0px_rgba(0,0,0,1)] focus-visible:translate-x-[1px] focus-visible:translate-y-[1px]",
          // Icon Padding
          startIcon && "pl-10",
          endIcon && "pr-10",
          // File input styling
          "file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-foreground placeholder:text-slate-400",
          // States
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
      {endIcon && (
        <div className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors group-focus-within/input:text-black">
          {endIcon}
        </div>
      )}
    </div>
  )
}

export { Input }
