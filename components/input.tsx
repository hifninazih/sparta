import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base classes
        "flex h-10 w-full min-w-0 rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-bold ring-offset-background transition-all outline-none",
        // Neo-Brutalism Shadow
        "shadow-[2px_2px_0px_rgba(0,0,0,1)] focus-visible:shadow-[4px_4px_0px_rgba(0,0,0,1)] focus-visible:-translate-y-0.5 focus-visible:-translate-x-0.5",
        // File input styling
        "file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-foreground placeholder:text-slate-400",
        // States
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
