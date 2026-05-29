import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all outline-none placeholder:text-slate-400 focus-visible:shadow-[1px_1px_0px_rgba(0,0,0,1)] focus-visible:translate-x-[1px] focus-visible:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
