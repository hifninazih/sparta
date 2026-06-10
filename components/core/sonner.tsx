"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-6 text-black" />,
        info: <InfoIcon className="size-6 text-white group-data-[type=info]:text-white" />,
        warning: <TriangleAlertIcon className="size-6 text-black" />,
        error: <OctagonXIcon className="size-6 text-white group-data-[type=error]:text-white" />,
        loading: <Loader2Icon className="size-6 animate-spin text-black" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "group toast w-full flex items-center gap-4 p-4 rounded-xl border-2 border-black bg-white font-black text-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] mb-2",
          title: "text-black leading-tight group-data-[type=error]:text-white group-data-[type=info]:text-white",
          description: "text-black/60 font-bold text-xs group-data-[type=error]:text-white/80 group-data-[type=info]:text-white/80",
          actionButton: "group-[.toast]:bg-black group-[.toast]:text-white border-2 border-black p-2 rounded-lg text-xs transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_rgba(0,0,0,1)]",
          cancelButton: "group-[.toast]:bg-slate-200 group-[.toast]:text-black border-2 border-black p-2 rounded-lg text-xs",
          success: "bg-[#DCFFBC] text-black",
          error: "bg-red-600 text-white border-black",
          warning: "bg-amber-400 text-black",
          info: "bg-blue-600 text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
